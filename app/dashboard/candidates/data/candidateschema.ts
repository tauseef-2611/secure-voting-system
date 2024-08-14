import { z } from "zod";

export const CandidateSchema = z.object({
  candidate_id: z.string(),
  name: z.string(),
  phone: z.string(),
  year_of_membership: z.number(),
  date_of_birth: z.string(),
  unit: z.string(),
  area: z.string(),
  votes: z.number(),
});

export type CandidateSchema = z.infer<typeof CandidateSchema>;