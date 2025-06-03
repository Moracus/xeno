const toolbarItems = [
  { type: "field", label: "Name" },
  { type: "field", label: "Email" },
  { type: "field", label: "Spend" },
  { type: "field", label: "Visits" },
  { type: "field", label: "Last Active Date" },
  { type: "condition", label: "AND" },
  { type: "condition", label: "OR" },
  { type: "condition", label: "=" },
  { type: "condition", label: ">" },
  { type: "condition", label: "<" },
  { type: "input", label: "Input" },
];

const Toolbar = () => {
  const onDragStart = (event, type, label) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ type, label })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="p-4 bg-gray-200 border-r min-w-[200px]">
      <h3 className="mb-4 text-lg font-bold">Toolbar</h3>
      {toolbarItems.map((item, index) => (
        <div
          key={index}
          draggable
          onDragStart={(event) => onDragStart(event, item.type, item.label)}
          className="p-2 m-1 bg-gray-100 border rounded cursor-pointer hover:bg-gray-300"
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default Toolbar;
