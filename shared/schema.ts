import { z } from "zod";

// Period entry schema
export const periodEntrySchema = z.object({
  id: z.string(),
  date: z.string(), // ISO date string
  isStart: z.boolean(),
  isEnd: z.boolean(),
  flow: z.enum(['light', 'medium', 'heavy']).optional(),
  notes: z.string().optional(),
});

// Daily log schema
export const dailyLogSchema = z.object({
  id: z.string(),
  date: z.string(), // ISO date string
  mood: z.enum(['happy', 'sad', 'irritated', 'energetic', 'tired', 'romantic']).optional(),
  symptoms: z.array(z.enum(['cramps', 'headache', 'bloating', 'tender_breasts', 'acne', 'fatigue', 'nausea'])),
  notes: z.string().optional(),
  temperature: z.number().optional(),
  isPeriodDay: z.boolean().default(false),
});

// Cycle data schema
export const cycleSchema = z.object({
  id: z.string(),
  startDate: z.string(), // ISO date string
  endDate: z.string().optional(), // ISO date string
  length: z.number().optional(),
  periodLength: z.number().optional(),
});

// App settings schema
export const settingsSchema = z.object({
  averageCycleLength: z.number().default(28),
  averagePeriodLength: z.number().default(5),
  lutealPhaseLength: z.number().default(14),
  reminders: z.object({
    periodReminder: z.boolean().default(true),
    ovulationReminder: z.boolean().default(true),
  }).default({}),
});

// Export types
export type PeriodEntry = z.infer<typeof periodEntrySchema>;
export type DailyLog = z.infer<typeof dailyLogSchema>;
export type Cycle = z.infer<typeof cycleSchema>;
export type Settings = z.infer<typeof settingsSchema>;

// Prediction types
export type CyclePrediction = {
  nextPeriodDate: Date;
  fertileWindowStart: Date;
  fertileWindowEnd: Date;
  ovulationDate: Date;
  currentCycleDay: number;
  currentCycleLength: number;
};
