import { useEffect, useState } from "react";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKENDURL;

const CommunicationLogModal = ({ campaignId, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCommunicationLogs = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/logs/campaign/${campaignId}`
      );
      if (res.status === 200) {
        setLogs(res.data);
      }
    } catch (error) {
      console.error("Error fetching communication logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunicationLogs();
  }, [campaignId]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-3/4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold mb-4">Communication Logs</h2>
          <button
            className=" text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : logs.length > 0 ? (
          <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">
                  Customer Name
                </th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Message</th>
                <th className="border border-gray-300 px-4 py-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {log.customerId.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {log.status}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {log.message || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No logs found for this campaign.</p>
        )}
      </div>
    </div>
  );
};

export default CommunicationLogModal;
