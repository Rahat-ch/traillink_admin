"use client";

import { useState, useEffect } from "react";
import { PlusIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import abi from "@/abi.json"
import { toast } from "sonner";

export default function CampaignCreator() {
  const [tasks, setTasks] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track form submission state
  const { data: hash, isPending, writeContract } = useWriteContract();
  const {
    isLoading: isConfirming,
    error,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });
  // Ensure the component is rendered only after the client has mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  const addTask = () => {
    setTasks([
      ...tasks,
      {
        name: "",
        description: "",
        proof: "",
        pointsEarned: "",
        price: "0",
      },
    ]);
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleTaskChange = (index, field, value) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], [field]: value };
    setTasks(newTasks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable the form during submission
    
    const newCampaign = {
      name: e.target.campaignName.value,
      description: e.target.campaignDescription.value,
      tasks,
    };

    try {
      writeContract({
        address: "0x5B1B4c1fBa9bF1cBcB410CCe24a7fc059E925836",
        abi: abi,
        functionName: "createCampaignNFT",
        args: [newCampaign.name, newCampaign.description, "Palace of Fine Arts"],
      });
    } catch (error) {
      console.error(error)
    }
    

    try {
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCampaign),
      });

      if (response.ok) {
        // Handle successful campaign creation (you can show a success message or reset the form)
        console.log("Campaign submitted successfully!");
      } else {
        // Handle errors from the API
        console.error("Failed to submit the campaign.");
      }
    } catch (error) {
      console.error("An error occurred while submitting the campaign:", error);
    } finally {
      setIsSubmitting(false); // Re-enable the form
    }
  };

  useEffect(() => {
    if (isConfirming) {
      toast.loading("Transaction Pending");
    }
    if (isConfirmed) {
      toast.success("Transaction Successful", {
        action: {
          label: "View on PolygonScan",
          onClick: () => {
            window.open(`https://amoy.polygonscan.com/tx/${hash}`);
          },
        },
      });
    }
    if (error) {
      toast.error("Transaction Failed");
    }
  }, [isConfirming, isConfirmed, error, hash]);

  // Prevent rendering until mounted on the client
  if (!mounted) {
    return null;
  }

  

  return (
    <div className="flex items-center justify-center bg-transparent">
      <Card className="w-full max-w-lg bg-gray-800 text-white shadow-lg p-4">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Create New Blockchain Campaign</CardTitle>
          <CardDescription className="text-gray-400">
            Fill in the details to create a new marketing campaign on the blockchain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="campaignName" className="text-gray-300">Campaign Name</Label>
                <Input
                  id="campaignName"
                  placeholder="Enter campaign name"
                  required
                  className="bg-gray-700 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <Label htmlFor="campaignDescription" className="text-gray-300">Description</Label>
                <Textarea
                  id="campaignDescription"
                  placeholder="Describe your campaign"
                  required
                  className="bg-gray-700 text-white placeholder-gray-400"
                />
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-4 text-white">Tasks</h3>
                {tasks.length === 0 ? (
                  <p className="text-gray-500">No tasks added. Add a task to start.</p>
                ) : (
                  tasks.map((task, index) => (
                    <Card key={index} className="mb-4 bg-gray-700 text-white shadow-md">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-white">Task {index + 1}</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTask(index)}
                          className="text-gray-400 hover:text-white"
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4">
                          <div>
                            <Label htmlFor={`taskName-${index}`} className="text-gray-300">
                              Task Name
                            </Label>
                            <Input
                              id={`taskName-${index}`}
                              value={task.name}
                              onChange={(e) =>
                                handleTaskChange(index, "name", e.target.value)
                              }
                              placeholder="Enter task name"
                              required
                              className="bg-gray-600 text-white placeholder-gray-400"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`taskDescription-${index}`} className="text-gray-300">
                              Description
                            </Label>
                            <Textarea
                              id={`taskDescription-${index}`}
                              value={task.description}
                              onChange={(e) =>
                                handleTaskChange(index, "description", e.target.value)
                              }
                              placeholder="Describe the task"
                              required
                              className="bg-gray-600 text-white placeholder-gray-400"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`taskProof-${index}`} className="text-gray-300">
                              Required Proof
                            </Label>
                            <Input
                              id={`taskProof-${index}`}
                              value={task.proof}
                              onChange={(e) =>
                                handleTaskChange(index, "proof", e.target.value)
                              }
                              placeholder="e.g., Screenshot, URL, etc."
                              required
                              className="bg-gray-600 text-white placeholder-gray-400"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`taskPoints-${index}`} className="text-gray-300">
                              Points Earned
                            </Label>
                            <Input
                              id={`taskPoints-${index}`}
                              value={task.pointsEarned}
                              onChange={(e) =>
                                handleTaskChange(index, "pointsEarned", e.target.value)
                              }
                              placeholder="Enter points"
                              required
                              className="bg-gray-600 text-white placeholder-gray-400"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`taskPrice-${index}`} className="text-gray-300">
                              Price (USD)
                            </Label>
                            <Input
                              id={`taskPrice-${index}`}
                              type="number"
                              value={task.price}
                              onChange={(e) =>
                                handleTaskChange(index, "price", e.target.value)
                              }
                              placeholder="0"
                              disabled
                              className="bg-gray-600 text-white"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
                <Button
                  type="button"
                  onClick={addTask}
                  className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <PlusIcon className="mr-2 h-4 w-4" /> Add Task
                </Button>
              </div>
            </div>
            <CardFooter className="flex justify-between mt-4">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting} // Disable while submitting
              >
                {isSubmitting ? 'Submitting...' : 'Create Campaign'}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
