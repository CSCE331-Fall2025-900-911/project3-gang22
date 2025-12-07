import { useEffect, useState, useRef } from "react";
import { fetchMenu, createOrder, getCouponCode } from "./customer-pages/menu.jsx";
import { API_BASE } from "./apibase.js";

export const CUSTOMER_BASE_URL = `${API_BASE}/customer`;

export default function Customer() {

  const [menuItems, setMenuItems] = useState([]);
  const [orderInProgress, setOrderInProgress] = useState(false);

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

    const $ = (s, c = document) => c.querySelector(s);
    const TAX = 0.0825;
    const money = (n) => `$${Number(n).toFixed(2)}`;


    // =====================
    // Customization Modal 
    // =====================
    const modal = $('#customModal');
    const okBtn = $('#customOk');

    function openCustomization(item) {
      modal.classList.remove('hidden');

      okBtn.onclick = () => {
        modal.classList.add('hidden');
        add(item);
      };
    }

    modal.onclick = (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    };


    // =====================
    // Review & Order Modals
    // =====================
    const reviewModal = $('#reviewModal');
    const reviewBody = $('#reviewTableBody');

    const reviewCancel = $('#reviewCancel');
    const reviewConfirm = $('#reviewConfirm');

    const orderModal = $('#orderModal');
    const paySubtotal = $('#paySubtotal');
    const payTax = $('#payTax');
    const payTotal = $('#payTotal');

    const orderCancel = $('#orderCancel');
    const orderConfirm = $('#orderConfirm');


    // =====================
    // Update Totals Helpers
    // =====================

    function totals(_couponApplied, _couponDiscount) {
      // weird hack to override these optionally
      if (!_couponApplied) _couponApplied = couponApplied;
      if (!_couponDiscount) _couponDiscount = couponDiscount;
      let sub = 0;
      cart.forEach(({ item, qty }) => (sub += item.price * qty));

      // apply coupon if active
      if (_couponApplied && _couponDiscount > 0) {
        sub = sub * (1 - _couponDiscount);
      }

      const tax = sub * TAX;
      return { sub, tax, total: sub + tax };
    }

    function updateReviewTotals(_couponApplied, _couponDiscount) {
      const { sub, tax, total } = totals(_couponApplied, _couponDiscount);
      $('#revSubtotal').textContent = money(sub);
      $('#revTax').textContent = money(tax);
      $('#revTotal').textContent = money(total);
    }


    // =====================
    // Review modal open
    // =====================
    function openReview() {

      // if cart empty — don't open
      if (cart.size === 0) {
        alert("Your cart is empty!");
        return;
      }

      reviewModal.classList.remove("hidden");

      // fill review rows
      reviewBody.innerHTML = "";
      cart.forEach(({ item, qty }) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${item.drink_name}</td>
          <td>${qty}</td>
          <td>${money(item.price * qty)}</td>
        `;
        reviewBody.appendChild(tr);
      });

      updateReviewTotals();
    }


    // =====================
    // Coupon Apply Handler
    // =====================
    $('#applyCouponBtn').onclick = async () => {

      if (couponApplied) {
        alert("A coupon is already applied.");
        return;
      }

      const code = $('#couponInput').value.trim();
      if (!code) {
        alert("Please enter a code.");
        return;
      }

      try {
        const pct = await getCouponCode(code);
        if (pct && pct > 0) {
          setCouponDiscount(pct);
          setCouponApplied(true);
          updateReviewTotals(true, pct);

          alert(`Coupon applied! ${pct * 100}% off`);

        } else {
          alert("Invalid coupon code.");
        }
      } catch (err) {
        console.error(err);
        alert("Invalid coupon code.");
      }
    };


    // =====================
    // Payment Modal
    // =====================
    function openPayment() {
      reviewModal.classList.add("hidden");
      orderModal.classList.remove("hidden");

      const { sub, tax, total } = totals();
      paySubtotal.textContent = money(sub);
      payTax.textContent = money(tax);
      payTotal.textContent = money(total);
    }

    reviewCancel.onclick = () => reviewModal.classList.add("hidden");
    reviewConfirm.onclick = openPayment;

    orderCancel.onclick = () => {
      orderModal.classList.add("hidden");
      reviewModal.classList.remove("hidden");
      updateReviewTotals();
    };


    // =====================
    // Submit order
    // =====================
    orderConfirm.onclick = async () => {

      const order_time = new Date().toISOString();
      const menu_ids = [];
      const quantities = [];
      const totalsArr = [];

      cart.forEach(({ item, qty }) => {
        menu_ids.push(item.id);
        quantities.push(qty);
        totalsArr.push(item.price * qty);
      });

      const orderData = {
        order_time,
        menu_ids,
        quantities,
        totals: totalsArr,
        card_number: $('#cardNumber').value.trim(),
        card_expr_m: Number($('#cardExpM').value.trim()),
        card_expr_y: Number($('#cardExpY').value.trim()),
        card_holder: $('#cardHolder').value.trim()
      };

      try {
        await createOrder(orderData);
        alert("Order submitted!");
        orderModal.classList.add("hidden");
        cart.clear();
        renderCart();
        setOrderInProgress(false);
      } catch (err) {
        alert("Error submitting order.");
        console.error(err);
      }
    };


    // =====================
    // Menu + Cart Rendering
    // =====================
    function renderMenu(items) {
      const grid = $('#menuGrid');
      grid.innerHTML = "";
      items.forEach(it => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "card";
        card.innerHTML = `
          <img class="card-img" src="/images/drink${it.id}.jpg" onerror="this.src='/images/placeholder.png'">
          <div class="card-body">
            <div class="card-name">${it.drink_name}</div>
            <div class="card-price">${money(it.price)}</div>
          </div>
        `;
        card.onclick = () => openCustomization(it);
        grid.appendChild(card);
      });
    }


    function add(item) {
      const cur = cart.get(item.id) || { item, qty: 0 };
      cur.qty++;
      cart.set(item.id, cur);
      renderCart();
    }

    function dec(id) {
      const cur = cart.get(id);
      if (!cur) return;
      cur.qty--;
      if (cur.qty <= 0) cart.delete(id);
      renderCart();
    }


    function renderCart() {
      const box = $('#cartItems');
      box.innerHTML = "";

      cart.forEach(({ item, qty }) => {
        const tr = document.createElement("tr");
        tr.className = "cart-row";
        tr.innerHTML = `
          <td>${item.drink_name}</td>
          <td class="td-btn"><button class="btn sm" data-a="dec">−</button></td>
          <td class="td-qty">${qty}</td>
          <td class="td-btn"><button class="btn sm" data-a="inc">+</button></td>
          <td>${money(item.price * qty)}</td>
        `;

        tr.querySelector('[data-a="dec"]').onclick = () => dec(item.id);
        tr.querySelector('[data-a="inc"]').onclick = () => add(item);

        box.appendChild(tr);
      });

      const { sub, tax, total } = totals();
      $('#subtotal').textContent = money(sub);
      $('#tax').textContent = money(tax);
      $('#total').textContent = money(total);
    }


    // =====================
    // Event Listeners
    // =====================
    $('#search').oninput = (e) => {
      const q = e.target.value.toLowerCase();
      const filtered = menuItems.filter(it => it.drink_name.toLowerCase().includes(q));
      renderMenu(filtered);
    };

    $('#clearCart').onclick = () => {
      cart.clear();
      renderCart();
    };

    // IMPORTANT: this avoids multiple handlers
    $('#checkout').onclick = openReview;

    $('#backBtn').onclick = () => (window.location.href = "/");


    // Initial renders
    renderMenu(menuItems);
    renderCart();

  }, [menuItems, couponApplied, couponDiscount]); // include coupon states


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

        {/* MENU SECTION */}

        <section>
          <div className="toolbar">
            <button id="backBtn" className="btn gap-right">Back</button>
            <input id="search" className="search-input" type="search" placeholder="Search drinks…" />
          </div>
          <div id="menuGrid" className="grid-cards"></div>
        </section>


        {/* CART SIDEBAR */}

        <aside className="panel">
          <h2>Your Cart</h2>

          <div className="cart-table-wrap">
            <table className="cart-table">
              <tbody id="cartItems"></tbody>
            </table>
          </div>

          <div className="totals">
            <div className="row"><span>Subtotal</span><strong id="subtotal">$0.00</strong></div>
            <div className="row"><span>Tax</span><strong id="tax">$0.00</strong></div>
            <div className="row total"><span>Total</span><strong id="total">$0.00</strong></div>
          </div>

          <div className="row gap-lg">
            <button id="clearCart" className="btn">Clear</button>
            <button id="checkout" className="btn primary">Checkout</button>
          </div>
        </aside>

          <div id="customModal" className="modal-overlay hidden">
        <div className="modal-panel">
          <h2>Customizations</h2>

          <div className="modal-body">
            <p>Customization options will go here…</p>
          </div>

          <div className="modal-footer">
            <button id="customOk" className="btn primary">Done</button>
          </div>
        </div>
      </div>



        {/* ============================
            REVIEW MODAL
        ============================ */}
        <div id="reviewModal" className="modal-overlay hidden">
          <div className="modal-panel large">
            <h2>Review Your Order</h2>

            <div className="modal-body">

              <div className="coupon-row row gap" style={{ marginBottom: "12px" }}>
                <input id="couponInput" className="card-input" placeholder="Enter coupon code…" />
                <button id="applyCouponBtn" className="btn">Apply</button>
              </div>

              <table className="cart-table review-table">
                <thead>
                  <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
                </thead>
                <tbody id="reviewTableBody"></tbody>
              </table>

              <div id="reviewTotals" className="totals mb">
                <div className="row"><span>Subtotal</span><strong id="revSubtotal">$0.00</strong></div>
                <div className="row"><span>Tax</span><strong id="revTax">$0.00</strong></div>
                <div className="row total"><span>Total</span><strong id="revTotal">$0.00</strong></div>
              </div>

            </div>

            <div className="modal-footer row">
              <button id="reviewCancel" className="btn">Cancel</button>
              <button id="reviewConfirm" className="btn primary">Confirm</button>
            </div>
          </div>
        </div>


        {/* ============================
            PAYMENT MODAL
        ============================ */}
        <div id="orderModal" className="modal-overlay hidden">
          <div className="modal-panel large">
            <h2>Payment Details</h2>

            <div className="modal-body">

              <div className="totals mb">
                <div className="row"><span>Subtotal</span><strong id="paySubtotal">$0.00</strong></div>
                <div className="row"><span>Tax</span><strong id="payTax">$0.00</strong></div>
                <div className="row total"><span>Total</span><strong id="payTotal">$0.00</strong></div>
              </div>

              <div className="card-field">
                <label>Card Number</label>
                <input id="cardNumber" className="card-input" />
              </div>

              <div className="card-field">
                <label>Expiration (MM / YY)</label>
                <div className="card-row">
                  <input id="cardExpM" className="card-input card-exp-small" />
                  <input id="cardExpY" className="card-input card-exp-small" />
                </div>
              </div>

              <div className="card-field">
                <label>Cardholder Name</label>
                <input id="cardHolder" className="card-input" />
              </div>

            </div>

            <div className="modal-footer row">
              <button id="orderCancel" className="btn">Back</button>
              <button id="orderConfirm" className="btn primary">Submit Order</button>
            </div>
          </div>
        </div>


      </main>
    </>
  );
}
