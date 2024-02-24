import { useState, useMemo, FC } from "react";
import { Check, ListPlus, Move, SquarePen, Trash2 } from "lucide-react";
import { Column, Id, Task } from "../types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardTitle } from "@/components/ui/card";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id, content: string, priority: string) => void;
  updateTask: (id: Id, content: string, priority: string) => void;
  deleteTask: (id: Id) => void;
  tasks: Task[];
}

const ColumnContainer: FC<Props> = ({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  tasks,
  deleteTask,
  updateTask,
}) => {
  const [edit, setEdit] = useState(false);
  const [taskEditForms, setTaskEditForms] = useState<Id[]>([]);
  const [columnTitle, setColumnTitle] = useState(column.title);

  const tasksId = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: edit,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return <Card ref={setNodeRef} style={style} className="w-[350px] h-full" />;
  }
// console.log("foooo")

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="w-[350px] h-full flex flex-col"
    >
      <Card className="p-2 font-bold rounded-t-xl rounded-b-none flex items-center justify-between gap-2 mb-1">
        <Button
          {...attributes}
          {...listeners}
          className="cursor-grab"
          variant="ghost"
          size="icon"
        >
          <Move strokeWidth={1} className="size-5" />
        </Button>
        {edit ? (
          <>
            <Input
              onChange={(e) => setColumnTitle(e.target.value)}
              value={columnTitle}
              type="text"
              placeholder="Edit..."
            />

            <Button
              onClick={() => {
                updateColumn(column.id, columnTitle);
                setEdit(false);
              }}
              variant="outline"
              size="icon"
            >
              <Check strokeWidth={1} className="size-5" />
            </Button>
          </>
        ) : (
          <>
            <CardTitle className="truncate">{column.title}</CardTitle>
            <div className="flex">
              <Button onClick={() => setEdit(true)} variant="ghost" size="icon">
                <SquarePen strokeWidth={1} className="size-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteColumn(column.id)}
              >
                <Trash2 strokeWidth={1} className="size-5" />
              </Button>
            </div>
          </>
        )}
      </Card>
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksId}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
          {taskEditForms.includes(column.id) && (
            <TaskForm
              addTask={(content, priority) => {
                createTask(column.id, content, priority);

                setTaskEditForms((prev) =>
                  prev.filter((id) => id !== column.id)
                );
              }}
              onTaskEditMode={() =>
                setTaskEditForms((prev) =>
                  prev.filter((id) => id !== column.id)
                )
              }
            />
          )}
        </SortableContext>
      </div>
      <Button
        variant="secondary"
        disabled={taskEditForms.includes(column.id)}
        onClick={() => {
          setTaskEditForms((prev) => [...prev, column.id]);
        }}
        className="py-6 rounded-t-none rounded-b-xl"
      >
        <ListPlus className="mr-2" />
        Add task
      </Button>
    </Card>
  );
};

export default ColumnContainer;
