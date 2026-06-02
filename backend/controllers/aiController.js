import Groq from "groq-sdk";
import ChatbotSupport from "../models/ChatbotSupport.js";

let groq;

const getGroqClient = () => {
    if (!groq) {
        if (!process.env.GROQ_API_KEY) {
            throw new Error("GROQ_API_KEY is missing in environment variables");
        }
        groq = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });
    }
    return groq;
};


export const handleSkyAgent = async (req, res) => {
    try {
        const { message, chatHistory } = req.body;
        const userId = req.user?.id;

        const client = getGroqClient();

        // Using Llama 3 on Groq for high performance
        const chatCompletion = await client.chat.completions.create({

            messages: [
                {
                    role: "system",
                    content: "You are Sky, the AI travel agent for SkyLiners. Help users with itineraries for destinations like Hunza and Lahore. Keep responses concise and friendly."
                },
                {
                    role: "user",
                    content: message
                }
            ],
            model: "llama-3.3-70b-versatile",
        });

        const responseText = chatCompletion.choices[0]?.message?.content || "";

        // Log the interaction to the database as per SDD Requirements
        if (userId) {
            await ChatbotSupport.create({
                userId,
                query: message,
                captureTime: new Date()
            });
        }

        res.status(200).json({ reply: responseText });
    } catch (error) {
        console.error("DEBUG SKY ERROR:", error.message);
        res.status(500).json({ error: "Sky is currently offline." });
    }
};