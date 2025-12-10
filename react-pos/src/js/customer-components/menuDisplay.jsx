import { useState, useEffect, useMemo } from "react";
import MenuBody from "./menuBody";
import CategoryButtons from "../customer-components/categoryButtons.jsx";
import LanguageSelectorDropdown from "./languageSelector.jsx";
import { defaultMenuText } from "./defaultText.js";
import { translate } from "./languageSelector";

export default function MenuDisplay({ 
  menuItems, 
  money, 
  setShowCustomizationModal, 
  setCurrentMenuItem, 
  selectedCategory,
  setSelectedCategory,
  currentLanguage
  }) { 
    
    const [filteredMenuItems, setFilteredMenuItems] = useState([...menuItems]);

    const categoryOrder = ['Milk Tea', 'Fruit Tea', 'Smoothie', 'Slush', 'Specialty'];

    const [ menuText, setMenuText ] = useState(defaultMenuText);

    useEffect(() => {
        async function translateText() {
            try {
                const translatedText = await translate(menuText, currentLanguage);
                setMenuText(translatedText);
            }
            catch (err) {
                console.error("Error batch translating text:", err);
            }
        }
        translateText();
        },[currentLanguage])

    useEffect(() => {
        setFilteredMenuItems([...menuItems]);
    }, [menuItems]);

    const categorizedMenu = useMemo(() => {
        const itemsByCategory = new Map();
        
        filteredMenuItems.forEach(it => {
            const cat = it.category || 'Other';
            if (!itemsByCategory.has(cat)) itemsByCategory.set(cat, []);
            itemsByCategory.get(cat).push(it);
        });

        const categoriesToRender = [
            ...categoryOrder.filter(cat => itemsByCategory.has(cat) && cat === selectedCategory),
            ...Array.from(itemsByCategory.keys()).filter(
                cat => !categoryOrder.includes(cat) && cat === selectedCategory
            )
        ];

        return { itemsByCategory, categoriesToRender };
    }, [filteredMenuItems, categoryOrder, selectedCategory]); 

    function filterItems(itemToSearch) {
        const lowerCaseItemToSearch = itemToSearch.toLowerCase();
        const tempFilteredItems = menuItems.filter(item =>
            item.drink_name.toLowerCase().includes(lowerCaseItemToSearch)
        );
        setFilteredMenuItems(tempFilteredItems);
    }

    return (
        <div>
            <LanguageSelectorDropdown/>
            <div className="toolbar">
                <button 
                  id="backBtn" 
                  className="btn gap-right" 
                  onClick={() => { window.location.pathname = '/' }}
                >
                  Back
                </button>

                <label htmlFor="search" className="sr-only">{menuText[0]}</label>
                <input 
                  id="search" 
                  className="search-input" 
                  type="search" 
                  placeholder={menuText[1]} 
                  onChange={(e) => filterItems(e.target.value)}
                />
            </div>

            <CategoryButtons setSelectedCategory={setSelectedCategory} />
            <h3 className="menu-category-heading">{selectedCategory}</h3>

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
