import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { todos } from "./schema";

export const todoSelectSchema = createSelectSchema(todos, {
	due_date: z.union([z.date(), z.string()]).nullable().optional(),
	created_at: z.union([z.date(), z.string()]),
	updated_at: z.union([z.date(), z.string()]),
});

export const todoInsertSchema = createInsertSchema(todos, {
	due_date: z.union([z.date(), z.string()]).nullable().optional(),
	created_at: z.union([z.date(), z.string()]).optional(),
	updated_at: z.union([z.date(), z.string()]).optional(),
});

export type Todo = typeof todoSelectSchema._type;
export type NewTodo = typeof todoInsertSchema._type;
