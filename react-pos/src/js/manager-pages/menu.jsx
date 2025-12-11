import Editor from "../manager-components/editor";
import { useEffect, useState } from "react";
import { MANAGER_BASE_URL } from "../manager";

export default function MenuPage() {
  const [allGroups, setAllGroups] = useState([]);

  useEffect(() => {
    document.title = "Manager - Menu Editor Page";

    async function fetchGroups() {
      try {
        const res = await fetch(`${MANAGER_BASE_URL}/customization_groups`, { credentials: "include" });
        const data = await res.json();
        setAllGroups(data);
      } catch (err) {
        console.error("Error fetching customization groups:", err);
      }
    }

    fetchGroups();
  }, []);

  return (
    <main role="main" aria-labelledby="menu-page-title">
      {/* <h1 id="menu-page-title">Menu Editor Page</h1> */}
      <Editor
        title="Menu"
        basePath="menu"
        fields={["Drink", "Price", "Category", "Tea", "Milk", "Picture URL"]}
        requiredFields={[0,1,2,5]}
        numericFields={[1]}
        defaultValues={{5:"/images/placeholder.png"}}
        allCustomizationGroups={allGroups}
        headers={[
          { display: "ID", key: "id" },
          { display: "Drink", key: "drink_name" },
          { display: "Price", key: "price" },
          { display: "Category", key: "category" },
          { display: "Tea", key: "tea_type" },
          { display: "Milk", key: "milk_type" },
          { display: "Image", key: "picture_url" },
          {
            display: "Customizations",
            key: "customization_groups",
            render: (item) => {
              if (!item.customization_groups) return "";
              const groups = item.customization_groups.split(",").map(g => g.trim());
              return (
                <div className="customization-list">
                  {groups.map((g, idx) => (
                    <span key={idx} className="customization-item">
                      {g}
                    </span>
                  ))}
                </div>
              );
            }
          }

        ]}
        extractValues={(item) => [
          item.drink_name,
          item.price,
          item.category,
          item.tea_type,
          item.milk_type,
          item.picture_url
        ]}
        buildPayload={(values, id) => {
          const pictureUrl = values[5] && values[5].trim() !== "" ? values[5] : "/images/placeholder.png";
          return {
            id,
            drink_name: values[0],
            price: parseFloat(values[1]),
            category: values[2],
            tea_type: values[3],
            milk_type: values[4],
            picture_url: pictureUrl
          };
        }}
        extraFields={(allGroups, selectedGroups, toggleGroup) => (
          <fieldset>
            <legend>Customizations</legend>
            <div className="customization-group-container">
              {allGroups.map((group) => (
                <label key={group} className="customization-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedGroups.includes(group)}
                    onChange={() => toggleGroup(group)}
                  />
                  {group}
                </label>
              ))}
            </div>
          </fieldset>
        )}

      />
    </main>
  );
}