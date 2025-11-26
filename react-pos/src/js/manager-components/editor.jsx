import { useEffect, useState } from "react";
import Table from "./table";
import EditDialog from "./editDialog";
import { MANAGER_BASE_URL } from "../manager";

export default function Editor({ title, fields, headers, basePath, extractValues, buildPayload, requiredFields = [], numericFields = [], defaultValues = {} }) {
  const [items, setItems] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("new");
  const [selectedItem, setSelectedItem] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const TABLE_HEADERS = [
    ...headers,
    {
      display: "Actions",
      key: "actions",
      render: (item) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={() => openEditDialog(item)}>Edit</button>
          <button onClick={() => handleDelete(item.id)}>Del</button>
        </div>
      )
    }
  ];

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const res = await fetch(`${MANAGER_BASE_URL}/${basePath}`, {
        credentials: 'include'
      });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(`Error fetching ${basePath}:`, err);
    }
  }

  async function handleDelete(id) {
    try {
      await fetch(`${MANAGER_BASE_URL}/${basePath}/del`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id })
      });
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      console.error(`Error deleting ${basePath}:`, err);
    }
  }

  function openNewDialog() {
    setDialogMode("new");
    setErrorMessage("");

    const values = Array(fields.length).fill("");

    // Apply default values by index
    for (const [index, value] of Object.entries(defaultValues)) {
      values[parseInt(index)] = value;
    }
    setSelectedItem({__prefill: true, values });
    setShowDialog(true);
  }

  function openEditDialog(item) {
    setDialogMode("edit");
    setSelectedItem(item);
    setErrorMessage("");
    setShowDialog(true);
  }

  async function handleDialogSubmit(values) {
    // Attepts to add fallback for picture_url if needed
    if (basePath == "menu") {
        values[5] = values[5]?.trim() ? values[5] : "/images/placeholder.png";
    }

    // Check for missing required fields
    const missingFields = requiredFields.filter(i => {
      const val = values[i];
      return val === undefined || val === null || (typeof val === "string" && val.trim() === "");
    });

    // Check for invalid numeric fields
    const invalidNumericFields = numericFields.filter(i => isNaN(parseFloat(values[i])));

    // Build error message
    if (missingFields.length > 0 || invalidNumericFields.length > 0) {
        const missingLabels = missingFields.map(i => fields[i]);
        const invalidLabels = invalidNumericFields.map(i => fields[i]);

        let message = "";

        if (missingLabels.length > 0) {
            message += `Please fill in the required fields: ${missingLabels.join(", ")}. `;
        }

        else if (invalidLabels.length > 0) {
            message += `Please enter valid numbers for: ${invalidLabels.join(", ")}.`;
        }

        setErrorMessage(message.trim());
        return;
    }


    // Build payload that will be sent to server
    const payload = buildPayload(values, dialogMode === "edit" ? selectedItem.id : null);
    
    // Determine 
    const method = "POST";
    const endpoint = dialogMode === "new" ? "add" : "update";

    // DELETE WHEN DONE
    // console.log("Received payload:", req.body);
    // (END DELETE)
    try {
      const res = await fetch(`${MANAGER_BASE_URL}/${basePath}/${endpoint}`, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorText = await res.text();
        const parsed = JSON.parse(errorText);
        if (res.status == 400 && parsed?.error?.includes("required")) {
            setErrorMessage("Please fill in all required fields.");
        } else {
            setErrorMessage(`Server error: ${parsed?.error || "Unknown error"}`);
        }
        return;
      }

      const result = await res.json();
      if (dialogMode === "new") {
        setItems([...items, result]);
      } else {
        await fetchItems();
      }
      setShowDialog(false);
      setErrorMessage("");
    } catch (err) {
      console.error(`Error saving ${basePath}:`, err);
      setErrorMessage("Unexpected error occured.");
    }

    
  }

  return (
    <div style={{marginLeft: "20px" }}>
      <h2>{title} Editor</h2>
      <button onClick={openNewDialog}>+ New {title}{title === "Employee" ? "" : " Item"}</button>
      <Table headers={TABLE_HEADERS} data={items} />
      {showDialog && (
        <EditDialog
          title={dialogMode === "new" ? `New ${title}` : `Edit ${title}`}
          fields={fields}
          requiredFields={requiredFields}
          initialValues={dialogMode === "edit" ? extractValues(selectedItem) : selectedItem?.__prefill ? selectedItem.values : []}
          onSubmit={handleDialogSubmit}
          onClose={() => setShowDialog(false)}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
}