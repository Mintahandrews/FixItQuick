import { format } from "date-fns";
import { Bot, User } from "lucide-react";

interface MessageProps {
  message: {
    role: "user" | "bot";
    content: string;
    timestamp: number;
    category?: "hardware" | "software" | "network" | "security" | "general";
    reactions?: {
      helpful: boolean;
      needsClarification: boolean;
    };
    status?: "sending" | "sent" | "error";
    codeSnippets?: Array<{
      language: string;
      code: string;
    }>;
  };
  darkMode: boolean;
  onReactionChange?: (reactions: {
    helpful: boolean;
    needsClarification: boolean;
  }) => void;
}

export default function ChatMessage({
  message,
  darkMode,
  onReactionChange,
}: MessageProps) {
  const isUser = message.role === "user";

  // Format the message timestamp
  const formattedTime = format(new Date(message.timestamp), "h:mm a");

  // Process message content for markdown-like formatting and code highlighting
  const formatContent = (content: string) => {
    // Extract and process code snippets if present
    if (message.codeSnippets?.length) {
      message.codeSnippets.forEach((snippet) => {
        const codeBlock = `\`\`\`${snippet.language}\n${snippet.code}\n\`\`\``;
        content = content.replace("{code}", codeBlock);
      });
    }
    // Sanitize the content first to prevent XSS
    let sanitizedContent = content
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

    // Handle multi-line code blocks first
    let formattedContent = sanitizedContent.replace(
      /```([\s\S]+?)```/g,
      (_, code) =>
        `<pre class="p-2 my-2 rounded bg-gray-200 dark:bg-gray-700 font-mono text-sm overflow-x-auto whitespace-pre">${code.trim()}</pre>`
    );

    // Handle inline code blocks
    formattedContent = formattedContent.replace(
      /`([^`]+)`/g,
      '<code class="px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-700 font-mono text-sm">$1</code>'
    );

    // Handle numbered lists
    formattedContent = formattedContent.replace(
      /^\d+\.\s+(.+)$/gm,
      '<li class="list-decimal ml-4">$1</li>'
    );

    // Handle bullet points
    formattedContent = formattedContent.replace(
      /^[-*]\s+(.+)$/gm,
      '<li class="list-disc ml-4">$1</li>'
    );

    // Handle bold and italic text
    formattedContent = formattedContent
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>");

    // Convert URLs to links with proper styling
    formattedContent = formattedContent.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors">$1</a>'
    );

    // Wrap lists in appropriate container
    formattedContent = formattedContent.replace(
      /(<li[^>]*>.*?<\/li>\s*)+/g,
      '<ul class="my-2">$&</ul>'
    );

    // Convert newlines to <br> tags, but preserve spacing in code blocks
    formattedContent = formattedContent.replace(/\n/g, "<br>");

    return formattedContent;
  };

  return (
    <div
      className={`mb-4 ${
        isUser ? "ml-auto max-w-[80%]" : "mr-auto max-w-[80%]"
      }`}
    >
      <div className="flex items-start gap-2">
        {!isUser && (
          <div className="flex-shrink-0">
            <div
              className={`p-2 rounded-full ${
                darkMode
                  ? "bg-blue-900/30 text-blue-400"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              <Bot size={16} />
            </div>
          </div>
        )}

        <div
          className={`rounded-lg p-3 ${
            isUser
              ? darkMode
                ? "bg-blue-600 text-white"
                : "bg-blue-500 text-white"
              : darkMode
              ? "bg-gray-700 text-gray-100"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          <div
            className="text-sm mb-1"
            dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
          />
          <div className="flex items-center justify-between mt-2">
            <div
              className={`text-[10px] ${
                isUser
                  ? "text-blue-200"
                  : darkMode
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              {formattedTime}
              {message.status && (
                <span className="ml-2">
                  {message.status === "sending" && "Sending..."}
                  {message.status === "sent" && "Delivered"}
                  {message.status === "error" && "Failed to send"}
                </span>
              )}
            </div>
            {!isUser && onReactionChange && (
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    onReactionChange({
                      ...(message.reactions || {
                        helpful: false,
                        needsClarification: false,
                      }),
                      helpful: !(message.reactions?.helpful ?? false),
                    })
                  }
                  className={`text-xs px-2 py-1 rounded ${
                    message.reactions?.helpful
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 dark:bg-gray-600"
                  }`}
                >
                  Helpful
                </button>
                <button
                  onClick={() =>
                    onReactionChange({
                      ...(message.reactions || {
                        helpful: false,
                        needsClarification: false,
                      }),
                      needsClarification: !(
                        message.reactions?.needsClarification ?? false
                      ),
                    })
                  }
                  className={`text-xs px-2 py-1 rounded ${
                    message.reactions?.needsClarification
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-200 dark:bg-gray-600"
                  }`}
                >
                  Need Clarification
                </button>
              </div>
            )}
          </div>
        </div>

        {isUser && (
          <div className="flex-shrink-0">
            <div
              className={`p-2 rounded-full ${
                darkMode
                  ? "bg-blue-900/30 text-blue-400"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              <User size={16} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
