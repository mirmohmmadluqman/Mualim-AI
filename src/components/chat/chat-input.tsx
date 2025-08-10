"use client";

import * as React from "react";
import { SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { type Skill } from "@/app/page";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface ChatInputProps {
  activeSkill: Skill;
  onSendMessage: (input: {
    single?: string;
    topic?: string;
    sources?: string;
  }) => Promise<void>;
  isLoading: boolean;
}

export function ChatInput({
  activeSkill,
  onSendMessage,
  isLoading,
}: ChatInputProps) {
  const [singleInput, setSingleInput] = React.useState("");
  const [topicInput, setTopicInput] = React.useState("");
  const [sourcesInput, setSourcesInput] = React.useState("");

  const singleInputRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    if (activeSkill === "fiqh-comparison") {
      if (topicInput.trim() && sourcesInput.trim()) {
        onSendMessage({ topic: topicInput, sources: sourcesInput });
        setTopicInput("");
        setSourcesInput("");
      }
    } else {
      if (singleInput.trim()) {
        onSendMessage({ single: singleInput });
        setSingleInput("");
      }
    }
  };

  React.useEffect(() => {
    if (singleInputRef.current) {
        singleInputRef.current.style.height = "auto";
        singleInputRef.current.style.height = `${singleInputRef.current.scrollHeight}px`;
    }
  }, [singleInput]);


  const placeholders: Record<Skill, string> = {
    summarization: "Paste the Islamic text you want to summarize...",
    "fiqh-comparison": "Enter topic and sources below.",
    "concept-extraction": "Paste the text to extract concepts from...",
    "shamela-guidance": "What information are you looking for in Shamela?",
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {activeSkill === "fiqh-comparison" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
            <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="topic">Topic</Label>
                <Input
                    id="topic"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    placeholder="e.g., Ruling on fasting while traveling"
                    disabled={isLoading}
                />
            </div>
            <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="sources">Sources</Label>
                <Input
                    id="sources"
                    value={sourcesInput}
                    onChange={(e) => setSourcesInput(e.target.value)}
                    placeholder="e.g., Hanafi, Shafi'i"
                    disabled={isLoading}
                />
            </div>
            <div className="flex items-end">
                <Button type="submit" disabled={isLoading || !topicInput || !sourcesInput} className="w-full">
                    <SendHorizonal className="w-5 h-5" />
                    <span className="sr-only">Send</span>
                </Button>
            </div>
        </div>
      ) : (
        <div className="relative">
          <Textarea
            ref={singleInputRef}
            value={singleInput}
            onChange={(e) => setSingleInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as any);
              }
            }}
            placeholder={placeholders[activeSkill]}
            className="pr-14 min-h-[48px] max-h-48 resize-none"
            rows={1}
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute w-8 h-8 bottom-2 right-2"
            disabled={isLoading || !singleInput}
          >
            <SendHorizonal className="w-5 h-5" />
            <span className="sr-only">Send Message</span>
          </Button>
        </div>
      )}
    </form>
  );
}
