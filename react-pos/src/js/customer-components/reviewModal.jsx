import { useRef } from "react";
import ReviewBody from "./reviewBody";

export default function ReviewModal(
    {   cartItems, 
        money, 
        setShowReviewModal, 
        setShowPaymentModal, 
        couponApplied, 
        couponDiscount,
        applyCoupon,
        subtotal,
        tax,
        total,
        t
     }) {
    
    const couponInputRef = useRef(null);
    
    function handleApplyCoupon() {
        const code = couponInputRef.current.value.trim();
        if (code) {
            applyCoupon(code);
        } else {
            alert(t("alert_enter_coupon"));
        }
    }

    function handleCheckout() {
        setShowReviewModal(false);
        setShowPaymentModal(true);
    }

    return (
        <div id="reviewModal" className="modal-overlay">
            <div className="modal-panel large">
                <h2>{t('review_title')}</h2>

                <div className="modal-body">
                    <div className="coupon-row row gap" style={{ marginBottom: "12px" }}>
                        <input 
                            id="couponInput" 
                            className="card-input" 
                            placeholder={couponApplied ? `Coupon Applied: ${couponDiscount * 100}% off` : `${t('coupon_placeholder_default')}`}
                            ref={couponInputRef} 
                            disabled={couponApplied}
                        />
                        <button 
                            id="applyCouponBtn" 
                            className="btn" 
                            onClick={handleApplyCoupon}
                            disabled={couponApplied} 
                        >
                            {couponApplied ? t('applied_button') : t('apply_button')}
                        </button>
                    </div>
                    
                    <table className="cart-table review-table">
                        <thead>
                            <tr>
                                <th>{t('table_header_item')}</th>
                                <th>{t('table_header_qty')}</th>
                                <th>{t('table_header_price')}</th>
                            </tr>
                        </thead>
                        <tbody><ReviewBody cartItems={cartItems} money={money}/></tbody>
                    </table>

                    <div id="reviewTotals" className="totals mb">
                        <div className="row"><span>{t('subtotal_label')}</span><strong id="revSubtotal">{subtotal}</strong></div>
                        {couponApplied && (
                             <div className="row discount">
                                <span>{t('discount_label')} ({couponDiscount * 100}%)</span>
                                <strong>{t('applied_status')}</strong> 
                            </div>
                        )}
                        <div className="row"><span>{t('tax_label')}</span><strong id="revTax">{tax}</strong></div>
                        <div className="row total"><span>{t('total_label')}</span><strong id="revTotal">{total}</strong></div>
                    </div>

                </div>

                <div className="modal-footer row gap">
                    <button id="reviewCancel" className="btn gap-right" onClick={() => setShowReviewModal(false)}>Cancel</button>
                    <button id="reviewConfirm" className="btn primary" onClick={handleCheckout}>Confirm</button>
                </div>
            </div>
        </div>
    );
}