export default function MenuBody({ menuItems, money, setShowCustomizationModal, setCurrentMenuItem }) {

    function openCustomization(menuItem) {
      setShowCustomizationModal(true);
      setCurrentMenuItem(menuItem);
    }
    
    return (
        <>
            {menuItems.map(item => (
                <button key={item.id}
                    className="card"
                    aria-label={`${item.drink_name} ${money(item.price)}`} // Directly set as a prop
                    type="button"
                    onClick={() => openCustomization(item.id)}>
                    <img className="card-img" src={`/images/drink${item.id}.jpg`} alt={`${item.drink_name}`} onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/placeholder.png';}}
                    />
                    <div className="card-body">
                        <div className="card-name">{item.drink_name}</div>
                        <div className="card-price">{money(item.price)}</div>
                    </div>;
                </button>
            )
        )}
        </>
    )
}