import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { generateTxId, parseDates } from "@/db/utils";

export const Route = createFileRoute("/api/mutations/todos/$id")({
	server: {
		handlers: {
			PUT: async ({
				request,
				params,
			}: {
				request: Request;
				params: { id: string };
			}) => {
				const body = parseDates(await request.json());
				const result = await db.transaction(async (tx) => {
					const txid = await generateTxId(tx);
					await tx.update(todos).set(body).where(eq(todos.id, params.id));
					return { txid };
				});
				return Response.json(result);
			},
			DELETE: async ({ params }: { params: { id: string } }) => {
				const result = await db.transaction(async (tx) => {
					const txid = await generateTxId(tx);
					await tx.delete(todos).where(eq(todos.id, params.id));
					return { txid };
				});
				return Response.json(result);
			},
		},
	},
});
