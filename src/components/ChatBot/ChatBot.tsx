import { useState, useRef, useEffect } from "react";
import { Loader, MessageSquare, Send, X } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ChatMessage from "./ChatMessage";
import { useTheme } from "../../contexts/ThemeContext";

// Define message types
interface Message {
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
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // Load messages from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem("fixitquick-chat-history");
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<Message["category"]>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { darkMode } = useTheme();

  // Save chat history to localStorage with cleanup
  useEffect(() => {
    try {
      // Only store messages from the last 24 hours, up to 20 messages
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      const recentMessages = messages.filter(
        (msg) => msg.timestamp > oneDayAgo
      );
      const messagesToStore = recentMessages.slice(-20);

      // Compress long messages before storing
      const processedMessages = messagesToStore.map((msg) => ({
        ...msg,
        content:
          msg.content.length > 1000
            ? msg.content.slice(0, 1000) + "..."
            : msg.content,
      }));

      localStorage.setItem(
        "fixitquick-chat-history",
        JSON.stringify(processedMessages)
      );
    } catch (error) {
      console.error("Error saving chat history:", error);
      // If localStorage is full, clear it and try again
      localStorage.removeItem("fixitquick-chat-history");
    }
  }, [messages]);

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem("fixitquick-chat-history");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!input.trim()) return;

    // Detect message category based on content
    const detectCategory = (content: string): Message["category"] => {
      const lowerContent = content.toLowerCase();
      if (
        lowerContent.match(
          /\b(wifi|network|ethernet|connection|internet|dns|ip)\b/
        )
      )
        return "network";
      if (
        lowerContent.match(
          /\b(virus|password|hack|security|privacy|firewall|encrypt)\b/
        )
      )
        return "security";
      if (
        lowerContent.match(
          /\b(windows|software|app|program|install|update|driver|os)\b/
        )
      )
        return "software";
      if (
        lowerContent.match(
          /\b(hardware|keyboard|mouse|screen|battery|power|printer|device)\b/
        )
      )
        return "hardware";
      return "general";
    };

    // Detect code snippets in the message
    const detectCodeSnippets = (content: string) => {
      const codeBlocks = content.match(/```([\s\S]+?)```/g) || [];
      return codeBlocks.map((block) => ({
        language: block.match(/```(\w+)?/)?.[1] || "text",
        code: block.replace(/```(\w+)?\n?|```/g, "").trim(),
      }));
    };

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: Date.now(),
      status: "sending",
      category: detectCategory(input),
      codeSnippets: detectCodeSnippets(input),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const maxRetries = 5;
    let retryCount = 0;

    const attemptConnection = async () => {
      // Add request timeout and network status check
      if (!navigator.onLine) {
        const offlineMessage: Message = {
          role: "bot",
          content:
            "You appear to be offline. Please check your internet connection and try again.",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, offlineMessage]);
        setIsLoading(false);
        return;
      }
      try {
        // Initialize the Gemini AI API with enhanced validation and error handling
        const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

        // Comprehensive API key validation with detailed error messages and security checks
        const validateApiKey = () => {
          if (!API_KEY || API_KEY.trim() === "") {
            throw new Error("API_KEY_MISSING");
          }

          // Check for default or placeholder values
          const defaultValues = [
            "your_gemini_api_key_here",
            "<your-api-key>",
            "placeholder",
          ];
          if (
            defaultValues.some((val) => API_KEY.includes(val)) ||
            API_KEY.length < 40
          ) {
            throw new Error("API_KEY_DEFAULT");
          }

          // Validate API key format (starts with 'AIza' followed by alphanumeric characters)
          const validFormatRegex = /^AIza[0-9A-Za-z-_]{35,}$/;
          if (!validFormatRegex.test(API_KEY)) {
            throw new Error("API_KEY_INVALID_FORMAT");
          }

          // Additional security checks
          if (API_KEY.length > 100) {
            throw new Error("API_KEY_TOO_LONG");
          }

          if (API_KEY.includes("http") || API_KEY.includes("www")) {
            throw new Error("API_KEY_INVALID_CONTENT");
          }

          // Log warning in development environment
          if (process.env.NODE_ENV === "development") {
            console.warn("Warning: Using API key in development environment");
          }

          return true; // API key is valid
        };

        // Validate API key before proceeding
        validateApiKey();

        try {
          validateApiKey();
        } catch (error) {
          let errorContent = "";
          if (error instanceof Error) {
            switch (error.message) {
              case "API_KEY_MISSING":
                errorContent =
                  "The API key is missing. Please add VITE_GEMINI_API_KEY to your .env file.";
                break;
              case "API_KEY_DEFAULT":
                errorContent =
                  "Please replace the default API key with your actual Gemini API key in the .env file.";
                break;
              case "API_KEY_INVALID_FORMAT":
                errorContent =
                  "The API key format is invalid. Please ensure you're using a valid Gemini API key that starts with 'AIza'.";
                break;
              default:
                errorContent =
                  "There was an issue with the API key configuration. Please check your .env file.";
            }
          }
          const errorMessage: Message = {
            role: "bot",
            content: errorContent,
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, errorMessage]);
          setIsLoading(false);
          return;
        }
        const genAI = new GoogleGenerativeAI(API_KEY);

        // Create a context for tech support
        const techSupportContext = `You are an advanced tech support AI assistant for the FixItQuick platform, 
      specializing in helping students resolve computer-related issues. Your responses should be:
      1. Clear and concise with step-by-step solutions
      2. Focused on practical fixes for hardware issues (keyboard, display, audio, wifi, battery)
      3. Software troubleshooting (OS, applications, drivers)
      4. Security-conscious and up-to-date with best practices
      5. Friendly and patient, using simple terms for technical concepts
      If the query is unrelated to tech support, politely redirect to relevant tech topics.
      Always verify the safety and appropriateness of suggested solutions.`;

        // Create a history for context
        // Use more context for better conversation flow
        const recentMessages = messages.slice(-8).map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        }));

        // For Gemini, we need to use their specific chat format
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const chat = model.startChat({
          history: recentMessages,
          generationConfig: {
            maxOutputTokens: 800,
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
          },
        });

        const result = (await Promise.race([
          chat.sendMessage(`${techSupportContext}\n\nUser question: ${input}`),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timeout")), 30000)
          ),
        ]).catch((error) => {
          if (error.message === "Request timeout") {
            throw new Error(
              "The request took too long to complete. Please try again."
            );
          }
          throw error;
        })) as { response: { text: () => string } };

        // Add request retry logic for network issues
        if (!result && retryCount < maxRetries) {
          retryCount++;
          const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return attemptConnection();
        }

        if (!result?.response) {
          throw new Error(
            "No response received from Gemini AI. Please try again."
          );
        }

        // Add additional timeout check for response processing with enhanced error handling
        const responsePromise = new Promise<string>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(
              new Error("Response processing timed out. Please try again.")
            );
          }, 5000);
          try {
            const text = result.response.text();
            if (!text || text.trim().length === 0) {
              reject(
                new Error(
                  "Received empty response from Gemini AI. Please try again."
                )
              );
            }
            // Validate response format and content
            if (text.length > 10000) {
              reject(
                new Error("Response too long. Please try a simpler question.")
              );
            }
            // Check for potential error indicators in response
            if (text.toLowerCase().includes("error") && text.length < 50) {
              reject(
                new Error(
                  "Received error response from Gemini AI. Please try again."
                )
              );
            }
            clearTimeout(timeout);
            // Process and sanitize the response
            const sanitizedText = text
              .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
              .trim();

            // Validate response quality
            if (sanitizedText.split(" ").length < 3) {
              reject(
                new Error("Response too short or invalid. Please try again.")
              );
              return;
            }

            resolve(sanitizedText);
          } catch (error) {
            clearTimeout(timeout);
            console.error("Error processing Gemini response:", error);
            reject(
              new Error("Failed to process AI response. Please try again.")
            );
          }
        });
        const responseText = await responsePromise;

        const botMessage: Message = {
          role: "bot",
          content: responseText,
          timestamp: Date.now(),
          status: "sent",
          category: detectCategory(responseText),
          codeSnippets: detectCodeSnippets(responseText),
          reactions: {
            helpful: false,
            needsClarification: false,
          },
        };

        setMessages((prev) => [
          ...prev.slice(0, -1),
          { ...prev[prev.length - 1], status: "sent" },
          botMessage,
        ]);
      } catch (error) {
        console.error("Error from AI service:", error);
        retryCount++;

        let errorContent = "";
        const isRetryableError =
          error instanceof Error &&
          (error.message.includes("timeout") ||
            error.message.toLowerCase().includes("network") ||
            error.message.includes("429") ||
            error.message.toLowerCase().includes("rate limit"));

        if (isRetryableError && retryCount < maxRetries) {
          // Calculate exponential backoff delay
          const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 8000);
          errorContent = `Connection attempt ${retryCount} of ${maxRetries} failed. Retrying in ${
            backoffDelay / 1000
          } seconds...`;
          const retryMessage: Message = {
            role: "bot",
            content: errorContent,
            timestamp: Date.now(),
            status: "error",
          };
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { ...prev[prev.length - 1], status: "error" },
            retryMessage,
          ]);

          // Wait with exponential backoff before retrying
          await new Promise((resolve) => setTimeout(resolve, backoffDelay));
          return attemptConnection();
        }

        // If we've exhausted retries or it's not a retryable error, show final error message
        if (error instanceof Error) {
          if (
            error.message.includes("429") ||
            error.message.toLowerCase().includes("rate limit")
          ) {
            errorContent =
              "I'm receiving too many requests right now. Please wait a moment before trying again.";
          } else if (
            error.message.includes("401") ||
            error.message.toLowerCase().includes("unauthorized")
          ) {
            errorContent =
              "There seems to be an issue with the API key authentication. Please check if your API key is valid and properly configured.";
          } else if (
            error.message.toLowerCase().includes("network") ||
            error.message.toLowerCase().includes("internet")
          ) {
            errorContent =
              "I'm having trouble connecting to the network. Please check your internet connection and try again.";
          } else if (error.message.toLowerCase().includes("timeout")) {
            errorContent =
              "The request took too long to complete. This might be due to high server load or network issues. Please try again.";
          } else if (error.message.toLowerCase().includes("empty response")) {
            errorContent =
              "I received an empty response. This is unusual - please try asking your question again.";
          } else {
            errorContent =
              "I'm having trouble connecting to my knowledge base right now. Please try again later or check our Solutions section for help with your issue.";
          }
        }

        const errorMessage: Message = {
          role: "bot",
          content: errorContent,
          timestamp: Date.now(),
          status: "error",
        };

        setMessages((prev) => [
          ...prev.slice(0, -1),
          { ...prev[prev.length - 1], status: "error" },
          errorMessage,
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    await attemptConnection();
  };

  // Handle Enter key to send message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating chat button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-5 right-5 p-4 rounded-full shadow-lg z-50 transition-all ${
          isOpen
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-600 hover:bg-blue-700"
        } text-white`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div
          className={`fixed bottom-20 right-5 w-[350px] sm:w-[400px] max-h-[600px] rounded-lg shadow-xl z-40 flex flex-col overflow-hidden transition-all animate-fade-in ${
            darkMode
              ? "bg-gray-800 border border-gray-700 text-white"
              : "bg-white border border-gray-200 text-gray-800"
          }`}
        >
          {/* Chat header */}
          <div className="py-3 px-4 bg-blue-600 text-white">
            <div className="flex justify-between items-center">
              <h3 className="font-medium flex items-center gap-2">
                <MessageSquare size={18} />
                FixItQuick Assistant
              </h3>
              <button
                onClick={toggleChat}
                className="text-white/80 hover:text-white"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-blue-100 mt-1">
              Ask me anything about tech issues!
            </p>
          </div>

          {/* Search and filter bar */}
          <div
            className={`p-2 border-b ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className={`flex-1 px-3 py-1 text-sm rounded-lg ${
                  darkMode
                    ? "bg-gray-700 text-white placeholder-gray-400"
                    : "bg-gray-100 text-gray-800 placeholder-gray-500"
                }`}
              />
              <select
                value={selectedCategory || ""}
                onChange={(e) =>
                  setSelectedCategory(
                    (e.target.value as Message["category"]) || undefined
                  )
                }
                className={`px-3 py-1 text-sm rounded-lg ${
                  darkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <option value="">All Categories</option>
                <option value="hardware">Hardware</option>
                <option value="software">Software</option>
                <option value="network">Network</option>
                <option value="security">Security</option>
                <option value="general">General</option>
              </select>
            </div>
          </div>

          {/* Chat header with clear button */}
          <div
            className={`p-4 border-b ${
              darkMode ? "border-gray-700" : "border-gray-200"
            } flex justify-between items-center`}
          >
            <h3
              className={`text-lg font-semibold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Chat
            </h3>
            <button
              onClick={clearMessages}
              className={`px-3 py-1 rounded-md text-sm ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              } transition-colors`}
            >
              Clear Messages
            </button>
          </div>

          {/* Chat messages */}
          <div
            className={`flex-1 overflow-y-auto p-4 ${
              darkMode ? "bg-gray-800" : "bg-gray-50"
            }`}
            style={{ maxHeight: "400px" }}
          >
            {messages.filter(
              (msg) =>
                (!searchQuery ||
                  msg.content
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())) &&
                (!selectedCategory || msg.category === selectedCategory)
            ).length === 0 ? (
              <div
                className={`text-center py-8 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <p className="text-sm mb-2">No messages yet</p>
                <p className="text-xs">
                  Ask me how to fix common tech problems or get help with your
                  device issues.
                </p>
              </div>
            ) : (
              messages
                .filter(
                  (msg) =>
                    (!searchQuery ||
                      msg.content
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())) &&
                    (!selectedCategory || msg.category === selectedCategory)
                )
                .map((message) => (
                  <ChatMessage
                    key={`${message.role}-${message.timestamp}`}
                    message={message}
                    darkMode={darkMode}
                    onReactionChange={
                      message.role === "bot"
                        ? (reactions) => {
                            setMessages((prev) =>
                              prev.map((msg) =>
                                msg.timestamp === message.timestamp
                                  ? { ...msg, reactions }
                                  : msg
                              )
                            );
                          }
                        : undefined
                    }
                  />
                ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input */}
          <form
            onSubmit={sendMessage}
            className={`p-4 border-t ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type your tech question..."
                className={`flex-1 px-4 py-2 rounded-full text-sm ${
                  darkMode
                    ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600"
                    : "bg-gray-100 text-gray-800 placeholder-gray-500 border-gray-200"
                } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`p-2 rounded-full ${
                  darkMode
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader className="animate-spin" size={20} />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
