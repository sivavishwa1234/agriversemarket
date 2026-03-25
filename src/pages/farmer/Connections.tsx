import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, UserPlus, Send, Mic, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
  read: boolean;
}

const Connections = () => {
  const { toast } = useToast();
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser] = useState(localStorage.getItem("farmerUsername") || "Farmer");

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = () => {
    const storedMessages = localStorage.getItem("chatMessages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  };

  const connections = [
    { id: 1, name: "Customer", role: "Customer", status: "Connected", image: "" },
    { id: 2, name: "Agent Smith", role: "Agent", status: "Connected", image: "" },
    { id: 3, name: "Agent Brown", role: "Agent", status: "Connected", image: "" },
  ];

  const recommendations = [
    { id: 4, name: "customer1", role: "Customer", status: "Recommended", image: "" },
    { id: 5, name: "agent1", role: "Agent", status: "Recommended", image: "" },
  ];

  const handleConnect = (name: string) => {
    toast({
      title: "Connection Request Sent",
      description: `Your request to connect with ${name} has been sent`,
    });
  };

  const handleChat = (connection: any) => {
    setSelectedConnection(connection);
    setChatOpen(true);
    loadMessages();
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: currentUser,
      receiver: selectedConnection.name,
      content: message,
      timestamp: new Date().toISOString(),
      read: false,
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));

    toast({
      title: "Message Sent",
      description: `Your message has been sent to ${selectedConnection.name}`,
    });
    setMessage("");
  };

  const getConversation = () => {
    if (!selectedConnection) return [];
    return messages.filter(
      (msg) =>
        (msg.sender === currentUser && msg.receiver === selectedConnection.name) ||
        (msg.sender === selectedConnection.name && msg.receiver === currentUser)
    );
  };

  const getUnreadCount = (connectionName: string) => {
    return messages.filter(
      (msg) => msg.sender === connectionName && msg.receiver === currentUser && !msg.read
    ).length;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Connections</h1>
        <p className="text-muted-foreground">Manage your network of customers and agents</p>
      </div>

      {/* My Connections */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>My Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {connections.map((connection) => (
              <Card key={connection.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={connection.image} />
                      <AvatarFallback>{connection.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{connection.name}</p>
                      <Badge variant="secondary" className="mt-1">{connection.role}</Badge>
                    </div>
                    <Button className="w-full relative" onClick={() => handleChat(connection)}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat
                      {getUnreadCount(connection.name) > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                          {getUnreadCount(connection.name)}
                        </Badge>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommended Connections */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {recommendations.map((connection) => (
              <Card key={connection.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={connection.image} />
                      <AvatarFallback>{connection.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{connection.name}</p>
                      <Badge variant="outline" className="mt-1">{connection.role}</Badge>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => handleConnect(connection.name)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Dialog */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chat with {selectedConnection?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <ScrollArea className="h-96 border rounded-lg p-4 bg-muted/20">
              {getConversation().length === 0 ? (
                <p className="text-sm text-muted-foreground text-center">No messages yet. Start the conversation!</p>
              ) : (
                <div className="space-y-4">
                  {getConversation().map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === currentUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs rounded-lg p-3 ${
                          msg.sender === currentUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            <div className="space-y-2">
              <Textarea
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={3}
              />
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Mic className="h-4 w-4" />
                </Button>
                <Input type="file" className="hidden" id="file-upload" />
                <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                  Upload File (Max 10MB)
                </Button>
                <Button className="flex-1" onClick={handleSendMessage}>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Connections;
