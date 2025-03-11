import OpenAI from "openai";
import { TravelPreferences, BookletContent } from "@shared/schema";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is required");
}

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateBookletContent(prefs: TravelPreferences): Promise<BookletContent> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are a professional travel writer creating engaging and informative travel booklets."
      },
      {
        role: "user",
        content: `Create a travel booklet for ${prefs.location} with these preferences:
        - Travel dates: ${prefs.startDate} to ${prefs.endDate}
        - Interests: ${prefs.interests.join(", ")}
        - Activity level: ${prefs.activityLevel}
        - Dining preferences: ${prefs.diningPreferences.join(", ")}
        - Additional notes: ${prefs.additionalNotes || "None"}

        Format the response as JSON with a title, summary, and sections array where each section has a title and content.`
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