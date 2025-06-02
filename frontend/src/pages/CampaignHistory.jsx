import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import CommunicationLogModal from "../components/campaign/CommunicationLogModal";

const backendUrl = import.meta.env.VITE_BACKENDURL;

const CampaignHistory = () => {
  const { authConfig } = useContext(AuthContext);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);

  const getAllCampaigns = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/campaigns`, authConfig);
      if (res.status === 200) {
        setCampaigns(res.data);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  useEffect(() => {
    getAllCampaigns();
  }, []);

  const openModal = (campaignId) => {
    setSelectedCampaignId(campaignId);
  };

  const closeModal = () => {
    setSelectedCampaignId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Campaign History
        </h1>

        {campaigns.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="px-6 py-3 text-left text-sm font-semibold border-b border-gray-200">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold border-b border-gray-200">
                      Audience Size
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold border-b border-gray-200">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-blue-50 transition-colors cursor-pointer`}
                      onClick={() => openModal(campaign._id)}
                    >
                      <td className="px-6 py-4 text-gray-900 border-b border-gray-200">
                        {campaign.name}
                      </td>
                      <td className="px-6 py-4 text-gray-900 border-b border-gray-200">
                        {campaign.audienceSize}
                      </td>
                      <td className="px-6 py-4 text-gray-900 border-b border-gray-200">
                        {new Date(campaign.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6 text-gray-600 text-center">
            No campaigns found.
          </div>
        )}

        {selectedCampaignId && (
          <CommunicationLogModal
            campaignId={selectedCampaignId}
            onClose={closeModal}
          />
        )}
      </div>
    </div>
  );
};

export default CampaignHistory;
