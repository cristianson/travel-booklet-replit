import { TravelPreferences } from "@shared/schema";

if (!process.env.PERPLEXITY_API_KEY) {
  throw new Error("PERPLEXITY_API_KEY is required");
}

export async function getTravelRecommendations(prefs: TravelPreferences) {
  const response = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-sonar-small-128k-online",
      messages: [
        {
          role: "system",
          content: "You are a travel expert. Provide detailed recommendations based on the user's preferences."
        },
        {
          role: "user",
          content: `Create a travel guide for ${prefs.location} with the following preferences:
          - Travel dates: ${prefs.startDate} to ${prefs.endDate}
          - Interests: ${prefs.interests.join(", ")}
          - Activity level: ${prefs.activityLevel}
          - Dining preferences: ${prefs.diningPreferences.join(", ")}
          - Additional notes: ${prefs.additionalNotes || "None"}
          
          Provide recommendations in JSON format with sections for activities, dining, and general tips.`
        }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    throw new Error(`Perplexity API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
