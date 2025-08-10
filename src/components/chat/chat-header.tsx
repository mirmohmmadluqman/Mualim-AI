"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarTrigger } from "../ui/sidebar";

interface ChatHeaderProps {
  language: "Urdu" | "English";
  setLanguage: (lang: "Urdu" | "English") => void;
}

export function ChatHeader({ language, setLanguage }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-background">
      <div className="flex items-center gap-2">
         <SidebarTrigger className="md:hidden"/>
        <h1 className="text-xl font-bold font-headline">Mualim AI Chat</h1>
      </div>
      <div>
        <Select
          value={language}
          onValueChange={(value: "Urdu" | "English") => setLanguage(value)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Urdu">Urdu</SelectItem>
            <SelectItem value="English">English</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}
