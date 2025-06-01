const CampaignModal = ({
  isOpen,
  onClose,
  campaignName,
  setCampaignName,
  message,
  setMessage,
  createCampaign,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-1/3 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Create Campaign</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createCampaign();
          }}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="campaignName"
            >
              Campaign Name
            </label>
            <input
              type="text"
              id="campaignName"
              className="w-full border rounded-md p-2"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="message"
            >
              Message
            </label>
            <textarea
              id="message"
              className="w-full border rounded-md p-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CampaignModal;
