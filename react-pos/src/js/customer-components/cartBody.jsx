export default function CartBody({ cartItems, money, increaseQty, decreaseQty }) {
    if (!cartItems) { return <></>};

    function getCustomizationList(customization) {
        console.log(customization);
        if (!customization) {
            return;
        }
        const customizationSummary = [];

        Object.entries(customization).forEach(([key, values]) => {
            if (key === 'totalCustomizationPrice') {
                return; 
            }
            if (values.adjustment) {
                const numNotZero = Number(values.price) > 0;
                customizationSummary.push(`${key}: ${values.adjustment} ${numNotZero ? ` - $${values.price}` : ''}`);
                customizationSummary.push('\n')
            }
        })

        return customizationSummary ;
    }

    return (
        <>
        {cartItems.map(item => (
            <tr key={`${item.id}:${item.name}:${item.adjustment}`}>
                <td><div className="customization-container">{item.drink_name}<div className="customization">{getCustomizationList(item.customization)}</div></div></td>

                <td className="td-btn">
                    <button 
                        className="btn sm"
                        type="button" 
                        onClick={() => decreaseQty(item.cardID)}>-</button>
                </td>

                <td className="td-qty">
                    {item.qty}
                </td>

                <td className="td-btn">
                    <button 
                        className="btn sm"
                        type="button" 
                        onClick={() => increaseQty(item.cardID)}>+</button>
                </td>

                <td>{money(item.price * item.qty + Number(item.customization.totalCustomizationPrice))}</td>

                <td className={"td-custom"}><br />{}</td>
            </tr>
            ))
        }
        </>
    )
}