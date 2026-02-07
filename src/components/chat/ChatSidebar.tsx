import { useState, useEffect, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, X } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isMe: boolean;
}

interface ChatSidebarProps {
  open: boolean;
  onClose: () => void;
  providerId: string | null;
}

// Mock messages
const mockMessages: Message[] = [
  {
    id: '1',
    senderId: 'provider',
    text: 'Hello! How can I help you today?',
    timestamp: new Date(Date.now() - 3600000),
    isMe: false,
  },
  {
    id: '2',
    senderId: 'me',
    text: 'Hi, I\'m interested in booking space in your Shanghai to LA container.',
    timestamp: new Date(Date.now() - 3500000),
    isMe: true,
  },
  {
    id: '3',
    senderId: 'provider',
    text: 'Great choice! We have 12 m³ available. What type of cargo will you be shipping?',
    timestamp: new Date(Date.now() - 3400000),
    isMe: false,
  },
];

const providerNames: Record<string, string> = {
  p1: 'Global Shipping Co.',
  p2: 'EuroRail Logistics',
  p3: 'Swift Air Cargo',
  p4: 'Continental Trucking',
  p5: 'Pacific Maritime',
  p6: 'Trans-Asia Railways',
};

export function ChatSidebar({ open, onClose, providerId }: ChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const providerName = providerId ? providerNames[providerId] || 'Provider' : 'Provider';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: newMessage,
      timestamp: new Date(),
      isMe: true,
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate provider response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: 'provider',
        text: 'Thanks for your message! I\'ll get back to you shortly.',
        timestamp: new Date(),
        isMe: false,
      };
      setMessages(prev => [...prev, response]);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="accent-gradient text-primary-foreground">
                {providerName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <SheetTitle className="text-left">{providerName}</SheetTitle>
              <p className="text-xs text-muted-foreground">Usually responds within 1 hour</p>
            </div>
          </div>
        </SheetHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.isMe
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-secondary text-foreground rounded-bl-md'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t bg-background">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSend} size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
