import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    if (user) fetchConversations();
  }, [user]);

  const fetchConversations = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('conversations')
      .select('*')
      .or(`participant_1.eq.${user!.id},participant_2.eq.${user!.id}`)
      .order('updated_at', { ascending: false });
    
    if (data && data.length > 0) {
      const otherIds = data.map((c: any) => c.participant_1 === user!.id ? c.participant_2 : c.participant_1);
      const { data: profiles } = await supabase.from('profiles').select('user_id, name, company_name').in('user_id', otherIds);
      const profileMap = new Map(profiles?.map((p: any) => [p.user_id, p]) || []);
      
      setConversations(data.map((c: any) => {
        const otherId = c.participant_1 === user!.id ? c.participant_2 : c.participant_1;
        const otherProfile = profileMap.get(otherId);
        return { ...c, otherUserId: otherId, otherName: otherProfile?.company_name || otherProfile?.name || 'User' };
      }));
    } else {
      setConversations([]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">Messages</h1>
            <p className="text-muted-foreground">Your conversations with traders and providers</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">No messages yet</h3>
              <p className="text-muted-foreground">Start a conversation from the marketplace.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {conversations.map(conv => (
                <Card key={conv.id} className="cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => { setSelectedProviderId(conv.otherUserId); setChatOpen(true); }}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="accent-gradient text-primary-foreground">
                        {conv.otherName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{conv.otherName}</p>
                      <p className="text-sm text-muted-foreground">
                        Last active: {new Date(conv.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <ChatSidebar open={chatOpen} onClose={() => setChatOpen(false)} providerId={selectedProviderId} />
    </div>
  );
}
