export type ColumnId = "todo" | "in-progress" | "done";

export type CardData = {
  id: string;
  columnId: ColumnId;
  title: string;
  description: string;
  order: number;
};

export const COLUMNS: { id: ColumnId; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" },
];
