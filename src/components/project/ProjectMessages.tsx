import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Calendar, User } from "lucide-react";

interface Message {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}

interface ProjectMessagesProps {
  messages: Message[];
}

const ProjectMessages = ({ messages }: ProjectMessagesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <MessageCircle className="h-5 w-5 mr-2 text-primary" />
          Project Messages & Announcements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {messages.map((message) => (
            <Card key={message.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-foreground">{message.title}</h3>
                  <Badge variant="outline" className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {message.date}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {message.content}
                </p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="h-4 w-4 mr-1" />
                  {message.author}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {messages.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No messages yet</h3>
              <p className="text-muted-foreground">
                Project announcements and communications will appear here.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectMessages;