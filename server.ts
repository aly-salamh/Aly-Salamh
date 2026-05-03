import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { SEED_BRANDS, SEED_FEED, SEED_PRODUCTS } from "./src/data/seed.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/brands", (req, res) => {
    res.json(SEED_BRANDS);
  });

  app.get("/api/products", (req, res) => {
    res.json(SEED_PRODUCTS);
  });

  app.get("/api/feed", (req, res) => {
    res.json(SEED_FEED);
  });

  app.post("/api/stylist/recommendation", async (req, res) => {
    try {
      const { preferences, brands } = req.body;
      const { getStylistRecommendation } = await import("./src/services/geminiServer.ts");
      const result = await getStylistRecommendation(preferences, brands);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to get stylist recommendation" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, mode } = req.body;
      const { getChatResponse } = await import("./src/services/geminiServer.ts");
      const result = await getChatResponse(messages, mode);
      res.json({ text: result });
    } catch (error) {
      res.status(500).json({ error: "Failed to get chat response" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
