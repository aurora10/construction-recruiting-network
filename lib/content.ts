import type { ContentOverride } from "@/lib/data"
import rawOverrides from "@/lib/generated-content.json"

type OverrideEntry = Record<string, ContentOverride>

const nested = rawOverrides as unknown as OverrideEntry[][]

export const contentOverrides: Record<string, ContentOverride> = Object.assign({}, ...nested.flat())

export function getContentOverride(citySlug: string, tradeSlug: string): ContentOverride | undefined {
  const tradeShort = tradeSlug.split("-")[0]
  return contentOverrides[`${citySlug}-${tradeShort}`]
}
