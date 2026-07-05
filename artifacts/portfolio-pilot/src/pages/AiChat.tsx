import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { MessageSquare, Send, Sparkles, User, RefreshCw } from 'lucide-react';
import { useAiChat, useGetChatHistory } from '@workspace/api-client-react';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AiChat() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialPrompt = searchParams.get('prompt') || '';
  
  const [input, setInput] = useState(initialPrompt);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef<string | null>(null);

  const { data: history, isLoading: isHistoryLoading } = useGetChatHistory({
    query: { queryKey: ['chat-history'] }
  });

  const chatMutation = useAiChat();

  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([]);

  useEffect(() => {
    if (history?.length) {
      setMessages(history.map(m => ({ role: m.role, content: m.content })));
      sessionId.current = history[0].sessionId;
    }
  }, [history]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, chatMutation.isPending]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: newMsg }]);

    chatMutation.mutate(
      { data: { message: newMsg, sessionId: sessionId.current } },
      {
        onSuccess: (data) => {
          sessionId.current = data.sessionId;
          setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        }
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    "Why is Apple rated 88?",
    "Compare Costco vs Walmart",
    "What are Nvidia's biggest risks?"
  ];

  return (
    <div className="h-full flex flex-col p-6 md:p-8 max-w-[1200px] mx-auto animate-in fade-in">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" /> AI Assistant
          </h1>
          <p className="text-muted-foreground mt-2">Quantitative analysis and portfolio insights powered by LLM.</p>
        </div>
      </div>

      <Card className="bg-card border-card-border flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-500 to-primary" />
        
        {/* Messages Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          {messages.length === 0 && !isHistoryLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">How can I help analyze your portfolio?</h2>
              <p className="text-muted-foreground mb-8 max-w-md">Ask me about specific equities, compare metrics, or ask for a deep dive on your current allocations.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
                {quickPrompts.map(p => (
                  <button 
                    key={p} 
                    onClick={() => {
                      setInput(p);
                      // slight delay to let input update before sending
                      setTimeout(() => handleSend(), 50);
                    }}
                    className="p-4 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/30 rounded-xl text-sm text-left transition-all"
                  >
                    "{p}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center mt-1 ${
                    msg.role === 'user' ? 'bg-secondary text-secondary-foreground' : 'bg-primary/20 text-primary'
                  }`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user' ? 'bg-secondary text-secondary-foreground rounded-tr-sm' : 'bg-white/5 border border-white/5 rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatMutation.isPending && (
                <div className="flex gap-4 max-w-[85%]">
                  <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center mt-1 bg-primary/20 text-primary">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="p-4 rounded-2xl text-sm bg-white/5 border border-white/5 rounded-tl-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-75" />
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150" />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/5 bg-background/50 backdrop-blur-md">
          <div className="relative max-w-4xl mx-auto flex items-center">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask the terminal..."
              className="pl-4 pr-12 py-6 bg-card border-card-border shadow-inner text-base rounded-xl"
              disabled={chatMutation.isPending}
            />
            <Button 
              size="icon" 
              className="absolute right-2 w-10 h-10 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
              onClick={handleSend}
              disabled={!input.trim() || chatMutation.isPending}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-center mt-2">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">AI can make mistakes. Verify critical data.</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
