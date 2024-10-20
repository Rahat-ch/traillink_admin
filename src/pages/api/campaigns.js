import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'campaigns.json');

// Read campaigns data from the JSON file
const getCampaigns = () => {
  try {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading the JSON file:", error);
    throw new Error("Unable to read campaigns data");
  }
};

// Write new campaigns data to the JSON file
const writeCampaigns = (data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing to the JSON file:", error);
    throw new Error("Unable to write campaigns data");
  }
};

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const data = getCampaigns();
      return res.status(200).json(data);  // Return the entire data object (with "campaigns" key)
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving campaigns" });
    }
  }

  if (req.method === 'POST') {
    try {
      const newCampaign = req.body;
      const data = getCampaigns();

      // Add the new campaign to the existing campaigns array
      data.campaigns.push(newCampaign);

      // Write the updated campaigns back to the JSON file
      writeCampaigns(data); // Ensure we write the entire object, not just the campaigns array

      return res.status(201).json({ message: 'Campaign added successfully', campaigns: data.campaigns });
    } catch (error) {
      console.error("Error handling POST request:", error);
      return res.status(500).json({ message: "Error saving the campaign" });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
