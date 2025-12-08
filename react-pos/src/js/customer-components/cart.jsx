import { useState } from "react";
import CartBody from "./cartBody";

export default function Cart({ openReview, setCartItems, cartItems, money, increaseQty, decreaseQty, subtotal, tax, total, t }) {

    return (
        <aside className="panel" aria-labelledby="cartHeading">
            <div id="cartHeadingBox">
                <h2 id="cartHeading">{t('cart_title')}</h2>
            </div>

            <div className="cart-table-wrap">
                <table className="cart-table">
                    <colgroup>
                        <col style={{ width: "52%" }} /> 
                        <col style={{ width: "8%" }} /> 
                        <col style={{ width: "8%" }} /> 
                        <col style={{ width: "8%" }} /> 
                        <col style={{ width: "24%" }} />
                    </colgroup>
                    <tbody id="cartItems"><CartBody cartItems={cartItems} money={money} increaseQty={increaseQty} decreaseQty={decreaseQty} /></tbody>
                </table>
            </div>

            <div className="totals">
                <div className="row gap-md"><span>{t('subtotal_label')}</span><strong id="subtotal">{`${subtotal}`}</strong></div>
                <div className="row gap-sm"><span>{t('tax_label')}</span><strong id="tax">{`${tax}`}</strong></div>
                <div className="row gap-sm total"><span>{t('total_label')}</span><strong id="total">{`${total}`}</strong></div>
            </div>

            <div className="row gap-lg">
                <button id="clearCart" className="btn" onClick={() => setCartItems([])}>{t('clear_cart')}</button>
                <button id="checkout" className="btn primary" onClick={() => openReview()}>{t('open_review')}</button>
            </div>
        </aside>
    );
}