"use client";

import React, { ReactNode, useState } from "react";
import {
  CalendarCheck,
  Dice6,
  NotebookPen,
  Search,
  User,
  Users,
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import KanbanBoard from "../KanbanBoard";
import { ModeToggle } from "../ModeToggle";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface Tab {
  id: number;
  label: string;
  icon: ReactNode;
}

const tabs: Tab[] = [
  {
    id: generateId(),
    label: "Board",
    icon: <Dice6 />,
  },
  {
    id: generateId(),
    label: "Manage",
    icon: <User />,
  },
  {
    id: generateId(),
    label: "Schedule",
    icon: <CalendarCheck />,
  },
  {
    id: generateId(),
    label: "Reports",
    icon: <NotebookPen />,
  },
];

const DashboardLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex h-screen">
      <div className="border-r w-20 md:w-52">
        <div className="border-b px-4 py-5 text-center md:hidden">Wix B</div>
        <div className="border-b font-bold px-4 py-5 text-center hidden md:block">
          Wix Board
        </div>
        <nav className="flex flex-col gap-2">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={cn(
                "p-4 py-5 flex gap-2 items-center w-full justify-center md:justify-normal hover:text-primary transition-all",
                activeTab === index
                  ? "border-l-[5px] border-l-primary text-primary"
                  : ""
              )}
            >
              {tab.icon}
              <span className="hidden md:block">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="flex-grow flex flex-col h-screen w-[calc(100vw-5rem)] md:w-[calc(100vw-13rem)]">
        <div className="border-b px-4 py-[0.87rem] w-full flex gap-4">
          <div className="flex gap-1">
            <Input className="max-w-80" type="text" placeholder="Search..." />
            <Button variant="outline" size="icon">
              <Search strokeWidth={1} className="size-5" />
            </Button>
          </div>
          <ModeToggle />
        </div>

        <KanbanBoard />
      </div>
    </div>
  );
};

export default DashboardLayout;
