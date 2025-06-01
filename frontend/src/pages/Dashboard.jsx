import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import CampaignModal from "../components/campaign/CampaignModal";

const backendUrl = import.meta.env.VITE_BACKENDURL;

const Dashboard = () => {
  const [query, setQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const { authConfig } = useContext(AuthContext);
  const [campaignName, setCampaignName] = useState("");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/llm/search-customers`, {
        query,
      });
      setCustomers(res.data.customers || []);
      setTotalRows(res.data.total || 0);
    } catch (err) {
      console.error("Error searching customers:", err);
      setCustomers([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${backendUrl}/api/campaigns/create`,
        {
          name: campaignName,
          audienceSize: totalRows,
          customers: JSON.stringify(customers),
          message,
        },
        authConfig
      );
      alert("Campaign created successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating campaign:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">Campaign Dashboard</h1>
      <textarea
        className="w-2/3 h-24 p-4 border rounded-md mb-4"
        placeholder="Enter your query in natural language"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-6"
        onClick={handleSearch}
        disabled={loading}
      >
        {loading ? "Searching..." : "Search"}
      </button>

      {customers.length > 0 && (
        <div className="w-2/3 bg-white p-4 rounded-md shadow-md">
          <div className="mb-4">
            <strong>Total Rows:</strong> {totalRows}
          </div>
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Spend</th>
                <th className="border border-gray-300 px-4 py-2">Visits</th>
                <th className="border border-gray-300 px-4 py-2">lastActive</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {customer.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {customer.spend}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {customer.visits}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {
                      new Date(customer.lastActiveDate)
                        .toISOString()
                        .split("T")[0]
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        className="mt-6 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        onClick={() => setIsModalOpen(true)}
      >
        Create Campaign
      </button>

      <CampaignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        campaignName={campaignName}
        setCampaignName={setCampaignName}
        message={message}
        setMessage={setMessage}
        createCampaign={createCampaign}
        loading={loading}
      />
    </div>
  );
};

export default Dashboard;
