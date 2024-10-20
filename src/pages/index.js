import CampaignCreator from "@/components/CampaignCreator";
import ActiveCampaigns from "@/components/ActiveCampaigns";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (address !== undefined) {
      setIsLoading(false);
    }
  }, [address]);

  // Render a loading state while we check connection status
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
  //       <p>Loading...</p>
  //     </div>
  //   );
  // }

  return (
    <>
      <ActiveCampaigns />
      {isConnected ? (
        <ActiveCampaigns />
      ) : (
        <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-5xl font-bold mb-6">
              Create Your Blockchain Campaigns
            </h1>
            <p className="text-lg mb-8">
              Welcome to our simple and effective blockchain campaign creator.
              Launch your campaign, track tasks, and assign rewards in a
              decentralized, secure environment.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 text-lg font-semibold rounded-lg">
              Get Started
            </Button>
          </div>
          <div className="container mx-auto px-4 py-12 text-center">
            <h2 className="text-3xl font-semibold mb-4">
              Why Choose Our Platform?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Decentralized</h3>
                <p className="text-gray-300">
                  Your campaigns are hosted on the blockchain, ensuring
                  transparency and security.
                </p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Easy to Use</h3>
                <p className="text-gray-300">
                  Create and manage campaigns effortlessly with our
                  user-friendly interface.
                </p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Secure Rewards</h3>
                <p className="text-gray-300">
                  Assign tasks, track progress, and distribute points or rewards
                  in a secure manner.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
