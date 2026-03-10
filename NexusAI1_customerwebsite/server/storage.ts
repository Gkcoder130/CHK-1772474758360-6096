import { db } from "./db";
import {
  aiServices,
  inquiries,
  type InquiryRequest,
  type InquiryResponse,
  type AiServicesListResponse
} from "@shared/schema";

export interface IStorage {
  getServices(): Promise<AiServicesListResponse>;
  createInquiry(inquiry: InquiryRequest): Promise<InquiryResponse>;
}

export class DatabaseStorage implements IStorage {
  async getServices(): Promise<AiServicesListResponse> {
    return await db.select().from(aiServices);
  }

  async createInquiry(inquiry: InquiryRequest): Promise<InquiryResponse> {
    const [created] = await db.insert(inquiries).values(inquiry).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();