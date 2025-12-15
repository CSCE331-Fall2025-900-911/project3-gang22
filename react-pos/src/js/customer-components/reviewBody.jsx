
// This component sets up the review modal items for the review modal to display
export default function ReviewBody({ cartItems, money}) {
    function capitalize(str) {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    const defaults = {
        size: "Regular",
        sugar: "Regular",
        ice: "Regular",
        boba: "Regular",
        milk: "Whole"
        // toppings: no default
    };


    function getCustomizationList(customization) {
        if (!customization) {
            return;
        }
        const customizationSummary = [];

        Object.entries(customization).forEach(([key, values]) => {
            if (key === 'totalCustomizationPrice') {
                return; 
            }
            // Special case: Toppings
            if (key.toLowerCase() === "toppings") {
                if (Array.isArray(values) && values.length > 0) {
                    if (values.length === 1) {
                        const topping = values[0];
                        const numNotZero = Number(topping.price) > 0;
                        customizationSummary.push(
                            `${capitalize(key)}: ${capitalize(topping.adjustment)} ${
                                numNotZero ? ` - $${topping.price}` : ""
                            }`
                        );
                        customizationSummary.push("\n");
                    } else {
                        customizationSummary.push(`${capitalize(key)}:`);
                        customizationSummary.push(
                            <ul key="toppings-list">
                                {values.map((topping, idx) => {
                                const numNotZero = Number(topping.price) > 0;
                                return (
                                    <li key={idx}>
                                    {capitalize(topping.adjustment)}{" "}
                                    {numNotZero ? ` - $${topping.price}` : ""}
                                    </li>
                                );
                                })}
                            </ul>
                        );
                    }
                }
            } else {
                // Normal single-select groups
                if (values.adjustment) {
                    const numNotZero = Number(values.price) > 0;
                    customizationSummary.push(
                        `${capitalize(key)}: ${capitalize(values.adjustment)} ${
                        numNotZero ? ` - $${values.price}` : ""
                        }`
                    );
                    customizationSummary.push("\n");
                }
            }
        })
        return customizationSummary ;
    }
    return (
       <>
            {cartItems.map(item => (
                <tr key={item.id}>
                    <td><div className="customization-container">{item.drink_name}<div className="customization">{getCustomizationList(item.customization)}</div></div></td>
                    <td>{item.qty}</td>
                    <td>{money(item.price * item.qty + item.customization.totalCustomizationPrice)}</td>
                </tr>
            ))}
        </>
    )
}