import { useEffect, useState, useRef } from "react";
import { fetchMenu, createOrder, getCouponCode } from "./customer-pages/menu.jsx";
import { API_BASE } from "./apibase.js";
import CustomizationModal from "./customer-components/customizationModal.jsx";
import MenuDisplay from "./customer-components/menuDisplay.jsx";
import Cart from "./customer-components/cart.jsx";
import ReviewModal from "./customer-components/reviewModal.jsx";
import OrderModal from "./customer-components/orderModal.jsx";
import PaymentModal from "./customer-components/paymentModal.jsx";

export const CUSTOMER_BASE_URL = `${API_BASE}/customer`;

export default function Customer() {

  const [ menuItems, setMenuItems ] = useState([]);
  const [ cartItems, setCartItems] = useState([]);
  const [ orderInProgress, setOrderInProgress ] = useState(false);
  const [ showCustomizationModal, setShowCustomizationModal ] = useState(false);
  const [ showReviewModal, setShowReviewModal ] = useState(false);
  const [ showPaymentModal, setShowPaymentModal ] = useState(false);
  const [ currentMenuItem, setCurrentMenuItem ] = useState(null);
  const [ customizationSubtotals, setCustomizationSubtotals ] = useState([]);
  const [ subtotal, setSubtotal ] = useState(0.00);
  const [ tax, setTax ] = useState(0.00);
  const [ total, setTotal ] = useState(0.00);

  const money = (n) => `$${Number(n).toFixed(2)}`;

  // Coupon state
  const [couponDiscount, setCouponDiscount] = useState(0); // like 0.15 = 15%
  const [couponApplied, setCouponApplied] = useState(false);

  // Persistent cart (critical fix)
  const cartRef = useRef(new Map());
  const cart = cartRef.current;

  // Fetch menu on mount
  useEffect(() => {
    async function loadMenuOnStart() {
      const data = await fetchMenu();
      setMenuItems(data);
    }
    loadMenuOnStart();
  }, []);


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

    let discountedSub = sub;
    if (couponApplied && couponDiscount > 0) {
        discountedSub = sub * (1 - couponDiscount);
    }

    const newSubtotal = money(discountedSub);
    const newTax = money(discountedSub * TAX_RATE);
    const newTotal = money(discountedSub + discountedSub * TAX_RATE);

    setSubtotal(newSubtotal);
    setTax(newTax);
    setTotal(newTotal);
  }, [cartItems, customizationSubtotals, couponApplied, couponDiscount]);

  // useEffect(() => {

  //   const $ = (s, c = document) => c.querySelector(s);
  //   const TAX = 0.0825;  //   const money = (n) => `$${Number(n).toFixed(2)}`;
  //   const money = (n) => `$${Number(n).toFixed(2)}`;

  //   const cart = new Map();

  //   // =====================
  //   // Customization Modal 
  //   // =====================

  //   // const modal = $('#customModal');
  //   // const okBtn = $('#customOk');

  //   function openCustomization(menuItem) {
  //     console.log("Opening the model n shi");
  //     setShowCustomizationModal(true);
  //     setCurrentMenuItem(menuItem);
  //   }
    //   modal.classList.remove('hidden');

    //   // OPTIONAL: Replace placeholder text later
    //   // $('.modal-body').innerHTML = `<p>Customize ${item.drink_name}</p>`;

    //   okBtn.onclick = () => {
    //     modal.classList.add('hidden');
    //     add(item); // now actually add the item
    //   };
    // }

    // clicking outside the panel closes modal without adding
    // modal.addEventListener('click', e => {
    //   if (e.target === modal) {
    //     modal.classList.add('hidden');
    //   }
    // });


    // =====================
    // Review & Order Popups
    // // =====================
    // const reviewModal = $('#reviewModal');
    // const reviewBody = $('#reviewTableBody');
    // const reviewCancel = $('#reviewCancel');
    // const reviewConfirm = $('#reviewConfirm');

    // const orderModal = $('#orderModal');
    // const paySubtotal = $('#paySubtotal');
    // const payTax = $('#payTax');
    // const payTotal = $('#payTotal');
    // const orderCancel = $('#orderCancel');
    // const orderConfirm = $('#orderConfirm');

    // // Opens review modal    

    // // Opens payment modal
    // // function openPayment() {
    // //   reviewModal.classList.add("hidden");
    // //   orderModal.classList.remove("hidden");

    // //   const { sub, tax, total } = totals();
    // //   paySubtotal.textContent = money(sub);
    // //   payTax.textContent = money(tax);
    // //   payTotal.textContent = money(total);
    // // }

    // // // Cancel review modal
    // // reviewCancel.onclick = () => reviewModal.classList.add("hidden");

    // // // Confirm review → payment
    // // reviewConfirm.onclick = openPayment;

    // // // Cancel payment → return to review modal
    // // orderCancel.onclick = () => {
    // //   orderModal.classList.add("hidden");
    // //   reviewModal.classList.remove("hidden");
    // // };

    // // Confirm payment → SUBMIT ORDER
    // orderConfirm.onclick = async () => {
    //   const order_time = new Date().toISOString();
    //   const menu_ids = [];
    //   const quantities = [];
    //   const totalsArr = [];

    //   cart.forEach(({ item, qty }) => {
    //     menu_ids.push(item.id);
    //     quantities.push(qty);
    //     totalsArr.push(item.price * qty);
    //   });

    //   const orderData = {
    //     order_time,
    //     menu_ids,
    //     quantities,
    //     totals: totalsArr,
    //     card_number: $('#cardNumber').value.trim(),
    //     card_expr_m: Number($('#cardExpM').value.trim()),
    //     card_expr_y: Number($('#cardExpY').value.trim()),
    //     card_holder: $('#cardHolder').value.trim()
    //   };

    //   try {
    //     await createOrder(orderData);
    //     alert("Order submitted!");
    //     orderModal.classList.add("hidden");
    //     cart.clear();
    //     renderCart();
    //     setOrderInProgress(false);
    //   } catch (err) {
    //     alert("Error submitting order.");
    //     console.error(err);
    //   }
    // };

