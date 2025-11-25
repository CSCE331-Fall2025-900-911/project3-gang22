import React, { } from "react";
import { useEffect, useState } from "react";
import { fetchMenu, createOrder } from "./employee-pages/menu.jsx";


// function bindShortcuts(items){
//   const input=$('#posSearch');
//   document.addEventListener('keydown',e=>{
//     if(e.key==='/'){ e.preventDefault(); input.focus(); }
//     if(e.key>='1'&&e.key<='9'){ const idx=Number(e.key)-1; if(items[idx]) add(items[idx]); }
//     if(e.key==='Enter') $('#posCheckout').click();
//   });
//   input.addEventListener('input',()=>{
//     const q=input.value.toLowerCase();
//     renderMenu(items.filter(it=>it.drink_name.toLowerCase().includes(q)));
//   });
// }

export default function Employee() {

  const [menuItems, setMenuItems] = useState([]);

  // Fetches menu data whenever component is mounted
  useEffect(() => {
    async function loadMenuOnStart() {
      const data = await fetchMenu();
      setMenuItems(data);
    }
    loadMenuOnStart();
  }, [])


  useEffect(() => {

    const $ = (s, c = document) => c.querySelector(s);
    const TAX = 0.0825;
    const money = (n) => `$${Number(n).toFixed(2)}`;

    const cart = new Map();

    // =====================
    // Customization Modal 
    // =====================

    const modal = $('#customModal');
    const okBtn = $('#customOk');

    function openCustomization(item) {
      modal.classList.remove('hidden');

      // OPTIONAL: Replace placeholder text later
      // $('.modal-body').innerHTML = `<p>Customize ${item.drink_name}</p>`;

      okBtn.onclick = () => {
        modal.classList.add('hidden');
        add(item); // now actually add the item
      };
    }

    // clicking outside the panel closes modal without adding
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });


    // =====================
    // Review & Order Popups
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

    // Opens review modal
    function openReview() {
      // Prevent opening if cart is empty
      if (cart.size === 0) {
        alert("Your cart is empty!");
        return;
      }

      reviewModal.classList.remove("hidden");

      // Fill review table
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
    }

    // Opens payment modal
    function openPayment() {
      reviewModal.classList.add("hidden");
      orderModal.classList.remove("hidden");

      const { sub, tax, total } = totals();
      paySubtotal.textContent = money(sub);
      payTax.textContent = money(tax);
      payTotal.textContent = money(total);
    }

    // Cancel review modal
    reviewCancel.onclick = () => reviewModal.classList.add("hidden");

    // Confirm review → payment
    reviewConfirm.onclick = openPayment;

    // Cancel payment → return to review modal
    orderCancel.onclick = () => {
      orderModal.classList.add("hidden");
      reviewModal.classList.remove("hidden");
    };

    // Confirm payment → SUBMIT ORDER
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
        employee_id: 1, // TODO: make the current logged in employee
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
      } catch (err) {
        alert("Error submitting order.");
        console.error(err);
      }
    };

    // =====================
    // Render Menu and Inline Cart
    // =====================

    function renderMenu(items) {
      const grid = $('#menuGrid');
      grid.innerHTML = '';
      items.forEach(it => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'card';
        card.setAttribute('aria-label', `${it.drink_name} ${money(it.price)}`);
        card.innerHTML = `
          <img class="card-img" src="/images/drink${it.id}.jpg" alt="${it.drink_name}" onerror="this.src='/images/placeholder.png'">
          <div class="card-body">
              <div class="card-name">${it.drink_name}</div>
              <div class="card-price">${money(it.price)}</div>
          </div>`;
        // card.addEventListener('click', () => add(it));
        card.addEventListener('click', () => openCustomization(it));
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

    function totals() {
      let sub = 0;
      cart.forEach(({ item, qty }) => (sub += item.price * qty));
      const tax = sub * TAX;
      return { sub, tax, total: sub + tax };
    }

    function renderCart() {
      const box = $('#cartItems');
      box.innerHTML = '';

      cart.forEach(({ item, qty }) => {
        const tr = document.createElement('tr');
        tr.className = 'cart-row';
        tr.innerHTML = `
  <td>${item.drink_name}</td>

  <td class="td-btn">
    <button class="btn sm" data-a="dec">−</button>
  </td>

  <td class="td-qty">
    ${qty}
  </td>

  <td class="td-btn">
    <button class="btn sm" data-a="inc">+</button>
  </td>

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

    $('#search').addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const filtered = menuItems.filter(it => it.drink_name.toLowerCase().includes(q));
      renderMenu(filtered);
    });

    $('#clearCart').addEventListener('click', () => {
      cart.clear();
      renderCart();
    });

    $('#checkout').addEventListener('click', openReview);


    $('#backBtn').addEventListener('click', () => {
      window.location.href = '/';
    })

    renderMenu(menuItems);
    renderCart();
  }, [menuItems]);

  return (
    <main className="wrap grid-2">
      <section>
        <div className="toolbar">
          <button id="backBtn" className="btn gap-right">Back</button>
          <label htmlFor="search" className="sr-only">Search menu</label>
          <input id="search" className="search-input" type="search" placeholder="Search drinks…" />
        </div>
        <div id="menuGrid" className="grid-cards" aria-live="polite"></div>
      </section>

      <aside className="panel" aria-labelledby="cartHeading">
        <div id="cartHeadingBox">
          <h2 id="cartHeading">Your Cart</h2>
        </div>

        <div className="cart-table-wrap">
          <table className="cart-table">
            <colgroup>
              <col style={{ width: "52%" }} />   {/* Item */}
              <col style={{ width: "8%" }} />    {/* – */}
              <col style={{ width: "8%" }} />    {/* qty */}
              <col style={{ width: "8%" }} />    {/* + */}
              <col style={{ width: "24%" }} />   {/* price */}
            </colgroup>

            <tbody id="cartItems"></tbody>
          </table>
        </div>

        <div className="totals">
          <div className="row gap-md"><span>Subtotal</span><strong id="subtotal">$0.00</strong></div>
          <div className="row gap-sm"><span>Tax</span><strong id="tax">$0.00</strong></div>
          <div className="row gap-sm total"><span>Total</span><strong id="total">$0.00</strong></div>
        </div>

        <div className="row gap-lg">
          <button id="clearCart" className="btn">Clear</button>
          <button id="checkout" className="btn primary">Checkout</button>
          {/* <button id="reviewBtn" className="btn primary">Review Cart</button> */}
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


      {/* --- Review Cart Modal --- */}
      <div id="reviewModal" className="modal-overlay hidden">
        <div className="modal-panel large">
          <h2>Review Your Order</h2>

          <div className="modal-body">
            <table className="cart-table review-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody id="reviewTableBody"></tbody>
            </table>
          </div>

          <div className="modal-footer row gap">
            <button id="reviewCancel" className="btn gap-right">Cancel</button>
            <button id="reviewConfirm" className="btn primary">Confirm</button>
          </div>
        </div>
      </div>

      {/* --- Place Order Modal --- */}
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
              <input id="cardNumber" className="card-input" placeholder="1234 5678 9012 3456" />
            </div>

            <div className="card-field">
              <label>Expiration (MM / YY)</label>
              <div className="card-row">
                <input id="cardExpM" className="card-input card-exp-small" placeholder="MM" />
                <input id="cardExpY" className="card-input card-exp-small" placeholder="YY" />
              </div>
            </div>

            <div className="card-field">
              <label>Cardholder Name</label>
              <input id="cardHolder" className="card-input" placeholder="Name on card" />
            </div>

          </div>

          <div className="modal-footer row gap">
            <button id="orderCancel" className="btn gap-right">Back</button>
            <button id="orderConfirm" className="btn primary">Submit Order</button>
          </div>
        </div>
      </div>

    </main>
  );
}
