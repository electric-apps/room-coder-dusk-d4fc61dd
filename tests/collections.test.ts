import { describe, it, expect } from "vitest"
import { todoInsertSchema } from "@/db/zod-schemas"
import { generateValidRow, parseDates } from "./helpers/schema-test-utils"

describe("todos collection insert validation", () => {
	it("validates a valid todo insert row", () => {
		const row = generateValidRow(todoInsertSchema)
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("rejects a row with missing title", () => {
		const row = { ...generateValidRow(todoInsertSchema), title: undefined }
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("accepts a row without optional fields", () => {
		const row = {
			id: crypto.randomUUID(),
			title: "Learn Electric SQL",
			completed: false,
			priority: "high",
		}
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("validates JSON round-trip dates correctly", () => {
		const row = generateValidRow(todoInsertSchema)
		const roundTripped = parseDates(JSON.parse(JSON.stringify(row)))
		const result = todoInsertSchema.safeParse(roundTripped)
		expect(result.success).toBe(true)
	})

	it("accepts string dates after JSON round-trip", () => {
		const row = {
			id: crypto.randomUUID(),
			title: "Test task",
			completed: false,
			priority: "low",
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		}
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(true)
	})
})
