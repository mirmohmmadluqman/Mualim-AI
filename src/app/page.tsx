"use client";

import * as React from "react";
import { v4 as uuidv4 } from "uuid";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ChatView } from "@/components/chat/chat-view";
import { getAiResponse, type AIModel } from "./actions";
import { useToast } from "@/hooks/use-toast";

export type Skill =
  | "fiqh-comparison"
  | "summarization"
  | "concept-extraction"
  | "shamela-guidance";

export type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  type?: "fiqh-comparison-input";
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
  const [activeModel, setActiveModel] = React.useState<AIModel>("gemini");
  
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

    let userInput = {};
    let userInputContent = "";

    if (activeSkill === "fiqh-comparison") {
      const topic = input.topic!;
      const sources = input.sources!;
      userInput = { topic, sources };
      userInputContent = `Topic: ${topic}\nSources: ${sources}`;
      addMessage("user", userInputContent, "fiqh-comparison-input");
    } else {
      userInputContent = input.single!;
      userInput = { text: userInputContent, query: userInputContent };
      addMessage("user", userInputContent);
    }
    
    if (activeModel === 'openai') {
        toast({
            title: "Under Development",
            description: "The OpenAI model is currently under development. Please use Gemini 2.0 Flash."
        });
        setIsLoading(false);
        return;
    }

    try {
      const result = await getAiResponse(
        activeModel,
        activeSkill,
        userInput,
        language
      );
      addMessage("ai", result.content);
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Failed to get a response from the AI.";
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: errorMessage,
      });
      // Optionally add an error message to the chat
      addMessage("ai", `Sorry, an error occurred: ${errorMessage}`);
    }


    setIsLoading(false);
  };

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
            activeModel={activeModel}
            setActiveModel={setActiveModel}
          />
        </main>
      </div>
    </SidebarProvider>
  );
}
