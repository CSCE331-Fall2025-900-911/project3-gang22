import React, { } from "react";
import { useEffect, useState } from "react";
import fetchMenu from "./customer-pages/menu.jsx";


export default function Customer() {

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
        card.addEventListener('click', () => add(it));
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

    $('#checkout').addEventListener('click', () => {
      alert('Thanks! (stub)');
      cart.clear();
      renderCart();
    });

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
          <button id="backBtn" className="btn">Back</button>
          <label htmlFor="search" className="sr-only">Search menu</label>
          <input id="search" className="input" type="search" placeholder="Search drinks…" />
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
        </div>
      </aside>

    </main>
  );
}
