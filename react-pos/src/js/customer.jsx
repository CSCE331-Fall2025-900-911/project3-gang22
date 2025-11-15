import React, { } from "react";
import { useEffect , useState } from "react";
import fetchMenu from "./customer-pages/menu.jsx";

export default function Customer() {

    const [ menuItems, setMenuItems ] = useState([]);

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
          const row = document.createElement('div');
          row.className = 'cart-row';
          row.innerHTML = `
          <div class="cart-row-name">${item.drink_name}</div>
          <div class="cart-row-qty">
              <button class="btn sm" data-a="dec">−</button>
              <span class="qty">${qty}</span>
              <button class="btn sm" data-a="inc">+</button>
          </div>
          <div class="cart-row-price">${money(item.price * qty)}</div>`;
          row.querySelector('[data-a="dec"]').onclick = () => dec(item.id);
          row.querySelector('[data-a="inc"]').onclick = () => add(item);
          box.appendChild(row);
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

      renderMenu(menuItems);
      renderCart();
  }, [menuItems]);

  return (
    <main className="wrap grid-2">
      <section>
        <div className="toolbar">
          <label htmlFor="search" className="sr-only">Search menu</label>
          <input id="search" className="input" type="search" placeholder="Search drinks…" />
        </div>
        <div id="menuGrid" className="grid-cards" aria-live="polite"></div>
      </section>

      <aside className="panel" aria-labelledby="cartHeading">
        <h2 id="cartHeading">Your Cart</h2>
        <div id="cartItems"></div>
        <div className="totals">
          <div className="row"><span>Subtotal</span><strong id="subtotal">$0.00</strong></div>
          <div className="row"><span>Tax</span><strong id="tax">$0.00</strong></div>
          <div className="row total"><span>Total</span><strong id="total">$0.00</strong></div>
        </div>
        <div className="row gap">
          <button id="clearCart" className="btn">Clear</button>
          <button id="checkout" className="btn primary">Checkout</button>
        </div>
        <p className="mt-sm"><a href="/">Back</a></p>
      </aside>
    </main>
  );
}
