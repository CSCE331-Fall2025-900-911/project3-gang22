import { useState, useEffect } from "react";
import CartBody from "./cartBody";
import { translate } from "./languageSelector";
import { defaultCartText } from "./defaultText";

export default function Cart({ openReview, setCartItems, cartItems, money, increaseQty, decreaseQty, subtotal, tax, total, currentLanguage}) {

    const [ cartText, setCartText ] = useState(defaultCartText);
    
    useEffect(() => {
        async function translateText() {
            try {
                const translatedText = await translate(cartText, currentLanguage);
                setCartText(translatedText);
            }
            catch (err) {
                console.error("Error batch translating text:", err);
            }
        }
        translateText();
    },[currentLanguage])

    return (
        <aside className="panel" aria-labelledby="cartHeading">
            <div id="cartHeadingBox">
                <h2 id="cartHeading">{cartText[0]}</h2>
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
                <div className="row gap-md"><span>{cartText[1]}</span><strong data-no-translate id="subtotal">{`${subtotal}`}</strong></div>
                <div className="row gap-sm"><span>{cartText[2]}</span><strong data-no-translate id="tax">{`${tax}`}</strong></div>
                <div className="row gap-sm total"><span>{cartText[3]}</span><strong data-no-translate id="total">{`${total}`}</strong></div>
            </div>

            <div className="row gap-lg">
                <button id="clearCart" className="btn" onClick={() => setCartItems([])}>{cartText[4]}</button>
                <button id="checkout" className="btn primary" onClick={() => openReview()}>{cartText[5]}</button>
            </div>
        </aside>
    );
}