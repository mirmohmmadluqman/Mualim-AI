"use client";

import * as React from "react";
import { v4 as uuidv4 } from "uuid";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar, type Skill } from "@/components/app-sidebar";
import { ChatView } from "@/components/chat/chat-view";
import { getAiResponse } from "./actions";
import { useToast } from "@/hooks/use-toast";

export type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  type?: "fiqh-comparison-input";
};

type FiqhComparisonState = {
  stage: "awaiting-topic" | "awaiting-sources";
  topic: string;
};

const initialMessages: Message[] = [
  {
    id: uuidv4(),
    role: "ai",
    content:
      "As-salamu alaykum! I'm Sheikh AI al-GPT, a customized AI designed to provide Islamic knowledge grounded in the Salafi methodology. How can I assist you today?",
  },
  {
    id: uuidv4(),
    role: "ai",
    content:
      "You can select one of my special skills from the sidebar to begin. I can help with:\n\n- **Summarization**: Give me a text, and I'll provide a concise summary.\n- **Fiqh Comparisons**: Let's compare rulings from different scholars.\n- **Concept Extraction**: I can identify core themes from a book or chapter.\n- **Shamela Search Guidance**: I can guide you to find what you need in Shamela's digital library.",
  },
];

export default function Home() {
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [activeSkill, setActiveSkill] = React.useState<Skill>("summarization");
  const [isLoading, setIsLoading] = React.useState(false);
  const [language, setLanguage] = React.useState<"Urdu" | "English">("Urdu");
  const [fiqhState, setFiqhState] = React.useState<FiqhComparisonState | null>(
    null
  );
  const { toast } = useToast();

  const addMessage = (role: "user" | "ai", content: string, type?: Message['type']) => {
    setMessages((prev) => [...prev, { id: uuidv4(), role, content, type }]);
  };

  const handleSendMessage = async (input: {
    single?: string;
    topic?: string;
    sources?: string;
  }) => {
    setIsLoading(true);

    if (activeSkill === "fiqh-comparison") {
      const topic = input.topic!;
      const sources = input.sources!;
      const userInputContent = `Topic: ${topic}\nSources: ${sources}`;
      addMessage("user", userInputContent, "fiqh-comparison-input");

      try {
        const result = await getAiResponse(
          activeSkill,
          { topic, sources },
          language
        );
        addMessage("ai", result.content);
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "An error occurred",
          description: "Failed to get a response from the AI.",
        });
      }
    } else {
      const userInputContent = input.single!;
      addMessage("user", userInputContent);

      try {
        const result = await getAiResponse(
          activeSkill,
          { text: userInputContent, query: userInputContent },
          language
        );
        addMessage("ai", result.content);
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "An error occurred",
          description: "Failed to get a response from the AI.",
        });
      }
    }

    setIsLoading(false);
  };

  React.useEffect(() => {
    // When the skill changes, reset any multi-step conversation state.
    setFiqhState(null);
  }, [activeSkill]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <AppSidebar activeSkill={activeSkill} setActiveSkill={setActiveSkill} />
        <main className="flex-1 flex flex-col h-screen">
          <ChatView
            messages={messages}
            isLoading={isLoading}
            activeSkill={activeSkill}
            language={language}
            setLanguage={setLanguage}
            onSendMessage={handleSendMessage}
          />
        </main>
      </div>
    </SidebarProvider>
  );
}
