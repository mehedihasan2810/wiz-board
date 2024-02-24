import { useState } from "react";
import { Id, Task } from "../types";
import { MessageSquareText, Paperclip, SquarePen, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import TaskForm from "./TaskForm";
import { Card, CardDescription } from "@/components/ui/card";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string, priority: string) => void;
}

function TaskCard({ task, deleteTask, updateTask }: Props) {
  const [isTaskEditMode, setIsTaskEditMode] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    // disabled: isTaskEditMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return <Card ref={setNodeRef} style={style} className="h-32 cursor-grab" />;
  }

  if (isTaskEditMode) {
    return (
      <TaskForm
        content={task.content}
        priority={task.priority}
        addTask={(content, priority) => {
          updateTask(task.id, content, priority);
          setIsTaskEditMode(false);
        }}
        onTaskEditMode={() => setIsTaskEditMode(false)}
      />
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-3 shadow max-h-52 cursor-grab flex flex-col gap-3 border bg-background/40"
    >
      <div className="flex justify-between">
        <Badge className="h-min">
          {task.priority.slice(0, 1).toLocaleUpperCase() +
            task.priority.slice(1)}{" "}
          Priority
        </Badge>
        <Avatar className="size-7">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <CardDescription className="overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {task.content}
      </CardDescription>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Paperclip strokeWidth={1} className="size-4" />
            <span>1</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquareText strokeWidth={1} className="size-4" />
            <span>2</span>
          </div>
        </div>

        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsTaskEditMode(true)}
          >
            <SquarePen strokeWidth={1} className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              deleteTask(task.id);
            }}
          >
            <Trash2 strokeWidth={1} className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default TaskCard;
