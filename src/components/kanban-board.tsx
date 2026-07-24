"use client";

import { useMemo, useState } from "react";
import { useMutation, useStorage } from "@liveblocks/react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { COLUMNS, type CardData, type ColumnId } from "@/types/kanban";

function CardVisual({ card }: { card: CardData }) {
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

function SortableCard({
  card,
  onDelete,
}: {
  card: CardData;
  onDelete: (cardId: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group relative cursor-grab touch-none active:cursor-grabbing"
    >
      <CardVisual card={card} />
      <button
        type="button"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={() => onDelete(card.id)}
        aria-label="Delete card"
        className="absolute right-1 top-1 hidden rounded p-1 text-zinc-400 hover:bg-black/[.06] hover:text-zinc-700 group-hover:block dark:hover:bg-white/[.1] dark:hover:text-zinc-200"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
        </svg>
      </button>
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
  onDeleteCard,
}: {
  id: ColumnId;
  title: string;
  cards: CardData[];
  onAddCard: (columnId: ColumnId, title: string) => void;
  onDeleteCard: (cardId: string) => void;
}) {
  const { setNodeRef } = useDroppable({ id });
  const cardIds = useMemo(() => cards.map((card) => card.id), [cards]);

  return (
    <div className="flex w-72 shrink-0 flex-col gap-3 rounded-lg bg-zinc-100 p-3 dark:bg-zinc-900/50">
      <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        {title}{" "}
        <span className="text-zinc-400 dark:text-zinc-500">
          {cards.length}
        </span>
      </h2>
      <div ref={setNodeRef} className="flex min-h-10 flex-col gap-2">
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {cards.length === 0 ? (
            <p className="rounded-md border border-dashed border-black/[.08] p-3 text-center text-xs text-zinc-400 dark:border-white/[.145] dark:text-zinc-500">
              No cards yet
            </p>
          ) : (
            cards.map((card) => (
              <SortableCard key={card.id} card={card} onDelete={onDeleteCard} />
            ))
          )}
        </SortableContext>
      </div>
      <AddCardForm onAdd={(cardTitle) => onAddCard(id, cardTitle)} />
    </div>
  );
}

export function KanbanBoard() {
  const cards = useStorage((root) => root.cards);
  const [activeCard, setActiveCard] = useState<CardData | null>(null);

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
      for (const columnId of Object.keys(result) as ColumnId[]) {
        result[columnId].sort((a, b) => a.order - b.order);
      }
    }
    return result;
  }, [cards]);

  const addCard = useMutation(
    ({ storage }, columnId: ColumnId, title: string) => {
      const id = crypto.randomUUID();
      storage
        .get("cards")
        .set(id, { id, columnId, title, description: "", order: Date.now() });
    },
    [],
  );

  const deleteCard = useMutation(({ storage }, cardId: string) => {
    storage.get("cards").delete(cardId);
  }, []);

  const moveCard = useMutation(
    ({ storage }, cardId: string, columnId: ColumnId, order: number) => {
      const cardsMap = storage.get("cards");
      const card = cardsMap.get(cardId);
      if (!card) return;
      cardsMap.set(cardId, { ...card, columnId, order });
    },
    [],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  function handleDragStart(event: DragStartEvent) {
    const card = cards?.[String(event.active.id)];
    setActiveCard(card ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveCard(null);
    const { active, over } = event;
    if (!over || !cards) return;

    const activeCardData = cards[String(active.id)];
    if (!activeCardData) return;

    const overIsColumn = COLUMNS.some((column) => column.id === over.id);
    const targetColumnId: ColumnId = overIsColumn
      ? (over.id as ColumnId)
      : (cards[String(over.id)]?.columnId ?? activeCardData.columnId);

    const targetCards = cardsByColumn[targetColumnId].filter(
      (card) => card.id !== activeCardData.id,
    );

    let newOrder: number;
    if (overIsColumn || targetCards.length === 0) {
      newOrder =
        targetCards.length > 0
          ? targetCards[targetCards.length - 1].order + 1
          : Date.now();
    } else {
      const overIndex = targetCards.findIndex((card) => card.id === over.id);
      if (overIndex === -1) {
        newOrder = targetCards[targetCards.length - 1].order + 1;
      } else {
        const before = targetCards[overIndex - 1];
        const afterCard = targetCards[overIndex];
        newOrder = before ? (before.order + afterCard.order) / 2 : afterCard.order - 1;
      }
    }

    if (
      targetColumnId !== activeCardData.columnId ||
      newOrder !== activeCardData.order
    ) {
      moveCard(activeCardData.id, targetColumnId, newOrder);
    }
  }

  if (cards === null) {
    return (
      <div className="p-6 text-sm text-zinc-500 dark:text-zinc-400">
        Loading board…
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto p-6">
        {COLUMNS.map((column) => (
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            cards={cardsByColumn[column.id]}
            onAddCard={addCard}
            onDeleteCard={deleteCard}
          />
        ))}
      </div>
      <DragOverlay>
        {activeCard ? (
          <div className="rotate-2 opacity-90">
            <CardVisual card={activeCard} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
