import { z } from 'zod';
import { PolicySection, PolicySections } from './types';

export const policySection: z.ZodSchema<PolicySection> = z
  .object({
    id: z.string(),
    title: z.string(),
    children: z.lazy(() => z.array(policySection)).optional(),
    htmlContent: z.union([z.string(), z.array(z.string())]).optional(),
    miscData: z.record(z.unknown()).optional(),
  })
  .nonstrict();

export const policySections: z.ZodSchema<PolicySections> =
  z.array(policySection);
