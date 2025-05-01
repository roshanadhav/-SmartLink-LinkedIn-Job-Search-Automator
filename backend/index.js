// server.js or server.ts
import express, { text } from "express";
import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

import dotenv from "dotenv";
dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// llm model

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.use(
  cors({
    origin: "*",
  })
);

const server = new McpServer({
  name: "Demo",
  version: "1.0.0",
});

// MCP Tool
server.tool("add", { a: z.number(), b: z.number() }, async ({ a, b }) => ({
  content: [{ type: "text", text: String(a + b) }],
}));

// MCP Resource
server.resource(
  "greeting",
  new ResourceTemplate("greeting://{name}", { list: undefined }),
  async (uri, { name }) => ({
    contents: [
      {
        uri: uri.href,
        text: `Hello, ${name}!`,
      },
    ],
  })
);

const chatHistory = [];
// Custom endpoint to simulate an MCP call
// const chatHistory = [];
let waitingForLinkedInDetails = false;


app.post("/chat", async (req, res) => {
  const { message } = req.body;

  chatHistory.push({ role: "user", parts: [{ text: message }] });

  // Step 1: Check if user is asking for LinkedIn job application
  if (
    message.toLowerCase().includes("find jobs") &&
    message.toLowerCase().includes("linkedin")
  ) {
    waitingForLinkedInDetails = true;
    return res.json({
      reply: "Please share your LinkedIn ID, password, and the job title/role.",
    });
  }

  // Step 2: If waiting for credentials, try to extract info
  if (waitingForLinkedInDetails) {
    waitingForLinkedInDetails = false;

    // A simple pattern-based NLP extraction
    const idMatch = message.match(/id[:=]? ?([^\s,]+)/i);
    const passMatch = message.match(/pass(?:word)?[:=]? ?([^\s,]+)/i);
    const roleMatch = message.match(/(?:job)? ?role[:=]? ?(.+)/i);

    const id = idMatch ? idMatch[1] : null;
    const password = passMatch ? passMatch[1] : null;
    const jobRole = roleMatch ? roleMatch[1] : null;

    if (id && password && jobRole) {
      return res.json({
        reply: `LinkedIn credentials and job role received.\nID: ${id}\nPassword: ${password}\nRole: ${jobRole}`,
      });
    } else {
      waitingForLinkedInDetails = true;
      return res.json({
        reply:
          "Couldn't extract all details. Please format like: 'ID: your_id, Password: your_pass, Role: Software Engineer'",
      });
      
    }
  }

  // Fallback to AI if no specific logic matches
  const reply = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [{ role: "user", parts: [{ text: message }] }],
  });

  return res.json({ reply: reply.text });
});

app.listen(8080, () => {
  console.log("MCP server over HTTP running on http://localhost:3000");
});
