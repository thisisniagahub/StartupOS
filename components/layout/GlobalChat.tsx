
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { GeminiModel, ChatMessage } from '../../types';
import * as Icons from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { getAgentTools, executeTool } from '../../services/agentTools';

export const GlobalChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Hello! I am your StartupOS Agent. I can manage your investors, sales pipeline, and system settings. How can I help?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Persistent Chat Session Ref
  const chatSessionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isOpen, activeTool]);

  // Initialize Chat Session on Mount
  useEffect(() => {
    const initChat = async () => {
        const tools = await getAgentTools();
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        chatSessionRef.current = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: {
                systemInstruction: "You are an autonomous Agent for StartupOS. You have permission to access the user's data (investors, sales, finance) and perform actions (add data, install apps) using the provided tools. If the 'My Browser' tool is available, you can also read the current page content and navigate. Be concise, professional, and confirm actions after performing them. Today is " + new Date().toDateString() + ".",
                tools: [{ functionDeclarations: tools }],
            }
        });
    };
    initChat();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // 1. Send User Message
      let result = await chatSessionRef.current.sendMessage({ text: userMsg.text });
      
      // 2. Loop for Function Calls
      // Gemini may return a function call instead of text. We must execute it and send the result back.
      // We loop because one prompt might trigger multiple sequential tool calls.
      while (result.functionCalls && result.functionCalls.length > 0) {
          const call = result.functionCalls[0]; // Handle first call
          const { name, args } = call;
          
          setActiveTool(name); // UI indicator

          // Execute Tool locally
          const toolResult = await executeTool(name, args);
          
          // Send result back to model
          result = await chatSessionRef.current.sendMessage({
              functionResponses: [{
                  name: name,
                  response: { result: toolResult }
              }]
          });
          
          setActiveTool(null);
      }

      // 3. Final Text Response
      const textResponse = result.text;
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: textResponse || "Task completed.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, modelMsg]);

    } catch (error) {
      console.error('Agent Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "I encountered an error executing that request. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
      setActiveTool(null);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)] flex items-center justify-center z-50 text-white hover:brightness-110 transition-all border border-primary-500/50"
      >
        {isOpen ? <Icons.X size={24} /> : <Icons.Bot size={28} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-96 h-[600px] bg-black/90 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-neutral-800 bg-neutral-900/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-600/20 flex items-center justify-center text-primary-500">
                 <Icons.BrainCircuit size={18} />
              </div>
              <div>
                  <h3 className="font-bold text-white text-sm">StartupOS Agent</h3>
                  <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Online • Connected</span>
                  </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-neutral-800">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'model' && (
                      <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center mr-2 mt-1 shrink-0">
                          <Icons.Bot size={14} className="text-neutral-400" />
                      </div>
                  )}
                  <div 
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-primary-700 text-white rounded-br-none' 
                        : 'bg-neutral-800/80 text-neutral-200 border border-neutral-700/50 rounded-bl-none'
                    }`}
                  >
                     <ReactMarkdown 
                        components={{
                            p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                            li: ({node, ...props}) => <li className="mb-1" {...props} />,
                            strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />
                        }}
                     >
                        {msg.text}
                     </ReactMarkdown>
                  </div>
                </div>
              ))}
              
              {/* Tool Execution Indicator */}
              {activeTool && (
                 <div className="flex justify-start animate-fade-in">
                    <div className="ml-8 bg-neutral-900/50 border border-primary-900/30 rounded-lg px-3 py-2 flex items-center gap-3">
                        <Icons.Loader2 size={14} className="animate-spin text-primary-500" />
                        <span className="text-xs text-primary-400 font-mono">Running tool: {activeTool}...</span>
                    </div>
                 </div>
              )}

              {/* Typing Indicator */}
              {isTyping && !activeTool && (
                <div className="flex justify-start ml-8">
                  <div className="bg-neutral-800/50 rounded-lg p-3 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 pt-2 bg-gradient-to-t from-black to-transparent">
              <div className="relative">
                <input
                  type="text"
                  className="w-full bg-neutral-900/90 border border-neutral-800 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 shadow-lg"
                  placeholder="Ask to add an investor, check runway..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                  onClick={handleSend}
                  disabled={!input || isTyping}
                  className="absolute right-2 top-2 p-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-500 disabled:opacity-50 disabled:bg-neutral-700 transition-colors"
                >
                  <Icons.ArrowUp size={18} />
                </button>
              </div>
              <p className="text-[10px] text-neutral-600 text-center mt-2">
                  Powered by Gemini 3 Flash • Accessing Live Context
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
