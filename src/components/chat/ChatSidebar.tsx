import { useState, useEffect, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ChatSidebarProps {
  open: boolean;
  onClose: () => void;
  providerId: string | null;
}

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export function ChatSidebar({ open, onClose, providerId }: ChatSidebarProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [providerName, setProviderName] = useState('Provider');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && providerId && user) {
      initConversation();
    }
  }, [open, providerId, user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!conversationId) return;
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId]);

  const initConversation = async () => {
    if (!user || !providerId) return;
    setLoading(true);

    // Get provider name
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_name, name')
      .eq('user_id', providerId)
      .maybeSingle();
    if (profile) setProviderName(profile.company_name || profile.name);

    // Find or create conversation
    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .or(`and(participant_1.eq.${user.id},participant_2.eq.${providerId}),and(participant_1.eq.${providerId},participant_2.eq.${user.id})`)
      .maybeSingle();

    let convId = existing?.id;
    if (!convId) {
      const { data: newConv } = await supabase
        .from('conversations')
        .insert({ participant_1: user.id, participant_2: providerId } as any)
        .select()
        .single();
      convId = newConv?.id;
    }
    setConversationId(convId || null);

    // Load messages
    if (convId) {
      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });
      setMessages((msgs as Message[]) || []);
    }
    setLoading(false);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !conversationId || !user) return;
    const content = newMessage;
    setNewMessage('');
    await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content,
    } as any);
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
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="accent-gradient text-primary-foreground">
                {providerName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <SheetTitle className="text-left">{providerName}</SheetTitle>
              <p className="text-xs text-muted-foreground">Real-time messaging</p>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : (
            <div className="space-y-4">
              {messages.map(message => (
                <div key={message.id} className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.sender_id === user?.id
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-secondary text-foreground rounded-bl-md'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.sender_id === user?.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {messages.length === 0 && !loading && (
                <p className="text-center text-muted-foreground text-sm py-8">Start a conversation...</p>
              )}
            </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t bg-background">
          <div className="flex gap-2">
            <Input placeholder="Type a message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} className="flex-1" />
            <Button onClick={handleSend} size="icon"><Send className="w-4 h-4" /></Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
