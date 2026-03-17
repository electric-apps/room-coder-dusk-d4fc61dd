import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { generateTxId, parseDates } from "@/db/utils";

export const Route = createFileRoute("/api/mutations/todos")({
	server: {
		handlers: {
			POST: async ({ request }: { request: Request }) => {
				const body = parseDates(await request.json());
				const result = await db.transaction(async (tx) => {
					const txid = await generateTxId(tx);
					await tx.insert(todos).values(body);
					return { txid };
				});
				return Response.json(result);
			},
		},
	},
});
