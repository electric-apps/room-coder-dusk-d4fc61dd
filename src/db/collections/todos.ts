import { createCollection } from "@tanstack/db";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { type Todo, todoSelectSchema } from "@/db/zod-schemas";

export const todosCollection = createCollection(
	electricCollectionOptions({
		id: "todos",
		schema: todoSelectSchema,
		shapeOptions: {
			url: "/api/todos",
		},
		getKey: (todo) => (todo as Todo).id,
		onInsert: async ({ transaction }) => {
			const item = transaction.mutations[0]?.modified as Todo;
			const response = await fetch("/api/mutations/todos", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(item),
			});
			const data = (await response.json()) as { txid: number };
			return { txid: data.txid };
		},
		onUpdate: async ({ transaction }) => {
			const mutation = transaction.mutations[0];
			const item = mutation?.modified as Todo;
			const response = await fetch(`/api/mutations/todos/${item.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(item),
			});
			const data = (await response.json()) as { txid: number };
			return { txid: data.txid };
		},
		onDelete: async ({ transaction }) => {
			const mutation = transaction.mutations[0];
			const item = mutation?.original as Todo;
			const response = await fetch(`/api/mutations/todos/${item.id}`, {
				method: "DELETE",
			});
			const data = (await response.json()) as { txid: number };
			return { txid: data.txid };
		},
	}),
);
