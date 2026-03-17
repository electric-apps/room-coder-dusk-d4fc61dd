import { describe, it, expect } from "vitest"
import { todoSelectSchema, todoInsertSchema } from "@/db/zod-schemas"
import { generateValidRow, generateRowWithout } from "./helpers/schema-test-utils"

describe("todoSelectSchema", () => {
	it("accepts a valid todo row", () => {
		const row = generateValidRow(todoSelectSchema)
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("rejects a row missing title", () => {
		const row = generateRowWithout(todoSelectSchema, "title")
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("rejects a row missing completed", () => {
		const row = generateRowWithout(todoSelectSchema, "completed")
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(false)
	})
})

describe("todoInsertSchema", () => {
	it("accepts a valid insert row", () => {
		const row = generateValidRow(todoInsertSchema)
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("rejects a row missing title", () => {
		const row = generateRowWithout(todoInsertSchema, "title")
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("allows optional fields to be omitted", () => {
		const row = {
			id: crypto.randomUUID(),
			title: "Buy groceries",
			completed: false,
			priority: "medium",
		}
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(true)
	})
})
