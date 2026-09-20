import { z } from "zod";

/**
 * Shared Zod schemas for every dated, sourced fact on the site.
 *
 * These are the single source of truth for the data model. Types are inferred
 * from the schemas so a change here flows everywhere. Datasets are validated at
 * import time (see `assertValid`) and by unit tests, so a malformed record
 * fails the build/tests rather than rendering `undefined`.
 */

/** Full ISO calendar date, e.g. 2026-09-20. Used for "last checked". */
export const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected an ISO date (YYYY-MM-DD)");

/** Looser publication date: YYYY, YYYY-MM or YYYY-MM-DD. */
export const loosableDate = z
  .string()
  .regex(/^\d{4}(-\d{2}(-\d{2})?)?$/, "Expected YYYY, YYYY-MM or YYYY-MM-DD");

export const geographyEnum = z.enum([
  "AU",
  "NSW",
  "VIC",
  "QLD",
  "WA",
  "SA",
  "TAS",
  "ACT",
  "NT",
]);
export type Geography = z.infer<typeof geographyEnum>;

export const sourceTypeEnum = z.enum([
  "government",
  "regulator",
  "industry",
  "publisher",
  "research",
  "policy",
]);
export type SourceType = z.infer<typeof sourceTypeEnum>;

export const sourceRecordSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  organisation: z.string().min(1),
  url: z.string().url(),
  sourceType: sourceTypeEnum,
  publishedAt: loosableDate.optional(),
  updatedAt: loosableDate.optional(),
  checkedAt: isoDate,
  /** Reference/policy sources may exist without being cited by a content page. */
  referenceOnly: z.boolean().optional(),
  notes: z.string().optional(),
});
export type SourceRecord = z.infer<typeof sourceRecordSchema>;

export const costUnitEnum = z.enum([
  "AUD",
  "AUD/hour",
  "AUD/m2",
  "AUD/kWh",
  "percent",
]);
export type CostUnit = z.infer<typeof costUnitEnum>;

export const costRepresentationEnum = z.enum([
  "range",
  "average",
  "example",
  "program-rule",
]);

export const confidenceEnum = z.enum(["high", "medium", "low"]);

export const costDatumSchema = z
  .object({
    id: z.string().min(1),
    category: z.string().min(1),
    metric: z.string().min(1),
    geography: geographyEnum,
    unit: costUnitEnum,
    low: z.number().optional(),
    typical: z.number().optional(),
    high: z.number().optional(),
    representation: costRepresentationEnum,
    scope: z.string().min(1),
    includes: z.array(z.string()),
    excludes: z.array(z.string()),
    sourceId: z.string().min(1),
    sourceDate: loosableDate.optional(),
    checkedAt: isoDate,
    effectiveFrom: loosableDate.optional(),
    effectiveTo: loosableDate.optional(),
    confidence: confidenceEnum,
  })
  .refine((d) => d.low !== undefined || d.typical !== undefined || d.high !== undefined, {
    message: "A cost datum must have at least one of low/typical/high",
  })
  .refine(
    (d) =>
      d.low === undefined || d.high === undefined || d.low <= d.high,
    { message: "low must be <= high" },
  );
export type CostDatum = z.infer<typeof costDatumSchema>;

export const programHistoryEntrySchema = z.object({
  date: isoDate,
  change: z.string().min(1),
});

export const batteryProgramSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  checkedAt: isoDate,
  effectiveFrom: isoDate,
  effectiveTo: isoDate.optional(),
  /** Headline support described exactly as the source words it. */
  headlineSupport: z.string().min(1),
  /** Approximate percentage used for the *indicative* estimator, never shown as guaranteed. */
  indicativeDiscountPercent: z.number().min(0).max(100),
  capacityEligibilityMinKWh: z.number().min(0),
  capacityEligibilityMaxKWh: z.number().min(0),
  capacityEligibilityNote: z.string().min(1),
  sourceIds: z.array(z.string().min(1)).min(1),
  officialUrl: z.string().url(),
  notes: z.array(z.string()),
  history: z.array(programHistoryEntrySchema),
});
export type BatteryProgram = z.infer<typeof batteryProgramSchema>;

/** Content frontmatter for typed content modules (article/guide/hub/etc.). */
export const contentCategoryEnum = z.enum([
  "air-conditioning",
  "solar-batteries",
  "renovations",
  "trades",
  "states",
  "calculators",
  "energy",
  "data",
  "trust",
  "legal",
  "site",
]);

export const contentIntentEnum = z.enum([
  "informational",
  "commercial-research",
  "tool",
  "comparison",
  "trust",
  "legal",
  "utility",
  "brand",
]);

export const frontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "kebab-case slug"),
  description: z.string().min(1),
  category: contentCategoryEnum,
  intent: contentIntentEnum,
  publishedAt: isoDate,
  updatedAt: isoDate,
  authorId: z.string().min(1),
  reviewerId: z.string().nullable(),
  primaryKeyword: z.string().min(1),
  sourceIds: z.array(z.string()).default([]),
  calculatorId: z.string().nullable().default(null),
  index: z.boolean().default(true),
  featured: z.boolean().default(false),
  aliases: z.array(z.string()).optional(),
});
export type Frontmatter = z.infer<typeof frontmatterSchema>;

/** Validate a dataset up-front; throws with a readable message on failure. */
export function assertValid<T>(
  schema: z.ZodType<T>,
  data: unknown,
  label: string,
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid ${label}:\n${issues}`);
  }
  return result.data;
}
