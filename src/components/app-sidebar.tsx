
"use client";

import * as React from "react";
import {
  BookOpenCheck,
  BrainCircuit,
  MessagesSquare,
  Scale,
  Search,
  BookText
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Skill =
  | "fiqh-comparison"
  | "summarization"
  | "concept-extraction"
  | "shamela-guidance";

const skills: { id: Skill; name: string; icon: React.ElementType }[] = [
  { id: "summarization", name: "Summarization", icon: BookText },
  { id: "fiqh-comparison", name: "Fiqh Comparison", icon: Scale },
  { id: "concept-extraction", name: "Concept Extraction", icon: BrainCircuit },
  { id: "shamela-guidance", name: "Shamela Guidance", icon: Search },
];

interface AppSidebarProps {
  activeSkill: Skill;
  setActiveSkill: (skill: Skill) => void;
}

export function AppSidebar({ activeSkill, setActiveSkill }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <BookOpenCheck className="w-8 h-8 text-primary" />
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold tracking-tight font-headline">
              Mualim AI
            </h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-xs text-muted-foreground hover:text-foreground transition-colors text-left">
                  by Mir Mohmmad Luqman
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <a href="https://mirmohmmadluqman.netlify.app/" target="_blank" rel="noopener noreferrer">
                    Portfolio
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="https://github.com/mirmohmmadluqman" target="_blank" rel="noopener noreferrer">
                    Github
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="https://twitter.com/mirmohmmadluqman" target="_blank" rel="noopener noreferrer">
                    X/Twitter
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {skills.map((skill) => (
            <SidebarMenuItem key={skill.id}>
              <SidebarMenuButton
                onClick={() => setActiveSkill(skill.id)}
                isActive={activeSkill === skill.id}
                tooltip={{ children: skill.name, side: "right" }}
              >
                <skill.icon />
                <span>{skill.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
    </Sidebar>
  );
}
