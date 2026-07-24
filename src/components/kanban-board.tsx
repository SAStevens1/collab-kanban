"use client";

import { useMemo, useState } from "react";
import { useMutation, useStorage } from "@liveblocks/react";
import { COLUMNS, type CardData, type ColumnId } from "@/types/kanban";

function Card({ card }: { card: CardData }) {
  return (
    <div className="rounded-md border border-black/[.08] bg-white p-3 shadow-sm dark:border-white/[.145] dark:bg-zinc-900">
      <p className="text-sm font-medium text-black dark:text-zinc-50">
        {card.title}
      </p>
      {card.description && (
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {card.description}
        </p>
      )}
    </div>
  );
}

function AddCardForm({ onAdd }: { onAdd: (title: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-md px-2 py-1 text-left text-sm text-zinc-500 hover:bg-black/[.04] dark:text-zinc-400 dark:hover:bg-white/[.06]"
      >
        + Add card
      </button>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const trimmed = title.trim();
        if (trimmed) {
          onAdd(trimmed);
        }
        setTitle("");
        setIsOpen(false);
      }}
      className="flex flex-col gap-2"
    >
      <textarea
        autoFocus
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setIsOpen(false);
            setTitle("");
          }
        }}
        placeholder="Card title"
        rows={2}
        className="resize-none rounded-md border border-black/[.08] bg-white p-2 text-sm text-black outline-none focus:border-black/[.2] dark:border-white/[.145] dark:bg-zinc-900 dark:text-zinc-50"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-md bg-foreground px-3 py-1 text-xs font-medium text-background"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setTitle("");
          }}
          className="rounded-md px-3 py-1 text-xs text-zinc-500 dark:text-zinc-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Column({
  id,
  title,
  cards,
  onAddCard,
}: {
  id: ColumnId;
  title: string;
  cards: CardData[];
  onAddCard: (columnId: ColumnId, title: string) => void;
}) {
  return (
    <div className="flex w-72 shrink-0 flex-col gap-3 rounded-lg bg-zinc-100 p-3 dark:bg-zinc-900/50">
      <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        {title}{" "}
        <span className="text-zinc-400 dark:text-zinc-500">
          {cards.length}
        </span>
      </h2>
      <div className="flex flex-col gap-2">
        {cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
      <AddCardForm onAdd={(cardTitle) => onAddCard(id, cardTitle)} />
    </div>
  );
}

export function KanbanBoard() {
  const cards = useStorage((root) => root.cards);

  const cardsByColumn = useMemo(() => {
    const result: Record<ColumnId, CardData[]> = {
      todo: [],
      "in-progress": [],
      done: [],
    };
    if (cards) {
      for (const card of Object.values(cards)) {
        result[card.columnId].push(card);
      }
    }
    return result;
  }, [cards]);

  const addCard = useMutation(
    ({ storage }, columnId: ColumnId, title: string) => {
      const id = crypto.randomUUID();
      storage.get("cards").set(id, { id, columnId, title, description: "" });
    },
    [],
  );

  if (cards === null) {
    return (
      <div className="p-6 text-sm text-zinc-500 dark:text-zinc-400">
        Loading board…
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto p-6">
      {COLUMNS.map((column) => (
        <Column
          key={column.id}
          id={column.id}
          title={column.title}
          cards={cardsByColumn[column.id]}
          onAddCard={addCard}
        />
      ))}
    </div>
  );
}
