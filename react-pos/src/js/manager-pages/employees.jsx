import Editor from "../manager-components/editor";

export default function EmployeePage() {
  return (
    <Editor
      title="Employee"
      basePath="employee"
      fields={["Name", "Role", "Schedule"]}
      requiredFields={[0, 1, 2]}
      numericFields={[1,2]}
      headers={[
        { display: "Employee ID", key: "id" },
        { display: "Name", key: "name" },
        { display: "Role", key: "role" },
        { display: "Schedule", key: "schedule" }
      ]}
      extractValues={(item) => [
        item.name,
        item.role,
        item.schedule
      ]}
      buildPayload={(values, id) => ({
        id,
        name: values[0],
        role: values[1],
        schedule: values[2]
      })}
    />
  );
}
