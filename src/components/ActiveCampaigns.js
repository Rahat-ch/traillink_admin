import { useEffect, useState } from 'react';
import CampaignCreator from './CampaignCreator';

export default function ActiveCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [mounted, setMounted] = useState(false); // Track if component is mounted
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal state

  // Fetch campaign data from the API route
  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/campaigns');
      const data = await response.json();
      setCampaigns(data.campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  useEffect(() => {
    // Mark the component as mounted
    setMounted(true);

    // Fetch campaigns on mount
    if (mounted) {
      fetchCampaigns();
    }

    // Event listener for Escape key to close modal
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener on unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mounted]);

  const closeModal = () => {
    setIsModalOpen(false);
    fetchCampaigns(); // Refetch campaigns when modal closes
  };

  // Close modal when clicking outside of it
  const handleOutsideClick = (event) => {
    if (event.target.id === 'modal-overlay') {
      closeModal();
    }
  };

  // Prevent rendering until the component has mounted
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Active Campaigns</h1>

        {/* Create Campaign Button */}
        <div className="flex justify-end mb-6">
          <button
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 text-lg font-semibold rounded-lg"
            onClick={() => setIsModalOpen(true)}
          >
            Create Campaign
          </button>
        </div>

        {/* Campaigns List */}
        {campaigns.length === 0 ? (
          <p className="text-gray-500">No campaigns available.</p>
        ) : (
          <ul className="space-y-4">
            {campaigns.map((campaign, index) => (
              <li key={index} className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold">{campaign.name}</h2>
                <p className="text-gray-300">{campaign.description}</p>
                <h3 className="text-lg font-bold mt-4">Tasks:</h3>
                <ul className="list-disc pl-5 text-gray-400">
                  {campaign.tasks.map((task, taskIndex) => (
                    <li key={taskIndex}>
                      <strong>{task.name}</strong>: {task.description} (Points Earned: {task.pointsEarned})
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div
            id="modal-overlay"
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleOutsideClick}
          >
            <div className="bg-gray-800 py-4 px-6 rounded-lg shadow-lg max-w-md w-full relative max-h-[80vh] overflow-auto">
              {/* Close Button */}
              <button
                className="absolute top-3 right-3 text-white hover:text-gray-400 text-xl"
                onClick={closeModal}
              >
                ✕
              </button>

              {/* Campaign Creator Form */}
              <CampaignCreator />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
