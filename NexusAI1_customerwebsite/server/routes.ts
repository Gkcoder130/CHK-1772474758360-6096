import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { db } from "./db";
import { aiServices } from "@shared/schema";

async function seedDatabase() {
  const existingServices = await storage.getServices();
  if (existingServices.length === 0) {
    await db.insert(aiServices).values([
      {
        name: "Voice AI Agent",
        description: "Human-like AI agents that handle outbound and inbound sales calls with 95% accuracy.",
        category: "Automation",
        iconUrl: "PhoneCall",
      },
      {
        name: "Lead Management",
        description: "Automated lead qualification and CRM synchronization for your sales pipeline.",
        category: "Sales",
        iconUrl: "Users",
      },
      {
        name: "Call Analytics",
        description: "Deep insights into call performance, sentiment analysis, and conversion tracking.",
        category: "Analytics",
        iconUrl: "BarChart3",
      },
      {
        name: "Multi-Domain Support",
        description: "Deployment across multiple domains and industries with specialized knowledge bases.",
        category: "Infrastructure",
        iconUrl: "Globe",
      },
    ]);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed the database
  seedDatabase().catch(console.error);

  app.get(api.services.list.path, async (req, res) => {
    const servicesList = await storage.getServices();
    res.json(servicesList);
  });

  app.post(api.inquiries.create.path, async (req, res) => {
    try {
      const input = api.inquiries.create.input.parse(req.body);
      const inquiry = await storage.createInquiry(input);
      res.status(201).json(inquiry);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  return httpServer;
}