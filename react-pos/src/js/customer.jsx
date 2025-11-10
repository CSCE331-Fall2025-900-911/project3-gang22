import React, { useEffect } from "react";

export default function Customer() {
  useEffect(() => {
    const $ = (s, c = document) => c.querySelector(s);
    const TAX = 0.0825;
    const money = (n) => `$${Number(n).toFixed(2)}`;

    const MENU = [
      { id: 1, name: 'Classic Black Milk Tea with Boba', price: 4.50, image: '/images/drink1-3.jpg' },
      { id: 2, name: 'Jasmine Green Milk Tea with Boba', price: 4.75, image: '/images/drink1-3.jpg' },
      { id: 3, name: 'Oolong Milk Tea with Boba', price: 4.95, image: '/images/drink1-3.jpg' },
      { id: 4, name: 'Taro Milk Tea with Boba', price: 5.25, image: '/images/drink4.jpg' },
      { id: 5, name: 'Thai Milk Tea with Boba', price: 5.10, image: '/images/drink5.jpg' },
      { id: 6, name: 'Honeydew Milk Tea with Boba', price: 4.85, image: '/images/drink6.jpg' },
      { id: 7, name: 'Matcha Latte with Boba', price: 5.50, image: '/images/drink7.jpg' },
      { id: 8, name: 'Brown Sugar Milk Tea with Boba', price: 5.75, image: '/images/drink8.jpg' },
      { id: 9, name: 'Strawberry Fruit Tea with Boba', price: 4.60, image: '/images/placeholder.png' },
      { id: 10, name: 'Mango Fruit Tea with Boba', price: 4.70, image: '/images/drink10.jpg' },
      { id: 11, name: 'Lychee Fruit Tea with Boba', price: 4.95, image: '/images/drink11.jpg' },
      { id: 12, name: 'Passionfruit Green Tea with Boba', price: 4.90, image: '/images/placeholder.png' },
      { id: 13, name: 'Peach Oolong Tea with Boba', price: 5.00, image: '/images/drink13.jpg' },
      { id: 14, name: 'Coconut Milk Tea with Boba', price: 5.15, image: '/images/drink14.jpg' },
      { id: 15, name: 'Almond Milk Tea with Boba', price: 5.20, image: '/images/placeholder.png' },
      { id: 16, name: 'Coffee Milk Tea with Boba', price: 5.30, image: '/images/drink16.jpg' },
      { id: 17, name: 'Wintermelon Milk Tea with Boba', price: 4.80, image: '/images/placeholder.png' },
      { id: 18, name: 'Avocado Smoothie with Boba', price: 6.25, image: '/images/placeholder.png' },
      { id: 19, name: 'Strawberry Banana Smoothie w/ Boba', price: 6.50, image: '/images/drink19.jpg' },
      { id: 20, name: 'Mango Slush with Boba', price: 6.00, image: '/images/drink20.jpg' },
    ];

    const cart = new Map();

    function renderMenu(items) {
      const grid = $('#menuGrid');
      grid.innerHTML = '';
      items.forEach(it => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'card';
        card.setAttribute('aria-label', `${it.name} ${money(it.price)}`);
        card.innerHTML = `
          <img class="card-img" src="${it.image || '/images/placeholder.png'}" 
               alt="${it.name}" 
               onerror="this.src='/images/placeholder.png'">
          <div class="card-body">
            <div class="card-name">${it.name}</div>
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
          <div class="cart-row-name">${item.name}</div>
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
      const filtered = MENU.filter(it => it.name.toLowerCase().includes(q));
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

    renderMenu(MENU);
    renderCart();
  }, []);

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
