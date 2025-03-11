import OpenAI from "openai";
import { TravelPreferences, BookletContent } from "@shared/schema";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is required");
}

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateTravelPrompt(prefs: TravelPreferences): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are a travel expert helping to create detailed prompts for travel recommendations. Create a comprehensive prompt that will help get the most relevant travel information."
      },
      {
        role: "user",
        content: `Create a detailed prompt for getting travel recommendations based on these preferences:
        - Destination: ${prefs.location}
        - Travel dates: ${prefs.startDate} to ${prefs.endDate}
        - Interests: ${prefs.interests.join(", ")}
        - Activity level: ${prefs.activityLevel}
        - Dining preferences: ${prefs.diningPreferences.join(", ")}
        - Restaurant budget: ${prefs.restaurantBudget === 1 ? 'Budget-friendly' : prefs.restaurantBudget === 2 ? 'Moderate' : 'High-end'}
        - Additional notes: ${prefs.additionalNotes || "None"}

        Format the prompt to get specific recommendations for activities, dining, and practical tips that match these preferences.`
      }
    ],
    temperature: 0.7,
  });

  return response.choices[0].message.content || "";
}

export async function generateBookletContent(prefs: TravelPreferences, travelRecommendations: string): Promise<BookletContent> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are a professional travel writer creating engaging and informative travel booklets. Format the recommendations into a well-structured travel guide."
      },
      {
        role: "user",
        content: `Create a travel booklet for ${prefs.location} based on these recommendations:\n\n${travelRecommendations}\n\nFormat the response as JSON with a title, summary, and sections array where each section has a title and content.`
      }
    ],
    response_format: { type: "json_object" }
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("Failed to generate booklet content");
  }

  return JSON.parse(content) as BookletContent;
}