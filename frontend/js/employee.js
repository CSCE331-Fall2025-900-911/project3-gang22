// Cashier POS — fetch live menu from /api/menu and render a fast, keyboard-friendly POS

(async () => {
    try {
        const r = await fetch('/api/auth/whoami', { credentials: 'include' });
        const data = await r.json();
        const role = data?.user?.role;
        if (!role || !['cashier', 'manager'].includes(role)) {
            location.replace('/user.html'); // kiosk
        }
    } catch {
        location.replace('/user.html');
    }
})();

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const byId = (id) => document.getElementById(id);

// Try to match whatever IDs your HTML uses
const EL = {
    grid: byId('posMenuGrid') || byId('menuGrid'),
    cartBox: byId('posCartItems') || byId('cartItems'),
    subtotal: byId('posSubtotal') || byId('kSubtotal') || byId('subtotal'),
    tax: byId('posTax') || byId('kTax') || byId('tax'),
    total: byId('posTotal') || byId('kTotal') || byId('total'),
    search: byId('posSearch') || byId('menuSearch'),
    clearBtn: byId('posClear') || byId('clear'),
    checkoutBtn: byId('posCheckout') || byId('checkout')
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

const cart = new Map(); // id -> { item, qty }

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

function tileHTML(it, indexPrefix = '') {
    const price = money(it.price);
    const img = it.image || '/images/placeholder.png';
    const label = indexPrefix ? `${indexPrefix}. ${it.name}` : it.name;
    return `
    <button class="tile compact" data-id="${it.id}" title="${it.name}">
      <img src="${img}" alt="${it.name}" onerror="this.src='/images/placeholder.png'"/>
      <div class="tile-name">${label}</div>
      <div class="tile-price">${price}</div>
    </button>
  `;
}

function renderMenu(items) {
    if (!EL.grid) return;
    EL.grid.innerHTML = '';
    items.forEach((it, i) => {
        const wrap = document.createElement('div');
        wrap.className = 'tile-wrap';
        wrap.innerHTML = tileHTML(it, i < 9 ? i + 1 : '');
        const btn = wrap.firstElementChild;
        btn.onclick = () => add(it);
        EL.grid.appendChild(wrap);
    });
}

function bindSearch(items) {
    if (!EL.search) return;
    document.addEventListener('keydown', (e) => {
        if (e.key === '/') { e.preventDefault(); EL.search.focus(); }
        if (e.key >= '1' && e.key <= '9') {
            const idx = Number(e.key) - 1;
            const visibleTiles = Array.from(EL.grid.querySelectorAll('.tile'));
            const tile = visibleTiles[idx];
            if (tile) tile.click();
        }
        if (e.key === 'Enter') EL.checkoutBtn?.click();
    });

    EL.search.addEventListener('input', () => {
        const q = EL.search.value.toLowerCase();
        const filtered = items.filter(it => it.name.toLowerCase().includes(q));
        renderMenu(filtered);
    });
}

// initial load + optional 30s refresh
(async function init() {
    const items = await fetchMenu();
    renderMenu(items);
    renderCart();
    bindSearch(items);

    if (EL.clearBtn) EL.clearBtn.onclick = () => { cart.clear(); renderCart(); };
    if (EL.checkoutBtn) EL.checkoutBtn.onclick = async () => {
        const items = [...cart.values()].map(({ item, qty }) => ({
            id: item.id,
            qty
        }));

        if (!items.length) {
            alert('Cart is empty.');
            return;
        }

        try {
            const r = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items })
            });

            const data = await r.json().catch(() => ({}));

            if (!r.ok) {
                alert('Order failed: ' + (data.error || r.statusText));
                console.error(data);
                return;
            }

            alert('Order placed successfully!');
            cart.clear();
            renderCart();
        } catch (e) {
            console.error(e);
            alert('Network error placing order');
        }
    };


    // auto-refresh the grid every 30s (does not wipe the cart)
    setInterval(async () => {
        const fresh = await fetchMenu();
        const q = (EL.search?.value || '').toLowerCase();
        const filtered = q ? fresh.filter(it => it.name.toLowerCase().includes(q)) : fresh;
        renderMenu(filtered);
    }, 30000);
})();
