import React, { useEffect, useState } from "react";
import { useSession } from "./useSession";
import { LoginButton } from "./LoginButton";
import { loadCashierMenu } from "./api";  // << use the helper

export default function Employee() {
    // auth first
    const { loading, authenticated, user } = useSession();
    const [menuItems, setMenuItems] = useState([]);
    const [error, setError] = useState(null);

    // fetch once
    useEffect(() => {
        let alive = true;
        setError(null);
        loadCashierMenu()
            .then(data => { if (alive) setMenuItems(data); })
            .catch(e => { if (alive) setError(e.message); });
        return () => { alive = false; };
    }, []);

    // wire up your existing imperative UI when menu arrives
    useEffect(() => {
        if (!menuItems?.length) return;

        const $ = (s, c = document) => c.querySelector(s);
        const TAX = 0.0825;
        const money = n => `$${Number(n).toFixed(2)}`;
        const cart = new Map();

        function add(item){ const c=cart.get(item.id)||{item,qty:0}; c.qty++; cart.set(item.id,c); renderCart(); }
        function dec(id){ const c=cart.get(id); if(!c) return; c.qty--; if(c.qty<=0) cart.delete(id); renderCart(); }
        function totals(){ let s=0; cart.forEach(({item,qty})=> s+=item.price*qty); const t=s*TAX; return {s,t,tt:s+t}; }

        function renderCart(){
            const box=$('#posCartItems'); if(!box) return; box.innerHTML='';
            cart.forEach(({item,qty})=>{
                const row=document.createElement('div'); row.className='cart-row';
                row.innerHTML=`<div class="cart-row-name">${item.drink_name}</div>
          <div class="cart-row-qty">
            <button class="btn sm" data-a="dec">−</button>
            <span class="qty">${qty}</span>
            <button class="btn sm" data-a="inc">+</button>
          </div>
          <div class="cart-row-price">${money(item.price*qty)}</div>`;
                row.querySelector('[data-a="dec"]').onclick=()=>dec(item.id);
                row.querySelector('[data-a="inc"]').onclick=()=>add(item);
                box.appendChild(row);
            });
            const {s,t,tt}=totals();
            const sub=$('#posSubtotal'), tx=$('#posTax'), tot=$('#posTotal');
            if (sub) sub.textContent=money(s);
            if (tx)  tx.textContent=money(t);
            if (tot) tot.textContent=money(tt);
        }

        function renderMenu(items){
            const grid=$('#posMenuGrid'); if(!grid) return; grid.innerHTML='';
            items.forEach((it,i)=>{
                const b=document.createElement('button'); b.type='button'; b.className='card';
                b.innerHTML=`
          <img class="card-img" src="/images/drink${it.id}.jpg" alt="${it.drink_name}"
               onerror="this.src='/images/placeholder.png'">
          <div class="card-body">
            <div class="card-name">${i<9?`${i+1}. `:''}${it.drink_name}</div>
            <div class="card-price">${money(it.price)}</div>
          </div>`;
                b.addEventListener('click',()=>add(it));
                grid.appendChild(b);
            });
        }

        function bindShortcuts(items){
            const input=$('#posSearch'); if(!input) return;
            const onKey = e => {
                if(e.key==='/'){ e.preventDefault(); input.focus(); }
                if(e.key>='1'&&e.key<='9'){ const idx=Number(e.key)-1; if(items[idx]) add(items[idx]); }
                if(e.key==='Enter'){ const btn=$('#posCheckout'); btn && btn.click(); }
            };
            const onInput = () => {
                const q=input.value.toLowerCase();
                renderMenu(items.filter(it=>it.drink_name.toLowerCase().includes(q)));
            };
            document.addEventListener('keydown', onKey);
            input.addEventListener('input', onInput);
            return () => {
                document.removeEventListener('keydown', onKey);
                input.removeEventListener('input', onInput);
            };
        }

        const clearBtn = document.getElementById('posClear');
        const checkoutBtn = document.getElementById('posCheckout');
        clearBtn && clearBtn.addEventListener('click',()=>{ cart.clear(); renderCart(); });
        checkoutBtn && checkoutBtn.addEventListener('click',()=>{ alert('Paid (stub)'); cart.clear(); renderCart(); });

        renderMenu(menuItems);
        renderCart();
        const unbind = bindShortcuts(menuItems);
        return () => { unbind && unbind(); };
    }, [menuItems]);

    // gates AFTER hooks
    if (loading) return <p>Loading…</p>;
    if (!authenticated) return <LoginButton />;
    if (!(user?.role === "cashier" || user?.role === "manager")) return <p>Access denied.</p>;

    return (
        <main className="wrap grid-2">
            {error && <div style={{color:'crimson', marginBottom:8}}>Error: {error}</div>}
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
            </aside>
        </main>
    );
}
