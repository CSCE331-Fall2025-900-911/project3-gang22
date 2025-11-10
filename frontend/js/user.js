// Customer Kiosk — fetch live menu from /api/menu and render a big tap-friendly UI

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const byId = (id) => document.getElementById(id);

// Try to match whatever IDs your kiosk HTML uses
const EL = {
    grid: byId('menuGrid') || byId('posMenuGrid'),
    cartBox: byId('cartItems') || byId('posCartItems'),
    subtotal: byId('kSubtotal') || byId('subtotal') || byId('posSubtotal'),
    tax: byId('kTax') || byId('tax') || byId('posTax'),
    total: byId('kTotal') || byId('total') || byId('posTotal'),
    search: byId('menuSearch') || byId('posSearch'),
    clearBtn: byId('kClear') || byId('clear') || byId('posClear'),
    checkoutBtn: byId('kCheckout') || byId('checkout') || byId('posCheckout')
};

const TAX = 0.0825;
const money = (n) => `$${Number(n).toFixed(2)}`;

async function fetchMenu() {
    try {
        const r = await fetch('/api/menu');
        if (!r.ok) throw new Error('bad response');
        return await r.json();
    } catch {
        return [];
    }
}

const cart = new Map();

function add(item) {
    const cur = cart.get(item.id) || { item, qty: 0 };
    cur.qty++;
    cart.set(item.id, cur);
    renderCart();
}
function dec(item) {
    const cur = cart.get(item.id);
    if (!cur) return;
    cur.qty--;
    if (cur.qty <= 0) cart.delete(item.id);
    renderCart();
}

function updateTotals() {
    let subtotal = 0;
    cart.forEach(({ item, qty }) => { subtotal += item.price * qty; });
    if (EL.subtotal) EL.subtotal.textContent = money(subtotal);
    if (EL.tax) EL.tax.textContent = money(subtotal * TAX);
    if (EL.total) EL.total.textContent = money(subtotal * (1 + TAX));
}

function renderCart() {
    if (!EL.cartBox) return;
    EL.cartBox.innerHTML = '';
    cart.forEach(({ item, qty }) => {
        const row = document.createElement('div');
        row.className = 'cart-row';
        row.innerHTML = `
      <div class="cart-row-name">${item.name}</div>
      <div class="cart-row-qty">
        <button class="btn btn-sm" data-a="dec">−</button>
        <span class="qty">${qty}</span>
        <button class="btn btn-sm" data-a="inc">+</button>
      </div>
      <div class="cart-row-price">${money(item.price * qty)}</div>
    `;
        row.querySelector('[data-a="dec"]').onclick = () => dec(item);
        row.querySelector('[data-a="inc"]').onclick = () => add(item);
        EL.cartBox.appendChild(row);
    });
    updateTotals();
}

function tileHTML(it) {
    const img = it.image || '/images/placeholder.png';
    return `
    <button class="tile" data-id="${it.id}" title="${it.name}">
      <img src="${img}" alt="${it.name}" onerror="this.src='/images/placeholder.png'"/>
      <div class="tile-name">${it.name}</div>
      <div class="tile-price">${money(it.price)}</div>
    </button>
  `;
}

function renderMenu(items) {
    if (!EL.grid) return;
    EL.grid.innerHTML = '';
    items.forEach((it) => {
        const wrap = document.createElement('div');
        wrap.className = 'tile-wrap';
        wrap.innerHTML = tileHTML(it);
        const btn = wrap.firstElementChild;
        btn.onclick = () => add(it);
        EL.grid.appendChild(wrap);
    });
}

function bindSearch(items) {
    if (!EL.search) return;
    EL.search.addEventListener('input', () => {
        const q = EL.search.value.toLowerCase();
        const filtered = items.filter(it => it.name.toLowerCase().includes(q));
        renderMenu(filtered);
    });
}

// init + optional 30s refresh
(async function init() {
    const items = await fetchMenu();
    renderMenu(items);
    renderCart();
    bindSearch(items);

    if (EL.clearBtn) EL.clearBtn.onclick = () => { cart.clear(); renderCart(); };
    if (EL.checkoutBtn) EL.checkoutBtn.onclick = () => {
        alert('Thanks! (stub)');
        cart.clear(); renderCart();
    };

    // auto-refresh grid every 30s (non-destructive to cart)
    setInterval(async () => {
        const fresh = await fetchMenu();
        const q = (EL.search?.value || '').toLowerCase();
        const filtered = q ? fresh.filter(it => it.name.toLowerCase().includes(q)) : fresh;
        renderMenu(filtered);
    }, 30000);
})();
