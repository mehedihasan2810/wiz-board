import { useEffect, useMemo, useState } from "react";
import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import { PlusCircle } from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import { generateId } from "@/lib/utils";
import { Button } from "./ui/button";

function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([
    { id: 1, title: "Todo" },
    { id: 2, title: "In Progress" },
    { id: 3, title: "Completed" },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 213412341234123,
      columnId: 1,
      content: "This task is marked as high priority so complete it ASAP",
      priority: "high",
    },
    {
      id: 4673463534456546,
      columnId: 2,
      content:
        "in repellat magnam ab tenetur amet est repellendus dolores dignissimos!",
      priority: "med",
    },
    {
      id: 4673463523452134,
      columnId: 1,
      content:
        "in repellat magnam ab tenetur amet est repellendus dolores dignissimos!",
      priority: "med",
    },
    {
      id: 4657865634456546,
      columnId: 3,
      content:
        "in repellat magnam ab tenetur amet est repellendus dolores dignissimos!",
      priority: "low",
    },
    {
      id: 1234512309482398,
      columnId: 1,
      content:
        "in repellat magnam ab tenetur amet est repellendus dolores dignissimos!  Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere esse explicabo aliquid! Odit et soluta vel officiis alias, distinctio rem.",
      priority: "low",
    },
    {
      id: 21341234523453415,
      columnId: 2,
      content: "This task is marked as high priority so complete it ASAP",
      priority: "high",
    },
  ]);

  useEffect(() => {
    if (localStorage.getItem("columns")) {
      setColumns(JSON.parse(localStorage.getItem("columns")!));
    } else {
      localStorage.setItem("columns", JSON.stringify(columns));
    }

    if (localStorage.getItem("tasks")) {
      setTasks(JSON.parse(localStorage.getItem("tasks")!));
    } else {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("columns", JSON.stringify(columns));
  }, [columns, tasks]);

  const columnsId = useMemo(
    () => columns.map((column) => column.id),
    [columns]
  );

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // 3px kadar hareket ettir
      },
    })
  );

  function createTask(columnId: Id, content: string, priority: string) {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content,
      priority,
    };

    setTasks([...tasks, newTask]);
  }

  function deleteTask(id: Id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  function updateTask(id: Id, content: string, priority: string) {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id !== id) return task;
        return { ...task, content, priority };
      })
    );
  }

  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  }

  function deleteColumn(id: Id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);

    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
  }

  function updateColumn(id: Id, title: string) {
    const newColumns = columns.map((column) => {
      if (column.id !== id) return column;
      return { ...column, title };
    });

    setColumns(newColumns);
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;
    if (active.data.current?.type === "Task") return;
    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (column) => column.id === activeColumnId
      );

      const overColumnIndex = columns.findIndex(
        (column) => column.id === overColumnId
      );

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        tasks[activeIndex].columnId = tasks[overIndex].columnId;

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverColumn = over.data.current?.type === "Column";

    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;

        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

  return (
    <div className="flex overflow-x-auto overflow-y-hidden h-full w-full px-6 py-4 mb-1">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="flex gap-4">
          <div className="flex gap-4 ">
            <SortableContext items={columnsId}>
              {columns.map((column) => (
                <ColumnContainer
                  key={column.id}
                  column={column}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === column.id)}
                />
              ))}
            </SortableContext>
          </div>
          <Button
            variant="secondary"
            onClick={() => createNewColumn()}
            className="w-[350px] min-w-[350px] px-3 flex items-center gap-2 rounded-lg border bg-card text-card-foreground shadow font-bold py-[1.6rem]"
          >
            <PlusCircle className="text-textColor" />
            Add Column
          </Button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}

export default KanbanBoard;
