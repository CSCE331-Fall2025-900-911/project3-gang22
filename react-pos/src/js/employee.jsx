import React from "react";
import { useEffect, useState } from "react";
import fetchMenu from "./employee-pages/menu";

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
    const money = n => `$${Number(n).toFixed(2)}`;
    const cart = new Map();
    function add(item) { const c = cart.get(item.id) || { item, qty: 0 }; c.qty++; cart.set(item.id, c); renderCart(); }
    function dec(id) { const c = cart.get(id); if (!c) return; c.qty--; if (c.qty <= 0) cart.delete(id); renderCart(); }

    function totals() { let s = 0; cart.forEach(({ item, qty }) => s += item.price * qty); const t = s * TAX; return { s, t, tt: s + t }; }

    function renderCart() {
      const box = $('#posCartItems'); box.innerHTML = '';
      cart.forEach(({ item, qty }) => {
        const row = document.createElement('div'); row.className = 'cart-row';
        row.innerHTML = `<div class="cart-row-name">${item.drink_name}</div>
        <div class="cart-row-qty"><button class="btn sm" data-a="dec">−</button>
        <span class="qty">${qty}</span><button class="btn sm" data-a="inc">+</button></div>
        <div class="cart-row-price">${money(item.price * qty)}</div>`;
        row.querySelector('[data-a="dec"]').onclick = () => dec(item.id);
        row.querySelector('[data-a="inc"]').onclick = () => add(item);
        box.appendChild(row);
      });
      const { s, t, tt } = totals();
      $('#posSubtotal').textContent = money(s);
      $('#posTax').textContent = money(t);
      $('#posTotal').textContent = money(tt);
    }

    function renderMenu(items) {
      const grid = $('#posMenuGrid'); grid.innerHTML = '';
      items.forEach((it, i) => {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'card';
        b.innerHTML = `
        <img class="card-img" src="/images/drink${it.id}.jpg" alt="${it.drink_name}" onerror="this.src='/images/placeholder.png'">
        <div class="card-body">
          <div class="card-name">${i < 9 ? `${i + 1}. ` : ''}${it.drink_name}</div>
          <div class="card-price">${money(it.price)}</div>
        </div>`;
        b.addEventListener('click', () => add(it)); grid.appendChild(b);
      });
    }

    function bindShortcuts(items) {
      const input = $('#posSearch');
      document.addEventListener('keydown', e => {
        if (e.key === '/') { e.preventDefault(); input.focus(); }
        if (e.key >= '1' && e.key <= '9') { const idx = Number(e.key) - 1; if (items[idx]) add(items[idx]); }
        if (e.key === 'Enter') $('#posCheckout').click();
      });
      input.addEventListener('input', () => {
        const q = input.value.toLowerCase();
        renderMenu(items.filter(it => it.drink_name.toLowerCase().includes(q)));
      });
    }

    $('#posClear').addEventListener('click', () => { cart.clear(); renderCart(); });
    $('#posCheckout').addEventListener('click', () => { alert('Paid (stub)'); cart.clear(); renderCart(); });

    renderMenu(menuItems); renderCart(); bindShortcuts(menuItems);
  }, [menuItems]);

  return (
    <main className="wrap grid-2">
      <section>
        <div className="toolbar">
          <label htmlFor="posSearch" className="sr-only">Search</label>
          <input id="posSearch" className="input" type="search" placeholder="Search items (/)" />
        </div>
        <div id="posMenuGrid" className="grid-cards" aria-live="polite"></div>
      </section>
      <aside className="panel" aria-labelledby="posCartHeading">
        <h2 id="posCartHeading">Order</h2>
        <div id="posCartItems"></div>
        <div className="totals">
          <div className="row"><span>Subtotal</span><strong id="posSubtotal">$0.00</strong></div>
          <div className="row"><span>Tax</span><strong id="posTax">$0.00</strong></div>
          <div className="row total"><span>Total</span><strong id="posTotal">$0.00</strong></div>
        </div>
        <div className="row gap">
          <button id="posClear" className="btn">Void</button>
          <button id="posCheckout" className="btn primary">Charge (Enter)</button>
        </div>
        <p className="mt-sm"><a href="/">Back</a></p>
      </aside>
    </main>
  );
}
