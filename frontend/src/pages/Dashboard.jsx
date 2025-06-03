import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import CampaignModal from "../components/campaign/CampaignModal";
import QueryBuilder from "../components/dragndrop/QueryBuilder";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKENDURL;

const Dashboard = () => {
  const [query, setQuery] = useState("");
  const [customers, setCustomers] = useState(null);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const { authConfig } = useContext(AuthContext);
  const [campaignName, setCampaignName] = useState("");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState(0); //0-nlp.1-dnd
  const navigate = useNavigate();

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
      if (res.status === 201) {
        navigate("/campaign-history");
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
    } finally {
      setIsModalOpen(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Campaign Dashboard
        </h1>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4 p-4">
            select query mode:
            <input
              type="radio"
              name="mode"
              id="nlp"
              checked={selectedMode == 0}
              onClick={() => setSelectedMode(0)}
            />
            <label htmlFor="nlp">natural language</label>
            <input
              type="radio"
              id="dnd"
              name="mode"
              checked={selectedMode == 1}
              onClick={() => setSelectedMode(1)}
            />
            <label htmlFor="dnd">drag n drop</label>
          </div>
          {selectedMode == 0 && (
            <textarea
              className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none transition-all duration-200"
              placeholder="Enter your query in natural language (e.g., 'Find customers who spent over $100 last month')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          )}
          {selectedMode == 1 && <QueryBuilder setQuery={setQuery} />}
          <button
            className={`mt-4 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Searching...
              </span>
            ) : (
              "Search Customers"
            )}
          </button>
        </div>

        {/* Results Section */}
        {customers?.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Search Results
              </h2>
              <span className="text-sm text-gray-600">
                <strong>Total Rows:</strong> {totalRows}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="px-6 py-3 text-left text-sm font-semibold border-b border-gray-200">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold border-b border-gray-200">
                      Spend
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold border-b border-gray-200">
                      Visits
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold border-b border-gray-200">
                      Last Active
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-blue-50 transition-colors`}
                    >
                      <td className="px-6 py-4 text-gray-900 border-b border-gray-200">
                        {customer?.name}
                      </td>
                      <td className="px-6 py-4 text-gray-900 border-b border-gray-200">
                        ${customer?.spend.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-gray-900 border-b border-gray-200">
                        {customer?.visits}
                      </td>
                      <td className="px-6 py-4 text-gray-900 border-b border-gray-200">
                        {
                          new Date(customer?.lastActiveDate)
                            .toISOString()
                            .split("T")[0]
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Create Campaign Button */}
        {customers && customers?.length > 0 && (
          <button
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            Create Campaign
          </button>
        )}

        {/* Campaign Modal */}
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
    </div>
  );
};

export default Dashboard;
