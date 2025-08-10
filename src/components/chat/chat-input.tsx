"use client";

import * as React from "react";
import { Mic, SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { type Skill } from "@/app/page";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


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
  const [isListening, setIsListening] = React.useState(false);
  const recognitionRef = React.useRef<any>(null);
  const { toast } = useToast();

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
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSingleInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        toast({
            variant: "destructive",
            title: "Speech Recognition Error",
            description: event.error === 'not-allowed' 
                ? "Microphone access was denied. Please allow microphone access in your browser settings."
                : `An error occurred: ${event.error}`
        });
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

    }
  }, [toast]);

  const handleMicClick = () => {
    if (!recognitionRef.current) {
         toast({
            variant: "destructive",
            title: "Browser Not Supported",
            description: "Your browser does not support speech recognition.",
        });
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
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
        <div className="relative flex items-end gap-2">
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
            className="pr-12 min-h-[48px] max-h-48 resize-none"
            rows={1}
            disabled={isLoading}
          />
          <div className="flex gap-1">
             <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            type="button"
                            size="icon"
                            variant={isListening ? "destructive" : "ghost"}
                            className="w-8 h-8"
                            onClick={handleMicClick}
                            disabled={isLoading}
                        >
                            <Mic className="w-5 h-5" />
                            <span className="sr-only">Use Microphone</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{isListening ? "Stop listening" : "Use Microphone"}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Button
                type="submit"
                size="icon"
                className="w-8 h-8"
                disabled={isLoading || !singleInput}
            >
                <SendHorizonal className="w-5 h-5" />
                <span className="sr-only">Send Message</span>
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
