"use client";

import { type Message } from "@/app/page";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatMessageProps {
  message?: Message;
  isLoading?: boolean;
}

function LoadingDots() {
    return (
        <div className="flex items-center justify-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-current animate-pulse [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 rounded-full bg-current animate-pulse [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
        </div>
    );
}

export function ChatMessage({ message, isLoading = false }: ChatMessageProps) {
  const isAIMessage = message?.role === "ai" || isLoading;

  const contentWithCitations = React.useMemo(() => {
    if (!message || isLoading) return "";
    const processedContent = message.content.replace(
      /(\(Qur'an[^)]*\))|(\(Hadith[^)]*\))|(\(Sahih Bukhari[^)]*\))|(\(Sahih Muslim[^)]*\))|(\(Shamela\.ws[^)]*\))|(\b(Hanafi|Shafi'i|Maliki|Hanbali)\b)/g,
      (match) =>
        `<span class="font-islamic bg-yellow-200/50 dark:bg-yellow-500/30 px-1.5 py-0.5 rounded-md inline-block whitespace-nowrap">${match}</span>`
    );
    return processedContent.replace(/\n/g, "<br />");
  }, [message, isLoading]);
  
  if (message?.type === 'fiqh-comparison-input' && message.role === 'user') {
    const [topicLine, sourcesLine] = message.content.split('\n');
    return (
       <div className="flex items-start justify-end gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex flex-col items-end gap-1">
          <div className="p-4 rounded-lg bg-primary/20 dark:bg-primary/10">
            <div className="font-semibold">{topicLine}</div>
            <div className="text-sm text-muted-foreground">{sourcesLine}</div>
          </div>
        </div>
        <Avatar className="w-8 h-8">
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500",
        !isAIMessage && "justify-end"
      )}
    >
      {isAIMessage && (
        <Avatar className="w-8 h-8">
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-xl p-4 rounded-lg",
          isAIMessage
            ? "bg-background shadow-sm"
            : "bg-primary/20 dark:bg-primary/10"
        )}
      >
        {isLoading ? (
          <LoadingDots />
        ) : (
          <p
            className="text-sm leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: contentWithCitations }}
          />
        )}
      </div>
      {!isAIMessage && (
        <Avatar className="w-8 h-8">
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
