import React, { useEffect } from "react";

export default function Employee() {
  useEffect(() => {
    const $ = (s, c = document) => c.querySelector(s);
    const TAX = 0.0825;
    const money = n => `$${Number(n).toFixed(2)}`;
    const MENU = [
      { id:1, name:'Classic Black Milk Tea with Boba', price:4.50, image:'/images/drink1-3.jpg' },
      { id:2, name:'Jasmine Green Milk Tea with Boba', price:4.75, image:'/images/drink1-3.jpg' },
      { id:3, name:'Oolong Milk Tea with Boba', price:4.95, image:'/images/drink1-3.jpg' },
      { id:4, name:'Taro Milk Tea with Boba', price:5.25, image:'/images/drink4.jpg' },
      { id:5, name:'Thai Milk Tea with Boba', price:5.10, image:'/images/drink5.jpg' },
      { id:6, name:'Honeydew Milk Tea with Boba', price:4.85, image:'/images/drink6.jpg' },
      { id:7, name:'Matcha Latte with Boba', price:5.50, image:'/images/drink7.jpg' },
      { id:8, name:'Brown Sugar Milk Tea with Boba', price:5.75, image:'/images/drink8.jpg' },
      { id:9, name:'Strawberry Fruit Tea with Boba', price:4.60, image:'/images/placeholder.png' },
      { id:10,name:'Mango Fruit Tea with Boba', price:4.70, image:'/images/drink10.jpg' },
      { id:11,name:'Lychee Fruit Tea with Boba', price:4.95, image:'/images/drink11.jpg' },
      { id:12,name:'Passionfruit Green Tea with Boba', price:4.90, image:'/images/placeholder.png' },
      { id:13,name:'Peach Oolong Tea with Boba', price:5.00, image:'/images/drink13.jpg' },
      { id:14,name:'Coconut Milk Tea with Boba', price:5.15, image:'/images/drink14.jpg' },
      { id:15,name:'Almond Milk Tea with Boba', price:5.20, image:'/images/placeholder.png' },
      { id:16,name:'Coffee Milk Tea with Boba', price:5.30, image:'/images/drink16.jpg' },
      { id:17,name:'Wintermelon Milk Tea with Boba', price:4.80, image:'/images/placeholder.png' },
      { id:18,name:'Avocado Smoothie with Boba', price:6.25, image:'/images/placeholder.png' },
      { id:19,name:'Strawberry Banana Smoothie w/ Boba', price:6.50, image:'/images/drink19.jpg' },
      { id:20,name:'Mango Slush with Boba', price:6.00, image:'/images/drink20.jpg' },
    ];

    const cart = new Map();
    function add(item){ const c=cart.get(item.id)||{item,qty:0}; c.qty++; cart.set(item.id,c); renderCart(); }
    function dec(id){ const c=cart.get(id); if(!c) return; c.qty--; if(c.qty<=0) cart.delete(id); renderCart(); }

    function totals(){ let s=0; cart.forEach(({item,qty})=> s+=item.price*qty); const t=s*TAX; return {s,t,tt:s+t}; }

    function renderCart(){
      const box=$('#posCartItems'); box.innerHTML='';
      cart.forEach(({item,qty})=>{
        const row=document.createElement('div'); row.className='cart-row';
        row.innerHTML=`<div class="cart-row-name">${item.name}</div>
        <div class="cart-row-qty"><button class="btn sm" data-a="dec">−</button>
        <span class="qty">${qty}</span><button class="btn sm" data-a="inc">+</button></div>
        <div class="cart-row-price">${money(item.price*qty)}</div>`;
        row.querySelector('[data-a="dec"]').onclick=()=>dec(item.id);
        row.querySelector('[data-a="inc"]').onclick=()=>add(item);
        box.appendChild(row);
      });
      const {s,t,tt}=totals();
      $('#posSubtotal').textContent=money(s);
      $('#posTax').textContent=money(t);
      $('#posTotal').textContent=money(tt);
    }

    function renderMenu(items){
      const grid=$('#posMenuGrid'); grid.innerHTML='';
      items.forEach((it,i)=>{
        const b=document.createElement('button'); b.type='button'; b.className='card';
        b.innerHTML=`
        <img class="card-img" src="${it.image || '/images/placeholder.png'}" alt="${it.name}" onerror="this.src='/images/placeholder.png'">
        <div class="card-body">
          <div class="card-name">${i<9?`${i+1}. `:''}${it.name}</div>
          <div class="card-price">${money(it.price)}</div>
        </div>`;
        b.addEventListener('click',()=>add(it)); grid.appendChild(b);
      });
    }

    function bindShortcuts(items){
      const input=$('#posSearch');
      document.addEventListener('keydown',e=>{
        if(e.key==='/'){ e.preventDefault(); input.focus(); }
        if(e.key>='1'&&e.key<='9'){ const idx=Number(e.key)-1; if(items[idx]) add(items[idx]); }
        if(e.key==='Enter') $('#posCheckout').click();
      });
      input.addEventListener('input',()=>{
        const q=input.value.toLowerCase();
        renderMenu(items.filter(it=>it.name.toLowerCase().includes(q)));
      });
    }

    $('#posClear').addEventListener('click',()=>{ cart.clear(); renderCart(); });
    $('#posCheckout').addEventListener('click',()=>{ alert('Paid (stub)'); cart.clear(); renderCart(); });

    renderMenu(MENU); renderCart(); bindShortcuts(MENU);
  }, []);

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
      </aside>
    </main>
  );
}
