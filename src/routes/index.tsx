import {
	Badge,
	Button,
	Card,
	Checkbox,
	Container,
	Flex,
	Heading,
	IconButton,
	Select,
	Separator,
	Text,
	TextField,
} from "@radix-ui/themes";
import { useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import { ListTodo, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { ClientOnly } from "@/components/ClientOnly";
import { todosCollection } from "@/db/collections/todos";

export const Route = createFileRoute("/")({
	ssr: false,
	component: TodoPage,
});

type Filter = "all" | "active" | "completed";
type Priority = "low" | "medium" | "high";

const PRIORITY_COLORS: Record<Priority, "green" | "yellow" | "red"> = {
	low: "green",
	medium: "yellow",
	high: "red",
};

function TodoPage() {
	return (
		<ClientOnly>
			<TodoApp />
		</ClientOnly>
	);
}

function TodoApp() {
	const [filter, setFilter] = useState<Filter>("all");
	const [newTitle, setNewTitle] = useState("");
	const [newPriority, setNewPriority] = useState<Priority>("medium");
	const [newDueDate, setNewDueDate] = useState("");

	const { data: todos, isLoading } = useLiveQuery((q) =>
		q
			.from({ todo: todosCollection })
			.orderBy(({ todo }) => todo.created_at, "desc"),
	);

	const filteredTodos = todos?.filter((todo) => {
		if (filter === "active") return !todo.completed;
		if (filter === "completed") return todo.completed;
		return true;
	});

	const activeTodos = todos?.filter((t) => !t.completed) ?? [];
	const completedCount = (todos?.length ?? 0) - activeTodos.length;

	const handleAddTodo = () => {
		const title = newTitle.trim();
		if (!title) return;
		todosCollection.insert({
			id: crypto.randomUUID(),
			title,
			description: null,
			completed: false,
			priority: newPriority,
			due_date: newDueDate ? new Date(newDueDate) : null,
			created_at: new Date(),
			updated_at: new Date(),
		});
		setNewTitle("");
		setNewDueDate("");
	};

	const handleToggle = (id: string, completed: boolean) => {
		todosCollection.update(id, (draft) => {
			draft.completed = !completed;
			draft.updated_at = new Date();
		});
	};

	const handleDelete = (id: string) => {
		todosCollection.delete(id);
	};

	const handleClearCompleted = () => {
		for (const todo of todos ?? []) {
			if (todo.completed) todosCollection.delete(todo.id);
		}
	};

	return (
		<Container size="2" py="6">
			<Flex direction="column" gap="5">
				{/* Header */}
				<Flex align="center" gap="2">
					<ListTodo size={28} style={{ color: "var(--violet-9)" }} />
					<Heading size="7">My Todos</Heading>
				</Flex>

				{/* Add Todo Form */}
				<Card>
					<Flex direction="column" gap="3">
						<TextField.Root
							placeholder="What needs to be done?"
							value={newTitle}
							onChange={(e) => setNewTitle(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
							size="3"
						/>
						<Flex gap="2" align="center">
							<Select.Root
								value={newPriority}
								onValueChange={(v) => setNewPriority(v as Priority)}
							>
								<Select.Trigger placeholder="Priority" style={{ flex: 1 }} />
								<Select.Content>
									<Select.Item value="low">Low Priority</Select.Item>
									<Select.Item value="medium">Medium Priority</Select.Item>
									<Select.Item value="high">High Priority</Select.Item>
								</Select.Content>
							</Select.Root>
							<input
								type="date"
								value={newDueDate}
								onChange={(e) => setNewDueDate(e.target.value)}
								style={{
									flex: 1,
									padding: "0 12px",
									height: "36px",
									borderRadius: "6px",
									border: "1px solid var(--gray-6)",
									background: "var(--color-surface)",
									color: "var(--gray-12)",
									fontSize: "14px",
								}}
							/>
							<Button onClick={handleAddTodo} disabled={!newTitle.trim()}>
								<Plus size={16} />
								Add
							</Button>
						</Flex>
					</Flex>
				</Card>

				{/* Stats */}
				{todos && todos.length > 0 && (
					<Flex justify="between" align="center">
						<Text size="2" color="gray">
							{activeTodos.length} task{activeTodos.length !== 1 ? "s" : ""}{" "}
							remaining
						</Text>
						{completedCount > 0 && (
							<Button
								variant="ghost"
								size="1"
								color="gray"
								onClick={handleClearCompleted}
							>
								Clear completed ({completedCount})
							</Button>
						)}
					</Flex>
				)}

				{/* Filter Tabs */}
				<Flex gap="1">
					{(["all", "active", "completed"] as Filter[]).map((f) => (
						<Button
							key={f}
							variant={filter === f ? "solid" : "ghost"}
							size="2"
							onClick={() => setFilter(f)}
							style={{ textTransform: "capitalize" }}
						>
							{f}
						</Button>
					))}
				</Flex>

				{/* Todo List */}
				<Flex direction="column" gap="2">
					{isLoading && (
						<Text color="gray" align="center" py="4">
							Loading...
						</Text>
					)}

					{!isLoading && filteredTodos?.length === 0 && (
						<Card>
							<Text color="gray" align="center" size="2">
								{filter === "completed"
									? "No completed tasks yet."
									: filter === "active"
										? "No active tasks. You're all caught up!"
										: "Add your first task above."}
							</Text>
						</Card>
					)}

					{filteredTodos?.map((todo) => (
						<Card key={todo.id} style={{ opacity: todo.completed ? 0.65 : 1 }}>
							<Flex align="center" gap="3">
								<Checkbox
									size="2"
									checked={todo.completed}
									onCheckedChange={() => handleToggle(todo.id, todo.completed)}
								/>
								<Flex
									direction="column"
									gap="1"
									style={{ flex: 1, minWidth: 0 }}
								>
									<Text
										size="3"
										style={{
											textDecoration: todo.completed ? "line-through" : "none",
											wordBreak: "break-word",
										}}
									>
										{todo.title}
									</Text>
									<Flex gap="2" align="center" wrap="wrap">
										<Badge
											color={
												PRIORITY_COLORS[todo.priority as Priority] ?? "gray"
											}
											variant="soft"
											size="1"
										>
											{todo.priority}
										</Badge>
										{todo.due_date && (
											<Text size="1" color="gray">
												Due:{" "}
												{new Date(todo.due_date).toLocaleDateString(undefined, {
													month: "short",
													day: "numeric",
												})}
											</Text>
										)}
									</Flex>
								</Flex>
								<IconButton
									variant="ghost"
									color="red"
									size="2"
									onClick={() => handleDelete(todo.id)}
								>
									<Trash2 size={14} />
								</IconButton>
							</Flex>
						</Card>
					))}
				</Flex>

				{todos && todos.length > 0 && (
					<>
						<Separator size="4" />
						<Text size="1" color="gray" align="center">
							{todos.length} total task{todos.length !== 1 ? "s" : ""}
						</Text>
					</>
				)}
			</Flex>
		</Container>
	);
}
