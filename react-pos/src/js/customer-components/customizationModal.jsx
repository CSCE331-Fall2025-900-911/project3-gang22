import { useEffect, useState } from "react"
import { fetchCustomizations } from "../customer-pages/menu";
import "../../styles.css";
import { globalTranslateAllVisibleText } from "./languageSelector.jsx";

export default function CustomizationModal({ menuItemID, addItem, setShowCustomizationModal, setCustomizationSubtotals }) {

    const [ customizations, setCustomizations ] = useState([]);
    const [ customizationInUse, setCustomizationInUse ] = useState({})

    useEffect(() => {
        globalTranslateAllVisibleText();
    },[]);

    useEffect(() => {
        async function getItemCustomizations() {
            const data = await fetchCustomizations(menuItemID);
            const groupedData = {};
            const listOfCustomizations = {};

            data.forEach(customization => {
                const currentCustomization = customization.name;
                if (!groupedData[currentCustomization]) {
                    groupedData[currentCustomization] = [];
                    listOfCustomizations[currentCustomization] = [];
                }
                groupedData[currentCustomization].push(customization);
                listOfCustomizations[currentCustomization].push(`${customization.adjustment}+${false}`);
            });
            
            setCustomizationInUse(listOfCustomizations);
            setCustomizations(groupedData);
        }
        getItemCustomizations();

    }, [menuItemID]);

    function selectCustomization(customizationToSet) {
        const updatedCustomizations = { ...customizationInUse };
        const [customizationNameToSet, adjustmentNameToSet] = customizationToSet.split('+');

        if (customizationNameToSet === "Toppings") {
            // Toggle selection instead of single-select
            updatedCustomizations[customizationNameToSet] =
            updatedCustomizations[customizationNameToSet]?.map(adjustment => {
                const [tempAdjustmentName, tempSelected] = adjustment.split('+');
                if (tempAdjustmentName === adjustmentNameToSet) {
                // flip true/false
                return `${tempAdjustmentName}+${tempSelected === "true" ? false : true}`;
                }
                return adjustment; // leave others unchanged
            });
        } else {
            // Default single-select behavior
            updatedCustomizations[customizationNameToSet] =
            updatedCustomizations[customizationNameToSet]?.map(adjustment => {
                const [tempAdjustmentName] = adjustment.split('+');
                if (tempAdjustmentName === adjustmentNameToSet) {
                return `${tempAdjustmentName}+${true}`;
                } else {
                return `${tempAdjustmentName}+${false}`;
                }
            });
        }

        setCustomizationInUse(updatedCustomizations);
        }

    function calculateSubtotals() {
        let finalCustomizations = {};
        let totalCustomizationPrice = 0;
        Object.entries(customizations).forEach(([customizationName, customizationValues]) => {
            customizationValues.forEach(customization => {
                const selectedAdjustment = `${customization.adjustment}+${true}`;
                if (customizationInUse[customizationName]?.includes(selectedAdjustment)) {
                    console.log("customization found");
                    finalCustomizations = {...finalCustomizations, [customization.name]: {adjustment: customization.adjustment, price: customization.price}}
                    totalCustomizationPrice += parseFloat(customization.price || '0');
                }
           })
        })
        finalCustomizations.totalCustomizationPrice = totalCustomizationPrice;
        setShowCustomizationModal(false);
        addItem(menuItemID, finalCustomizations);

    }

    return (
        <div className="modal-overlay">
            <div className="modal-panel large" style={{height: "85vh", width: "600px"}}>
                <h2>Customizations</h2>

                <div className="modal-body">
                    {Object.entries(customizations).map(([customizationGroup, customizationOptions]) => ( 
                        <div key={customizationGroup} className="modal-item">
                            {customizationGroup}
                        <div key={customizationGroup} className="customization-wrap">
                            <div>
                                {customizationOptions.map(customization => {
                                    const customKey = `${customization.name}+${customization.adjustment}`
                                    const selectedAdjustment = `${customization.adjustment}+${true}`;
                                    return (
                                        <button 
                                            key={customKey} 
                                            className={customizationInUse[customization.name]?.includes(selectedAdjustment) ? "customization-btn selected" : "customization-btn"}
                                            onClick={() => selectCustomization(customKey)}>
                                                {customization.adjustment}
                                                {parseFloat(customization.price) != 0 && (
                                                    <><br />
                                                    {customization.price > 0 
                                                        ? `+${customization.price}` 
                                                        : `${customization.price}`}
                                                    </>
                                                )}
                                        </button>
                                    )
                                })}
                            </div>
                            </div>
                        </div>  
                    ))}
                </div>

                <div className="modal-footer row gap-lg">
                    <button className="btn" onClick={() => setShowCustomizationModal(false)}>Cancel</button>
                    <button className="btn primary" onClick={() => calculateSubtotals()}>Done</button>
                </div>
            </div>
        </div>
    )
}