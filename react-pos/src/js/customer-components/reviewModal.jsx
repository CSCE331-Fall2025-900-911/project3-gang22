import ReviewBody from "./reviewBody";

export default function ReviewModal({cartItems, money, setShowReviewModal, setShowPaymentModal}) {
    
    function handleCheckout() {
        setShowReviewModal(false);
        setShowPaymentModal(true);
    }
    return (
        <div id="reviewModal" className="modal-overlay">
            <div className="modal-panel large">
                <h2>Review Your Order</h2>

                <div className="modal-body">
                    <table className="cart-table review-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Qty</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody><ReviewBody cartItems={cartItems} money={money}/></tbody>
                    </table>
                </div>

                <div className="modal-footer row gap">
                    <button id="reviewCancel" className="btn gap-right" onClick={() => setShowReviewModal(false)}>Cancel</button>
                    <button id="reviewConfirm" className="btn primary" onClick={() => handleCheckout()}>Confirm</button>
                </div>
            </div>
        </div>
    );
}