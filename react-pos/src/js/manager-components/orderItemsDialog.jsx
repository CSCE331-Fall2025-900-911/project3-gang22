// OrderItemsDialog.jsx
import React from "react";
import "./managerStyles.css";

export default function OrderItemsDialog({ order, items, onClose }) {
  if (!order) return null; // don't render if no order selected

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h3>Order #{order.id} Details</h3>
        <p><strong>Employee:</strong> {order.employee_id}</p>
        <p><strong>Subtotal:</strong> ${order.subtotal}</p>
        <p><strong>Tax:</strong> ${order.tax}</p>
        <p><strong>Total:</strong> ${order.total}</p>
        <p><strong>Order Time:</strong> {new Date(order.order_time).toLocaleString()}</p>

        <h4>Items</h4>
        <ul>
          {items.map((item, idx) => (
            <li key={idx}>
              {item.drink_name} — {item.quantity} × ${item.total}
            </li>
          ))}
        </ul>

        <div style={{ marginTop: "1rem", textAlign: "right" }}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}