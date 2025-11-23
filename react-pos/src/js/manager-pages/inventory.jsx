import Editor from "../manager-components/editor";

export default function InventoryPage() {
  return (
    <Editor
      title="Inventory"
      basePath="inventory"
      fields={["Item Name", "Unit", "Quantity", "Reorder Threshold", "Unit Cost"]}
      requiredFields={[0, 1, 2, 3, 4]} 
      numericFields={[2,3,4]}
      headers={[
        { display: "Item ID", key: "id" },
        { display: "Item Name", key: "name" },
        { display: "Unit", key: "unit" },
        { display: "Quantity", key: "quantity" },
        { display: "Reorder Threshold", key: "reorder_threshold" },
        { display: "Unit Cost", key: "unit_cost"}
      ]}
      extractValues={(item) => [
        item.name,
        item.unit,
        item.quantity,
        item.reorder_threshold,
        item.unit_cost
      ]}
      buildPayload={(values, id) => ({
        id,
        name: values[0],
        unit: values[1],
        quantity: parseFloat(values[2]),
        reorder_threshold: parseFloat(values[3]),
        unit_cost: parseFloat(values[4])
      })}
    />
  );
}