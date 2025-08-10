"use client";

import * as React from "react";
import { type Message, type Skill, type Language } from "@/app/page";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { ChatHeader } from "./chat-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type AIModel } from "@/app/actions";

interface ChatViewProps {
  messages: Message[];
  isLoading: boolean;
  activeSkill: Skill;
  language: Language;
  setLanguage: (lang: Language) => void;
  onSendMessage: (input: {
    single?: string;
    topic?: string;
    sources?: string;
  }) => Promise<void>;
  activeModel: AIModel;
  setActiveModel: (model: AIModel) => void;
  onExportChat: () => void;
}

export function ChatView({
  messages,
  isLoading,
  activeSkill,
  language,
  setLanguage,
  onSendMessage,
  activeModel,
  setActiveModel,
  onExportChat
}: ChatViewProps) {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full bg-muted/50 dark:bg-card">
      <ChatHeader language={language} setLanguage={setLanguage} activeModel={activeModel} setActiveModel={setActiveModel} onExportChat={onExportChat} />
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && <ChatMessage isLoading />}
          </div>
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-background">
        <ChatInput
          activeSkill={activeSkill}
          onSendMessage={onSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
