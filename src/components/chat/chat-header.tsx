"use client";

import * as React from "react";
import { Download, Moon, Settings, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "../ui/sidebar";
import { type AIModel } from "@/app/actions";
import { type Language } from "@/app/page";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatHeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  activeModel: AIModel;
  setActiveModel: (model: AIModel) => void;
  onExportChat: () => void;
}

const languages: {value: Language, label: string}[] = [
    { value: "Recommended", label: "Recommended" },
    { value: "English", label: "English" },
    { value: "Urdu", label: "Urdu" },
    { value: "Arabic", label: "Arabic (العربية)" },
    { value: "Bengali", label: "Bengali (বাংলা)" },
    { value: "French", label: "French (Français)" },
    { value: "German", label: "German (Deutsch)" },
    { value: "Hindi", label: "Hindi (हिन्दी)" },
    { value: "Indonesian", label: "Indonesian (Bahasa Indonesia)" },
    { value: "Malay", label: "Malay (Bahasa Melayu)" },
    { value: "Russian", label: "Russian (Русский)" },
    { value: "Spanish", label: "Spanish (Español)" },
    { value: "Turkish", label: "Turkish (Türkçe)" },
]

export function ChatHeader({
  language,
  setLanguage,
  activeModel,
  setActiveModel,
  onExportChat,
}: ChatHeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="flex items-center justify-between p-4 border-b bg-background">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
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

        <Separator orientation="vertical" className="h-6" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
              <span className="sr-only">Settings</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => setTheme("light")}
              disabled={theme === "light"}
            >
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("dark")}
              disabled={theme === "dark"}
            >
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Language</DropdownMenuLabel>
            <Select
              value={language}
              onValueChange={(value: Language) => setLanguage(value)}
            >
              <SelectTrigger className="w-[180px] mx-2">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map(lang => (
                    <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6" />

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
