"use client";

import * as React from "react";
import { Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarTrigger } from "../ui/sidebar";
import { type AIModel } from "@/app/actions";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ChatHeaderProps {
  language: "Urdu" | "English";
  setLanguage: (lang: "Urdu" | "English") => void;
  activeModel: AIModel;
  setActiveModel: (model: AIModel) => void;
  onExportChat: () => void;
}

export function ChatHeader({ language, setLanguage, activeModel, setActiveModel, onExportChat }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-background">
      <div className="flex items-center gap-2">
         <SidebarTrigger className="md:hidden"/>
        <h1 className="text-xl font-bold font-headline">Mualim AI Chat</h1>
      </div>
      <div className="flex items-center gap-4">
        <Select
          value={activeModel}
          onValueChange={(value: AIModel) => setActiveModel(value)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gemini">2.0 Flash (Gemini)</SelectItem>
            <SelectItem value="openai">OAI 3 (OpenAI)</SelectItem>
          </SelectContent>
        </Select>
        <Separator orientation="vertical" className="h-6"/>
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
        <Separator orientation="vertical" className="h-6"/>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onExportChat}>
                <Download className="w-5 h-5" />
                <span className="sr-only">Export Chat</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export Chat</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
}
