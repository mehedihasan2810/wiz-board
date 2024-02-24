import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FC, useState } from "react";
import { Paperclip, X } from "lucide-react";
import { Task } from "@/types";
import { Card } from "./ui/card";

const priorityData = [
  {
    id: 1,
    label: "High",
  },
  {
    id: 2,
    label: "Med",
  },
  {
    id: 3,
    label: "Low",
  },
];

interface Props {
  content?: string;
  priority?: string;
  addTask: (content: string, priority: string) => void;
  onTaskEditMode: () => void;
}

const TaskForm: FC<Props> = ({
  content,
  priority: taskPriority,
  addTask,
  onTaskEditMode,
}) => {
  const [taskContent, setTaskContent] = useState(content || "");
  const [priority, setPriority] = useState(taskPriority || "high");

  return (
    <Card className="p-3 flex flex-col gap-4">
      <div className="flex justify-between">
        <div>
          <div className="mb-1 font-semibold">Priority:</div>
          <div className="flex gap-2">
            {priorityData.map((data) => (
              <Button
                variant={
                  priority === data.label.toLocaleLowerCase()
                    ? "default"
                    : "outline"
                }
                className="py-1 h-min px-3"
                onClick={() => setPriority(data.label.toLocaleLowerCase())}
                key={data.id}
              >
                {data.label}
              </Button>
            ))}
          </div>
        </div>
        <Button onClick={onTaskEditMode} variant="ghost" size="icon">
          <X strokeWidth={1} className="size-5" />
        </Button>
      </div>
      <Textarea
        value={taskContent}
        placeholder="Task content here..."
        onChange={(e) => setTaskContent(e.target.value)}
      />

      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Avatar className="size-5">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <Button variant="ghost" size="icon">
            <Paperclip strokeWidth={1} className="size-4" />
          </Button>
        </div>
        <Button
          className="py-1 h-min px-3"
          variant="secondary"
          onClick={() => {
            addTask(taskContent, priority);
          }}
        >
          Add
        </Button>
      </div>
    </Card>
  );
};

export default TaskForm;
