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

export type Language = 
  | "Recommended" 
  | "English" 
  | "Urdu" 
  | "Arabic"
  | "Bengali"
  | "French"
  | "German"
  | "Hindi"
  | "Indonesian"
  | "Malay"
  | "Russian"
  | "Spanish"
  | "Turkish";


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
    content: `A message from developer to you

السلام عليكم ورحمة الله وبركاته

I'm Mualim AI designed to provide Islamic knowledge grounded in the Salafi methodology. How can I assist you today?
---`,
  }
];

const CHAT_STORAGE_KEY = "mualim-ai-chat";

export default function Home() {
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [activeSkill, setActiveSkill] = React.useState<Skill>("summarization");
  const [isLoading, setIsLoading] = React.useState(false);
  const [language, setLanguage] = React.useState<Language>("Recommended");
  const [activeModel, setActiveModel] = React.useState<AIModel>("gemini");
  
  const { toast } = useToast();

  React.useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
      if (savedMessages && JSON.parse(savedMessages).length > 0) {
        setMessages(JSON.parse(savedMessages));
      } else {
        setMessages(initialMessages);
      }
    } catch (error) {
      console.error("Failed to load messages from local storage", error);
      setMessages(initialMessages);
    }
  }, []);

  React.useEffect(() => {
    try {
      // Don't save the initial message to local storage
      if (messages.length > 1 || (messages.length === 1 && messages[0].id !== initialMessages[0].id)) {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
      }
    } catch (error) {
      console.error("Failed to save messages to local storage", error);
    }
  }, [messages]);


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
      addMessage("ai", `Sorry, an error occurred: ${errorMessage}`);
    }


    setIsLoading(false);
  };

  const exportChat = () => {
    const chatContent = messages.map(m => `[${m.role.toUpperCase()}]\n${m.content}`).join('\n\n---\n\n');
    const blob = new Blob([chatContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mualim-ai-chat-${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
     toast({
      title: "Chat Exported",
      description: "Your conversation has been downloaded as a text file.",
    });
  }

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
            onExportChat={exportChat}
          />
        </main>
      </div>
    </SidebarProvider>
  );
}
