import { useEffect, useState, useRef } from "react";
import { fetchMenu, createOrder, getCouponCode, translateOne, translateBatch } from "./customer-pages/menu.jsx";
import { API_BASE } from "./apibase.js";
import CustomizationModal from "./customer-components/customizationModal.jsx";
import MenuDisplay from "./customer-components/menuDisplay.jsx";
import Cart from "./customer-components/cart.jsx";
import Weather from "./customer-components/weather.jsx";
import ReviewModal from "./customer-components/reviewModal.jsx";
import OrderModal from "./customer-components/orderModal.jsx";
import PaymentModal from "./customer-components/paymentModal.jsx";
import LanguageSelector, { translate } from "./customer-components/languageSelector.jsx";

export const CUSTOMER_BASE_URL = `${API_BASE}/customer`;

export default function Customer() {

  const [menuItems, setMenuItems] = useState([]);
  const [defaultMenuItems, setDefaultMenuItems ] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [orderInProgress, setOrderInProgress] = useState(true);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentMenuItem, setCurrentMenuItem] = useState(null);
  const [customizationSubtotals, setCustomizationSubtotals] = useState([]);
  const [subtotal, setSubtotal] = useState(0.00);
  const [tax, setTax] = useState(0.00);
  const [total, setTotal] = useState(0.00);

  const [ currentLanguage, setCurrentLanguage ] = useState('en');  

  const money = (n) => `$${Number(n).toFixed(2)}`;

  // Coupon state
  const [couponDiscount, setCouponDiscount] = useState(0); // like 0.15 = 15%
  const [couponApplied, setCouponApplied] = useState(false);

  // Wheel / extra discount state
  const [flatDiscount, setFlatDiscount] = useState(0); // for $1 off
  const [wheelUsed, setWheelUsed] = useState(false);   // to avoid multiple spins per visit


  // Category filter state
  const categoryOrder = ['Milk Tea', 'Fruit Tea', 'Smoothie', 'Slush', 'Specialty'];
  const [selectedCategory, setSelectedCategory] = useState('Milk Tea');

  // Persistent cart (critical fix)
  const cartRef = useRef(new Map());
  const cart = cartRef.current;

  // Fetch menu on mount
  useEffect(() => {
    async function loadMenuOnStart() {
      const data = await fetchMenu();
      setMenuItems(data);
      setDefaultMenuItems(data);
    }
    loadMenuOnStart();
  }, []);
    
  useEffect(() => {
    if (currentLanguage === 'en') { 
      setMenuItems(defaultMenuItems);
      return;
    }
      async function translateMenu() {
          try {
            const drinkNames = defaultMenuItems.map(item => item.drink_name);
            
            // 2. Translate the array of strings
            const translatedNames = await translate(drinkNames, currentLanguage);
            
            // 3. Rebuild the menu items with translated names
            const translatedMenu = defaultMenuItems.map((item, index) => ({
                ...item,
                drink_name: translatedNames[index] 
            }));
            setMenuItems(translatedMenu);
          }
          catch (err) {
              console.error("Error batch translating text:", err);
          }
      }
      translateMenu();
  },[currentLanguage])



  // =========================
  // MAIN DOM EFFECT
  // =========================
  useEffect(() => {
    const TAX_RATE = 0.0825;
    let sub = 0;

    cartItems.forEach(item => {
      const price = Number(item?.price) || 0;
      const qty = Number(item?.qty) || 1;
      sub += price * qty;
      sub += item.customization.totalCustomizationPrice;
    });

    // Apply percentage coupon first
    let discountedSub = sub;
    if (couponApplied && couponDiscount > 0) {
      discountedSub = sub * (1 - couponDiscount);
    }

    // Apply mystery wheel discount (flat $ amount)
    if (wheelUsed && flatDiscount > 0) {
      discountedSub = Math.max(0, discountedSub - flatDiscount);
    }

    const newSubtotal = money(discountedSub);
    const newTax = money(discountedSub * TAX_RATE);
    const newTotal = money(discountedSub + discountedSub * TAX_RATE);

    setSubtotal(newSubtotal);
    setTax(newTax);
    setTotal(newTotal);
  }, [
    cartItems,
    customizationSubtotals,
    couponApplied,
    couponDiscount,
    wheelUsed,
    flatDiscount   //NEW dependency
  ]);


  async function addItem(itemToAddID, customizations) {
  const lang = localStorage.getItem("lang") || "en";

  const baseItem = menuItems.find(item => item.id === itemToAddID);

  // Translate BEFORE calling setCartItems
  let translatedName = baseItem.drink_name;
  if (lang !== "en") {
    try {
      translatedName = await translateOne(baseItem.drink_name, lang);
    } catch (e) {
      console.error("Translation failed:", e);
    }
  }

  // Now update cart
  setCartItems(previousCartItems => {
    const newCustomizationString = JSON.stringify(customizations);

    const existingItemIndex = previousCartItems.findIndex(item => {
      if (item.id === itemToAddID) {
        const existingCustomizationString = JSON.stringify(item.customization);
        return existingCustomizationString === newCustomizationString;
      }
      return false;
    });

    if (existingItemIndex !== -1) {
      return previousCartItems.map((item, index) =>
        index === existingItemIndex
          ? { ...item, qty: item.qty + 1 }
          : item
      );
    }

    const newItem = {
      cardID: Date.now().toString() + Math.random().toFixed(4),
      ...baseItem,
      drink_name: translatedName,
      qty: 1,
      customization: customizations
    };

    return [...previousCartItems, newItem];
  });
}


  function openReview() {
    // Prevent opening if cart is empty
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    setShowReviewModal(true);
  }

  function increaseQty(itemCardID) {
    setCartItems(oldCartItems => {
      return oldCartItems.map(item => {
        if (item.cardID === itemCardID) {
          return { ...item, qty: item.qty + 1 };
        }
        return item;
      })
    })
  }

  function decreaseQty(itemCardID) { // Now accepts the unique instance ID
    setCartItems(oldCartItems => {
      const newCartItems = oldCartItems.map(item => {
        if (item.cardID === itemCardID) {
          return { ...item, qty: item.qty - 1 };
        }
        return item;
      })
      const filteredItems = newCartItems.filter(item => item.qty > 0);
      return filteredItems;
    })
  }

  function clearCart() {
    setCartItems([]);
  }

  async function applyCoupon(code) {
    if (couponApplied) {
      alert("A coupon is already applied.");
      return false;
    }

    try {
      const pct = await getCouponCode(code);
      if (pct && pct > 0) {
        setCouponDiscount(pct);
        setCouponApplied(true);
        alert(`Coupon applied! ${pct * 100}% off`);
        return true;
      } else {
        alert("Invalid coupon code.");
        return false;
      }
    } catch (err) {
      console.error(err);
      alert("Invalid coupon code.");
      return false;
    }
  }

  async function spinWheel() {
    if (wheelUsed) {
      alert("You've already spun the wheel this visit.");
      return;
    }

    try {
      const res = await fetch(CUSTOMER_BASE_URL + "/spin-wheel", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!data || data.ok === false) {
        alert(data?.message || "Unable to spin the wheel right now.");
        return;
      }

      // Prevent further spins
      setWheelUsed(true);

      if (data.type === "percent") {
        // e.g. 0.05, 0.10, 0.15
        setCouponDiscount(data.value);
        setCouponApplied(true);
        alert(`You won ${data.value * 100}% off! Code: ${data.code}`);
      } else if (data.type === "amount") {
        // e.g. $1 off
        setFlatDiscount(data.value);
        alert(`You won $${data.value.toFixed(2)} off! Code: ${data.code}`);
      } else if (data.type === "none") {
        alert(data.message || "Sip happens! No discount this time, but you're still tea-rrific 💛");
      }
    } catch (err) {
      console.error(err);
      alert("Error spinning the wheel. Please try again later.");
    }
  }


  // =====================
  // JSX Render
  // =====================
  return (
    <>
      <LanguageSelector currentLanguage={currentLanguage} setCurrentLanguage={setCurrentLanguage}/>
      {/* {!orderInProgress && (
        <div className="kiosk-entry">
          Place Order
          <button className="btn" onClick={() => setOrderInProgress(true)}>Begin</button>
        </div>
      )} */}

      <main className="wrap grid-2">
        <MenuDisplay
          menuItems={menuItems}
          money={money}
          setShowCustomizationModal={setShowCustomizationModal}
          setCurrentMenuItem={setCurrentMenuItem}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          currentLanguage={currentLanguage}
        />

        <div className="cart-stack">
          <Weather></Weather>
          <Cart
           openReview={openReview} 
           setCartItems={setCartItems} 
           cartItems={cartItems} 
           money={money} 
           increaseQty={increaseQty} 
           decreaseQty={decreaseQty} 
           subtotal={subtotal} 
           tax={tax} 
           total={total}
           currentLanguage={currentLanguage} />
        </div>

        {showCustomizationModal &&
          <CustomizationModal
            menuItemID={currentMenuItem}
            addItem={addItem}
            setShowCustomizationModal={setShowCustomizationModal}
            setCustomizationSubtotals={setCustomizationSubtotals}
            currentLanguage={currentLanguage}
          />}

        {showReviewModal &&
          <ReviewModal
            cartItems={cartItems}
            money={money}
            setShowReviewModal={setShowReviewModal}
            setShowPaymentModal={setShowPaymentModal}
            couponApplied={couponApplied}
            couponDiscount={couponDiscount}
            applyCoupon={applyCoupon}
            spinWheel={spinWheel}
            wheelUsed={wheelUsed}
            subtotal={subtotal}
            tax={tax}
            total={total}
            currentLanguage={currentLanguage}
          />}

        <OrderModal />

        {showPaymentModal &&
          <PaymentModal
            cartItems={cartItems}
            clearCart={clearCart}
            createOrder={createOrder}
            subtotal={subtotal}
            tax={tax}
            total={total}
            setShowPaymentModal={setShowPaymentModal}
            setOrderInProgress={setOrderInProgress} />}

      </main>
    </>
  );
}
