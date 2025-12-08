import { useRef } from 'react';

export default function PaymentModal({ cartItems, clearCart, createOrder, subtotal, tax, total, setShowPaymentModal, setOrderInProgress }) {
    const cardNumberRef = useRef(null);
    const cardExpMRef = useRef(null);
    const cardExpYRef = useRef(null);
    const cardHolderRef = useRef(null);

    async function submitOrder() {
        const cardNumber = cardNumberRef.current.value.trim();
        const cardExpM = Number(cardExpMRef.current.value.trim());
        const cardExpY = Number(cardExpYRef.current.value.trim());
        const cardHolder = cardHolderRef.current.value.trim();

        if (!cardNumber || !cardHolder || !cardExpM || !cardExpY) {
            alert("Please fill in all card details.");
            return;
        }

        const order_time = new Date().toISOString();
        const menu_ids = [];
        const quantities = [];
        const totalsArr = [];

        cartItems.map(item => {
            menu_ids.push(item.id);
            quantities.push(item.qty);
            const itemTotal = item.price * item.qty + item.customization.totalCustomizationPrice; 
            totalsArr.push(itemTotal);
        });

        const orderData = {
            order_time,
            menu_ids,
            quantities,
            totals: totalsArr,
            card_number: cardNumber,
            card_expr_m: cardExpM,
            card_expr_y: cardExpY,
            card_holder: cardHolder
        };

        setShowPaymentModal(false);

        try {
            await createOrder(orderData);
            alert("Order submitted!");
            clearCart();
            
            // 3. ✅ Ensure setOrderInProgress is available and called
            if (setOrderInProgress) {
                setOrderInProgress(false);
            }
        } catch (err) {
            alert("Error submitting order.");
            console.error(err);
            // If submission fails, you might want to show the modal again:
            setShowPaymentModal(true); 
        }
    };

    return (
        <div id="orderModal" className="modal-overlay">
            <div className="modal-panel large">
                <h2>Payment Details</h2>

                <div className="modal-body">
                    <div className="totals mb">
                        <div className="row"><span>Subtotal</span><strong id="paySubtotal">{subtotal}</strong></div>
                        <div className="row"><span>Tax</span><strong id="payTax">{tax}</strong></div>
                        <div className="row total"><span>Total</span><strong id="payTotal">{total}</strong></div>
                    </div>

                    <div className="card-field">
                        <label>Card Number</label>
                        {/* 4. ✅ Attach the Ref */}
                        <input id="cardNumber" className="card-input" placeholder="1234 5678 9012 3456" ref={cardNumberRef} />
                    </div>

                    <div className="card-field">
                        <label>Expiration (MM / YY)</label>
                        <div className="card-row">
                             {/* 4. ✅ Attach the Ref */}
                            <input id="cardExpM" className="card-input card-exp-small" placeholder="MM" ref={cardExpMRef} />
                             {/* 4. ✅ Attach the Ref */}
                            <input id="cardExpY" className="card-input card-exp-small" placeholder="YY" ref={cardExpYRef} />
                        </div>
                    </div>

                    <div className="card-field">
                        <label>Cardholder Name</label>
                         {/* 4. ✅ Attach the Ref */}
                        <input id="cardHolder" className="card-input" placeholder="Name on card" ref={cardHolderRef} />
                    </div>

                </div>

                <div className="modal-footer row gap">
                    <button id="orderCancel" className="btn gap-right" onClick={() => setShowPaymentModal(false)}>Back</button>
                    <button id="orderConfirm" className="btn primary" onClick={submitOrder}>Submit Order</button>
                </div>
            </div>
        </div>
    )
}