//     function renderMenu(items) {
//       const grid = $('#menuGrid');
//       grid.innerHTML = '';
//       items.forEach(it => {
//         const card = document.createElement('button');
//         card.type = 'button';
//         card.className = 'card';
//         card.setAttribute('aria-label', `${it.drink_name} ${money(it.price)}`);
//         card.innerHTML = `
//           <img class="card-img" src="/images/drink${it.id}.jpg" alt="${it.drink_name}" onerror="this.src='/images/placeholder.png'">
//           <div class="card-body">
//               <div class="card-name">${it.drink_name}</div>
//               <div class="card-price">${money(it.price)}</div>
//           </div>`;
//         // card.addEventListener('click', () => add(it));
//         card.addEventListener('click', () => openCustomization(it.id));
//         grid.appendChild(card);
//       });
//     }

//     function add(item) {
//       const cur = cart.get(item.id) || { item, qty: 0 };
//       cur.qty++;
//       cart.set(item.id, cur);
//       renderCart();
//     }

//     function dec(id) {
//       const cur = cart.get(id);
//       if (!cur) return;
//       cur.qty--;
//       if (cur.qty <= 0) cart.delete(id);
//       renderCart();
//     }

//     function totals() {
//       let sub = 0;
//       cart.forEach(({ item, qty }) => (sub += item.price * qty));
//       customizationSubtotals.forEach(subtotal => {sub += subtotal;});
//       const tax = sub * TAX;
//       return { sub, tax, total: sub + tax };
//     }

//     function renderCart() {
//       const box = $('#cartItems');
//       box.innerHTML = '';

//       cart.forEach(({ item, qty }) => {
//         const tr = document.createElement('tr');
//         tr.className = 'cart-row';
//         tr.innerHTML = `
//   <td>${item.drink_name}</td>

//   <td class="td-btn">
//     <button class="btn sm" data-a="dec">−</button>
//   </td>

//   <td class="td-qty">
//     ${qty}
//   </td>

//   <td class="td-btn">
//     <button class="btn sm" data-a="inc">+</button>
//   </td>

//   <td>${money(item.price * qty)}</td>
// `;


//         tr.querySelector('[data-a="dec"]').onclick = () => dec(item.id);
//         tr.querySelector('[data-a="inc"]').onclick = () => add(item);

//         box.appendChild(tr);
//       });

//       const { sub, tax, total } = totals();
//       $('#subtotal').textContent = money(sub);
//       $('#tax').textContent = money(tax);
//       $('#total').textContent = money(total);
//     }

//     $('#search').addEventListener('input', (e) => {
//       const q = e.target.value.toLowerCase();
//       const filtered = menuItems.filter(it => it.drink_name.toLowerCase().includes(q));
//       renderMenu(filtered);
//     });

//     $('#clearCart').addEventListener('click', () => {
//       cart.clear();
//       renderCart();
//     });

//     $('#checkout').addEventListener('click', openReview);


//     $('#backBtn').addEventListener('click', () => {
//       window.location.href = '/';
//     })

  //   renderMenu(menuItems);
  //   renderCart();
  // }, [menuItems]);

  function addItem(itemToAddID, customizations) {
   setCartItems(previousCartItems => {
      const baseItem = menuItems.find(item => item.id === itemToAddID);
      const newCustomizationString = JSON.stringify(customizations);
      const existingItemIndex = previousCartItems.findIndex(item => {
      if (item.id === itemToAddID) {
        const existingCustomizationString = JSON.stringify(item.customization);
        return existingCustomizationString === newCustomizationString;
      }
      return false;
      });

      if (existingItemIndex !== -1) {
        return previousCartItems.map((item, index) => {
          if (index === existingItemIndex) {
              return { ...item, qty: item.qty + 1 };
          }
          return item;
        });

      } 
      else {
        const newItem = { 
          cardID: Date.now().toString() + Math.random().toFixed(4), 
          ...baseItem, 
          qty: 1, 
          customization: customizations 
        };
        return [...previousCartItems, newItem];
      }
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
  };

  // =====================
  // JSX Render
  // =====================
  return (
    <>
      {!orderInProgress && (
        <div className="kiosk-entry">
          Place Order
          <button className="btn" onClick={() => setOrderInProgress(true)}>Begin</button>
        </div>
      )}

      <main className="wrap grid-2">
        <MenuDisplay menuItems={menuItems} money={money} setShowCustomizationModal={setShowCustomizationModal} setCurrentMenuItem={setCurrentMenuItem}/>
        <Cart openReview={openReview} setCartItems={setCartItems} cartItems={cartItems} money={money} increaseQty={increaseQty} decreaseQty={decreaseQty} subtotal={subtotal} tax={tax} total={total} />
        {showCustomizationModal && 
          <CustomizationModal 
            menuItemID={currentMenuItem} 
            addItem={addItem}
            setShowCustomizationModal={setShowCustomizationModal}
            setCustomizationSubtotals={setCustomizationSubtotals}
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
          subtotal={subtotal} 
          tax={tax} 
          total={total} 
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
            setOrderInProgress={setOrderInProgress}/>}
       
      </main>
    </>
  );
}
