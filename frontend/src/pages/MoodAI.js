import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Brain, 
  Send, 
  Loader2, 
  Bot, 
  User, 
  RefreshCw,
  Heart,
  Smile,
  Frown,
  Meh,
  MessageCircle
} from 'lucide-react';

export default function MoodAI() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_GEMINI_URL || 'http://localhost:5001'}/gemini`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mood: inputText.trim() })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const aiMessage = {
        id: Date.now() + 1,
        text: data.response || 'I understand how you\'re feeling. Would you like to talk about it more?',
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Sorry, I\'m having trouble connecting right now. Please try again later.');
      
      const errorMessage = {
        id: Date.now() + 1,
        text: 'I\'m sorry, but I\'m having trouble connecting right now. Please try again in a moment.',
        sender: 'ai',
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickMood = (mood) => {
    const moodMessages = {
      happy: "I'm feeling really happy today!",
      sad: "I'm feeling a bit sad and could use some support.",
      anxious: "I'm feeling anxious and worried about things.",
      stressed: "I'm feeling stressed and overwhelmed.",
      excited: "I'm feeling excited about something!",
      tired: "I'm feeling tired and drained.",
      grateful: "I'm feeling grateful for the good things in my life.",
      confused: "I'm feeling confused and uncertain about things."
    };

    setInputText(moodMessages[mood]);
  };

  const getMoodIcon = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('happy') || lowerText.includes('excited') || lowerText.includes('great')) {
      return <Smile className="h-4 w-4 text-green-500" />;
    } else if (lowerText.includes('sad') || lowerText.includes('down') || lowerText.includes('depressed')) {
      return <Frown className="h-4 w-4 text-blue-500" />;
    } else if (lowerText.includes('anxious') || lowerText.includes('worried') || lowerText.includes('stressed')) {
      return <Meh className="h-4 w-4 text-yellow-500" />;
    } else {
      return <Heart className="h-4 w-4 text-pink-500" />;
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Brain className="h-8 w-8 mr-3 text-primary" />
            Mood AI
          </h1>
          <p className="text-muted-foreground">
            Share how you're feeling and get empathetic AI responses
          </p>
        </div>
        <Button variant="outline" onClick={clearChat} disabled={messages.length === 0}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Clear Chat
        </Button>
      </div>

      {/* Quick Mood Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Moods</CardTitle>
          <CardDescription>
            Click a mood to quickly express how you're feeling
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {([
              { key: 'happy', label: 'Happy', emoji: '😊' },
              { key: 'sad', label: 'Sad', emoji: '😢' },
              { key: 'anxious', label: 'Anxious', emoji: '😰' },
              { key: 'stressed', label: 'Stressed', emoji: '😫' },
              { key: 'excited', label: 'Excited', emoji: '🤩' },
              { key: 'tired', label: 'Tired', emoji: '😴' },
              { key: 'grateful', label: 'Grateful', emoji: '🙏' },
              { key: 'confused', label: 'Confused', emoji: '😕' }
            ] || []).map((mood) =>(
              <Button
                key={mood.key}
                variant="outline"
                size="sm"
                onClick={() => handleQuickMood(mood.key)}
                className="flex items-center space-x-2"
              >
                <span>{mood.emoji}</span>
                <span>{mood.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Chat with Mood AI
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Welcome to Mood AI</h3>
                <p className="text-muted-foreground mb-4">
                  Share how you're feeling and I'll provide empathetic responses to help you.
                </p>
                <p className="text-sm text-muted-foreground">
                  Try typing something like "I feel anxious about work" or use the quick mood buttons above.
                </p>
              </div>
            ) : (
              (messages || []).map((message) =>(
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : message.isError
                        ? 'bg-red-50 text-red-800 border border-red-200'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === 'ai' && !message.isError && (
                        <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      )}
                      {message.sender === 'user' && (
                        <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4" />
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-4 py-2 bg-red-50 border-t border-red-200">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Share how you're feeling..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={!inputText.trim() || isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tips for Better Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Be Specific</h4>
              <p className="text-sm text-muted-foreground">
                Instead of "I feel bad," try "I feel overwhelmed by my workload and worried about deadlines."
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Share Context</h4>
              <p className="text-sm text-muted-foreground">
                Mention what's happening in your life that might be affecting your mood.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Ask for Help</h4>
              <p className="text-sm text-muted-foreground">
                If you need specific advice or support, don't hesitate to ask directly.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Be Honest</h4>
              <p className="text-sm text-muted-foreground">
                The more honest you are about your feelings, the better I can help you.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
