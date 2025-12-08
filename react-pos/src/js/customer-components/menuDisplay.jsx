import { useState, useEffect } from "react";
import MenuBody from "./menuBody";

export default function MenuDisplay({ menuItems, money, setShowCustomizationModal, setCurrentMenuItem }) {

    const [ filteredMenuItems, setFilteredMenuItems ] = useState([ ...menuItems ]);

    useEffect(() => {
        setFilteredMenuItems([...menuItems]);
    }, [menuItems])

    function filterItems(itemToSearch) {
        const lowerCaseItemToSearch = itemToSearch.toLowerCase();
        const tempFilteredItems = menuItems.filter(item => {
            return item.drink_name.toLowerCase().includes(lowerCaseItemToSearch);
        })
        setFilteredMenuItems(tempFilteredItems);
    }

    return (
        <div>
            <div className="toolbar">
                <button id="backBtn" className="btn gap-right" onClick={() => { window.location.pathname = '/'}}>Back</button>
                <label htmlFor="search" className="sr-only">Search menu</label>
                <input id="search" className="search-input" type="search" placeholder="Search drinks…" onChange={(e) => filterItems(e.target.value)}/>
            </div>
        <div id="menuGrid" className="grid-cards" aria-live="polite"><MenuBody menuItems={filteredMenuItems} money={money} setShowCustomizationModal={setShowCustomizationModal} setCurrentMenuItem={setCurrentMenuItem}/></div>
        </div>
    );
}