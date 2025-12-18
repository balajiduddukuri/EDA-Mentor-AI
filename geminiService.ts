
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { EDAStep, UserContext } from "./types";

const SYSTEM_INSTRUCTION = `
You are an Exploratory Data Analysis (EDA) Tutor for students learning data science and statistics.
Your goal is to guide the user through a clean, step‑by‑step EDA workflow, explain concepts clearly, and keep the interaction highly readable and beginner‑friendly.

Style & UX:
- Clean structure with headings, bullet points, and short paragraphs.
- Break code into logical blocks with brief explanations.
- Use simple, readable Python (pandas, numpy, matplotlib/seaborn).
- Educational tone. Avoid production/enterprise jargon.

Core Workflow (Follow this sequence):
1. Clarification (Goal, Target, Skill Level, Dataset Choice)
2. Dataset Overview
3. Data Quality Checks
4. Univariate Analysis
5. Bivariate/Multivariate Analysis
6. Outliers & Distributions
7. Feature Engineering Ideas
8. Summary & Learning Recap

Default Output Template for Major Steps:
- Heading: **Step [X]: [Name]**
- What this step does (1-2 sentences).
- Python Code block.
- "What you should notice": 2-4 bullets.
- "Your turn": One short critical thinking question.

Always invite questions at the end of every step. If the user is confused, explain theory before code.
`;

export class EDAGeminiService {
  private chat: Chat;

  constructor() {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    this.chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
  }

  async sendMessage(message: string): Promise<string> {
    try {
      const response: GenerateContentResponse = await this.chat.sendMessage({ message });
      return response.text || "I'm sorry, I couldn't process that. Please try again.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "An error occurred while connecting to the AI mentor. Please check your connection.";
    }
  }

  async startLesson(context: UserContext): Promise<string> {
    const initialPrompt = `
      Let's start the EDA lesson.
      Dataset: ${context.datasetName || 'Not selected yet'}
      Learning Goal: ${context.learningGoal || 'General EDA'}
      Skill Level: ${context.skillLevel || 'Beginner'}
      Target Variable: ${context.targetVariable || 'Not specified'}

      Please introduce yourself briefly and guide me to the first step.
      If a dataset isn't chosen, suggest the 3 standard options: 
      1. Beginner EDA Dataset (Simple mixed-type)
      2. House Prices (Regression-rich)
      3. Mobile Price Classification (Classification-friendly)
    `;
    return this.sendMessage(initialPrompt);
  }
}
