import React, { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  addEdge,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Handle,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const FieldNode = ({ data }) => (
  <div className="bg-blue-200 border border-blue-400 rounded p-2 text-center">
    {data.label}
    <Handle
      type="source"
      position="right"
      id="output"
      style={{ background: "#555" }}
    />
  </div>
);

const ConditionNode = ({ data }) => (
  <div className="bg-green-200 border border-green-400 rounded p-2 text-center">
    {data.label}
    <Handle
      type="target"
      position="left"
      id="input"
      style={{ background: "#555" }}
    />
    <Handle
      type="source"
      position="right"
      id="output"
      style={{ background: "#555" }}
    />
  </div>
);

const InputNode = ({ data, id }) => {
  const [value, setValue] = useState(data.value || "");

  const handleChange = (e) => {
    setValue(e.target.value);
    data.onValueChange(id, e.target.value); // Update the parent state
  };

  return (
    <div className="bg-yellow-200 border border-yellow-400 rounded p-2 text-center">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Enter value"
        className="p-1 border rounded w-[90%]"
      />
      <Handle
        type="target"
        position="left"
        id="input"
        style={{ background: "#555" }}
      />
    </div>
  );
};

const nodeTypes = {
  field: FieldNode,
  condition: ConditionNode,
  input: InputNode,
};

const QueryBuilderCanvas = ({ setQuery }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  // Function to generate the query from nodes and edges
  const generateQuery = useCallback(() => {
    // Find all valid paths: field -> condition -> input
    const queries = [];

    // Create a map for quick node lookup
    const nodeMap = new Map(nodes.map((node) => [node.id, node]));

    // Find all field nodes as starting points
    const fieldNodes = nodes.filter((node) => node.type === "field");

    // For each field node, find connected condition and input nodes
    fieldNodes.forEach((fieldNode) => {
      // Find edges where the field node is the source
      const fieldEdges = edges.filter((edge) => edge.source === fieldNode.id);
      fieldEdges.forEach((fieldEdge) => {
        const conditionNode = nodeMap.get(fieldEdge.target);
        if (conditionNode?.type === "condition") {
          // Find edges where the condition node is the source
          const conditionEdges = edges.filter(
            (edge) => edge.source === conditionNode.id
          );
          conditionEdges.forEach((conditionEdge) => {
            const inputNode = nodeMap.get(conditionEdge.target);
            if (inputNode?.type === "input" && inputNode.data.value) {
              // Construct query fragment: field_label condition_label input_value
              const queryFragment = `${fieldNode.data.label} ${conditionNode.data.label} ${inputNode.data.value}`;
              queries.push(queryFragment);
            }
          });
        }
      });
    });

    // Join queries with "AND" for disconnected components
    const queryString = queries.length > 0 ? queries.join(" AND ") : "";
    console.log(queryString);
    setQuery(queryString);
  }, [nodes, edges, setQuery]);

  // Update query whenever nodes or edges change
  useEffect(() => {
    generateQuery();
  }, [nodes, edges, generateQuery]);

  const onConnect = useCallback((params) => {
    setEdges((eds) => {
      const updatedEdges = addEdge(params, eds);
      return updatedEdges;
    });
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = event.target.getBoundingClientRect();
      const data = JSON.parse(
        event.dataTransfer.getData("application/reactflow")
      );
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };
      const id = `${data.type}-${nodes.length}`;
      const newNode = {
        id,
        type: data.type,
        position,
        data: {
          label: data.label,
          value: "",
          onValueChange: (nodeId, newValue) => {
            setNodes((nds) =>
              nds.map((node) =>
                node.id === nodeId
                  ? { ...node, data: { ...node.data, value: newValue } }
                  : node
              )
            );
          },
        },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [nodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => {
      const updatedNodes = applyNodeChanges(changes, nds);
      return updatedNodes;
    });
  }, []);

  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => {
      const updatedEdges = applyEdgeChanges(changes, eds);
      return updatedEdges;
    });
  }, []);

  return (
    <div className="flex-grow h-screen bg-gray-100">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
      </ReactFlow>
    </div>
  );
};

export default QueryBuilderCanvas;
