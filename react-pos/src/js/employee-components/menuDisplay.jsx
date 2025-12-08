import { useState, useEffect, useMemo } from "react";
import MenuBody from "./menuBody";

export default function MenuDisplay({ menuItems, money, setShowCustomizationModal, setCurrentMenuItem, selectedCategory }) { 
    // ^^^ Correct prop name used here
    
    const [ filteredMenuItems, setFilteredMenuItems ] = useState([ ...menuItems ]);

    // 1. Define the constant order list
    const categoryOrder = ['Milk Tea', 'Fruit Tea', 'Smoothie', 'Slush', 'Specialty'];

    useEffect(() => {
        // Reset the filtered list when the original menuItems prop changes
        setFilteredMenuItems([...menuItems]);
    }, [menuItems])

    // 2. Use useMemo to recalculate grouping/ordering whenever filteredMenuItems changes
    const categorizedMenu = useMemo(() => {
        // Group items by category from the *filtered* list
        const itemsByCategory = new Map();
        
        filteredMenuItems.forEach(it => {
            const cat = it.category || 'Other';
            if (!itemsByCategory.has(cat)) itemsByCategory.set(cat, []);
            itemsByCategory.get(cat).push(it);
        });

        // Determine the final order of categories to render, filtered by selectedCategory (string)
        const categoriesToRender = [
            ...categoryOrder.filter(cat => itemsByCategory.has(cat) && cat === selectedCategory),
            ...Array.from(itemsByCategory.keys()).filter(cat => !categoryOrder.includes(cat) && cat === selectedCategory)
        ];

        return { itemsByCategory, categoriesToRender };
    }, [filteredMenuItems, categoryOrder, selectedCategory]); 

    
    function filterItems(itemToSearch) {
        // ... (filter logic remains the same) ...
        const lowerCaseItemToSearch = itemToSearch.toLowerCase();
        const tempFilteredItems = menuItems.filter(item => {
            // Check if the drink name includes the search term
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
            <div id="menuGrid" className="grid-cards" aria-live="polite">
                <MenuBody 
                    itemsByCategory={categorizedMenu.itemsByCategory}
                    categoriesToRender={categorizedMenu.categoriesToRender}
                    money={money} 
                    setShowCustomizationModal={setShowCustomizationModal} 
                    setCurrentMenuItem={setCurrentMenuItem}
                />
            </div>
        </div>
    );
}