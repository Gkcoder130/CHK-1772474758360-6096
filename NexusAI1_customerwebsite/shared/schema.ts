import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const aiServices = pgTable("ai_services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: text("price"),
  category: text("category"),
  iconUrl: text("icon_url"),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  industryType: text("industry_type"),
  budget: text("budget"),
  callPreference: text("call_preference"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAiServiceSchema = createInsertSchema(aiServices).omit({ id: true });
export const insertInquirySchema = createInsertSchema(inquiries).omit({ id: true, createdAt: true });

export type AiService = typeof aiServices.$inferSelect;
export type InsertAiService = z.infer<typeof insertAiServiceSchema>;

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;

export type InquiryRequest = InsertInquiry;
export type InquiryResponse = Inquiry;
export type AiServicesListResponse = AiService[];