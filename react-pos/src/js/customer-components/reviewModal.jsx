import { useEffect, useRef, useState } from "react";
import ReviewBody from "./reviewBody";
import { translate } from "./languageSelector";
import { defaultReviewModalText } from "./defaultText";

export default function ReviewModal(
    { 	cartItems, 
        money, 
        setShowReviewModal, 
        setShowPaymentModal, 
        couponApplied, 
        couponDiscount,
        applyCoupon,
        spinWheel,
        wheelUsed,
        subtotal,
        tax,
        total,
        currentLanguage,
    }) {

    const [ reviewModalText, setReviewModalText ] = useState(defaultReviewModalText);

    useEffect(() => {
        async function translateModalText() {
            try {
                const translatedModalText = await translate(reviewModalText, currentLanguage);
                setReviewModalText(translatedModalText);
            }
            catch (err) {
                console.error("Error batch translating text:", err);
            }
        }
        translateModalText();
    },[])
    
    const couponInputRef = useRef(null);
    
    function handleApplyCoupon() {
        const code = couponInputRef.current.value.trim();
        if (code) {
            applyCoupon(code);
        } else {
            // Index 19: "Please enter a coupon code."
            alert(reviewModalText[19]); 
        }
    }

    function handleCheckout() {
        setShowReviewModal(false);
        setShowPaymentModal(true);
    }

    return (
        <div id="reviewModal" className="modal-overlay">
            <div className="modal-panel large">
                {/* "Review Your Order" */}
                <h2>{reviewModalText[0]}</h2>

                <div className="modal-body">
                    <div className="coupon-row row gap" style={{ marginBottom: "12px" }}>
                        <input 
                            id="couponInput" 
                            className="card-input" 
                            /* "Coupon Applied"
                                "% off"
                                "Enter coupon code…"
                            */
                            placeholder={couponApplied ? `${reviewModalText[1]}: ${couponDiscount * 100}${reviewModalText[2]}` : reviewModalText[3]}
                            ref={couponInputRef} 
                            disabled={couponApplied}
                        />
                        <button 
                            id="applyCouponBtn" 
                            className="btn" 
                            onClick={handleApplyCoupon}
                            disabled={couponApplied} 
                        >
                            {/* "Applied",
                                "Apply" 
                            */}
                            {couponApplied ? reviewModalText[4] : reviewModalText[5]}
                        </button>
                        <button
                            type="button"
                            className="btn secondary"
                            onClick={spinWheel}
                            disabled={wheelUsed}
                        >
                            {/* "Wheel Used",
                                "Spin for Mystery Discount"
                            */}
                            {wheelUsed ? reviewModalText[6] : reviewModalText[7]}
                        </button>
                    </div>
                    
                    <table className="cart-table review-table">
                        <thead>
                            <tr>
                                {/* "Item" */}
                                <th>{reviewModalText[8]}</th>
                                {/* "Qty" */}
                                <th>{reviewModalText[9]}</th>
                                {/* "Price" */}
                                <th>{reviewModalText[10]}</th>
                            </tr>
                        </thead>
                        <tbody><ReviewBody cartItems={cartItems} money={money}/></tbody>
                    </table>

                    <div id="reviewTotals" className="totals mb">
                        <div className="row">
                            {/* "Subtotal" */}
                            <span>{reviewModalText[11]}</span>
                            <strong id="revSubtotal">{subtotal}</strong>
                        </div>
                        {couponApplied && (
                             <div className="row discount">
                                {/* "Discount (",  ")" */}
                                <span>{reviewModalText[12]} ({couponDiscount * 100}){reviewModalText[13]}</span>
                                {/* Index 14: "Applied" */}
                                <strong>{reviewModalText[14]}</strong> 
                            </div>
                        )}
                        <div className="row">
                            {/* "Tax" */}
                            <span>{reviewModalText[15]}</span>
                            <strong id="revTax">{tax}</strong>
                        </div>
                        <div className="row total">
                            {/* "Total" */}
                            <span>{reviewModalText[16]}</span>
                            <strong id="revTotal">{total}</strong>
                        </div>
                    </div>

                </div>

                <div className="modal-footer row gap">
                    {/* "Cancel" */}
                    <button id="reviewCancel" className="btn gap-right" onClick={() => setShowReviewModal(false)}>{reviewModalText[17]}</button>
                    {/* "Confirm" */}
                    <button id="reviewConfirm" className="btn primary" onClick={handleCheckout}>{reviewModalText[18]}</button>
                </div>
            </div>
        </div>
    );
}