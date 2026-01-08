
import { GoogleGenAI, Type } from "@google/genai";
import { AssistantState } from "../types";

const API_KEY = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey: API_KEY });

const SYSTEM_INSTRUCTION = `You are a PMBOK 8th Edition Execution Assistant. 
Process 6.3 (Acquire Resources): 
- For Human Resources, you must identify: Name, Role, Source (Internal/External), and Assignment Status (Assigned, Onboarding, or Pending).
- For Physical Resources, you must identify: Item Name, Source (Internal/External), and Delivery Status (Delivered or Not Delivered).

Process 6.4 (Lead the Team):
- Identify Issues or Leadership Actions and suggest PMBOK-aligned strategies (e.g., Conflict Management, Influencing, Decision Making).
- For every Issue or Leadership Action, assign a Severity level: Low, Medium, or High based on its impact on the project performance.
- Provide a "Mitigation Plan" which is a detailed, multi-step action plan to resolve the issue or implement the leadership action.

KPI Management:
- Track "On-time Task Completion Rate" (0-100%).
- Track "Issue Resolution Time" (average hours to resolve).
- Analyze user input for project updates. If the user mentions task completion, delays, or resolution speeds, update the KPIs object.

Respond ONLY with a JSON object:
{
  "message": "Conversational PMBOK response",
  "newResources": [
    { 
      "name": "string", 
      "type": "Human" | "Physical", 
      "source": "Internal" | "External",
      "role": "string (optional for Human)",
      "assignmentStatus": "Assigned" | "Onboarding" | "Pending" (optional for Human),
      "deliveryStatus": "Delivered" | "Not Delivered" (optional for Physical)
    }
  ],
  "newLogs": [
    { 
      "type": "Issue" | "Leadership Action", 
      "description": "string", 
      "strategy": "string",
      "severity": "Low" | "Medium" | "High",
      "mitigationPlan": "string (detailed action plan)"
    }
  ],
  "updatedKPIs": {
    "onTimeCompletionRate": number,
    "issueResolutionTime": number,
    "resourceUtilization": number
  }
}`;

export const processAssistantQuery = async (
  query: string,
  currentState: AssistantState
) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Current state: ${JSON.stringify(currentState)}. User Input: ${query}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: { type: Type.STRING },
            newResources: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["Human", "Physical"] },
                  source: { type: Type.STRING, enum: ["Internal", "External"] },
                  role: { type: Type.STRING },
                  assignmentStatus: { type: Type.STRING, enum: ["Assigned", "Onboarding", "Pending"] },
                  deliveryStatus: { type: Type.STRING, enum: ["Delivered", "Not Delivered"] }
                },
                required: ["name", "type", "source"]
              }
            },
            newLogs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: ["Issue", "Leadership Action"] },
                  description: { type: Type.STRING },
                  strategy: { type: Type.STRING },
                  severity: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
                  mitigationPlan: { type: Type.STRING }
                },
                required: ["type", "description", "strategy", "severity", "mitigationPlan"]
              }
            },
            updatedKPIs: {
              type: Type.OBJECT,
              properties: {
                onTimeCompletionRate: { type: Type.NUMBER },
                issueResolutionTime: { type: Type.NUMBER },
                resourceUtilization: { type: Type.NUMBER }
              },
              required: ["onTimeCompletionRate", "issueResolutionTime", "resourceUtilization"]
            }
          },
          required: ["message", "newResources", "newLogs", "updatedKPIs"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    return data;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
