import type { ChatMessage, ChatAuthor } from 'svelte-daui';

const users: Record<string, ChatAuthor> = {
  user: { id: 'user', name: 'You' },
  assistant: { id: 'assistant', name: 'AI Assistant', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=assistant' },
  support: { id: 'support', name: 'Support Agent', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=support' },
};

// Sample messages for demo
const sampleMessages: ChatMessage[] = [
  {
    id: '1',
    content: 'Hello! How can I help you today?',
    author: users.assistant,
    timestamp: Date.now() - 3600000, // 1 hour ago
    variant: 'assistant',
  },
  {
    id: '2',
    content: 'I have a question about the DAUI framework.',
    author: users.user,
    timestamp: Date.now() - 3500000,
    variant: 'user',
    status: 'read',
  },
  {
    id: '3',
    content: "Of course! I'd be happy to help. What would you like to know about DAUI?",
    author: users.assistant,
    timestamp: Date.now() - 3400000,
    variant: 'assistant',
  },
  {
    id: '4',
    content: 'How do I create custom components?',
    author: users.user,
    timestamp: Date.now() - 3300000,
    variant: 'user',
    status: 'read',
  },
  {
    id: '5',
    content: 'Great question! In DAUI, components are defined as TypeScript interfaces. You start by adding your type definition to the core types, then create a Svelte component that implements it, and finally register it in a preset. Would you like me to walk you through an example?',
    author: users.assistant,
    timestamp: Date.now() - 3200000,
    variant: 'assistant',
  },
];

export class ChatStore {
  messages = $state<ChatMessage[]>([...sampleMessages]);
  isTyping = $state<ChatAuthor | null>(null);
  status = $state<'online' | 'offline' | 'typing'>('online');

  currentUserId = 'user';

  sendMessage = (content: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content,
      author: users.user,
      timestamp: Date.now(),
      variant: 'user',
      status: 'sending',
    };
    this.messages = [...this.messages, userMessage];

    // Update status to sent after a brief delay
    setTimeout(() => {
      const idx = this.messages.findIndex((m) => m.id === userMessage.id);
      if (idx !== -1) {
        this.messages[idx] = { ...this.messages[idx], status: 'sent' };
        this.messages = [...this.messages];
      }
    }, 500);

    // Simulate assistant typing
    setTimeout(() => {
      this.isTyping = users.assistant;
      this.status = 'typing';
    }, 1000);

    // Simulate assistant response
    setTimeout(() => {
      this.isTyping = null;
      this.status = 'online';

      // Update user message to read
      const idx = this.messages.findIndex((m) => m.id === userMessage.id);
      if (idx !== -1) {
        this.messages[idx] = { ...this.messages[idx], status: 'read' };
      }

      // Add assistant response
      const responses = [
        "That's a great point! Let me think about that...",
        "I understand. Here's what I suggest...",
        "Thanks for your question! The answer is...",
        "Interesting! In DAUI, you would typically...",
        "Good question! The best approach would be to...",
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        content: response,
        author: users.assistant,
        timestamp: Date.now(),
        variant: 'assistant',
      };
      this.messages = [...this.messages, assistantMessage];
    }, 2500);
  };

  handleTyping = (isTyping: boolean) => {
    // Could send typing indicator to server
    console.log('User is typing:', isTyping);
  };

  clearMessages = () => {
    this.messages = [];
  };
}

export const chatStore = new ChatStore();
