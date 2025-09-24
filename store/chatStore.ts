import { Conversation, Message } from "@/types";
import { mockConversations, mockMessages } from "@/mocks/messages";

interface ChatState {
  conversations: Conversation[];
  messages: Message[];
  currentConversationMessages: Message[];
  isLoading: boolean;
  error: string | null;
  
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (senderId: string, receiverId: string, content: string) => Promise<void>;
  markConversationAsRead: (conversationId: string) => Promise<void>;
  clearError: () => void;
}

let chatState: ChatState = {
  conversations: [...mockConversations],
  messages: [...mockMessages],
  currentConversationMessages: [],
  isLoading: false,
  error: null,

  fetchConversations: async () => {
    chatState.isLoading = true;
    chatState.error = null;
    
    try {
      await new Promise((resolve) => {
        if (resolve) setTimeout(resolve, 500);
      });
      
      chatState.conversations = [...mockConversations];
      chatState.isLoading = false;
    } catch {
      chatState.error = "Failed to fetch conversations";
      chatState.isLoading = false;
    }
  },

  fetchMessages: async (conversationId: string) => {
    if (!conversationId.trim()) return;
    
    chatState.isLoading = true;
    chatState.error = null;
    
    try {
      await new Promise((resolve) => {
        if (resolve) setTimeout(resolve, 500);
      });
      
      const conversation = chatState.conversations.find(
        (c) => c.id === conversationId
      );
      
      if (!conversation) {
        throw new Error("Conversation not found");
      }
      
      const conversationMessages = chatState.messages.filter(
        (msg) =>
          conversation.participantIds.includes(msg.senderId) &&
          conversation.participantIds.includes(msg.receiverId)
      );
      
      chatState.currentConversationMessages = conversationMessages;
      chatState.isLoading = false;
    } catch {
      chatState.error = "Failed to fetch messages";
      chatState.currentConversationMessages = [];
      chatState.isLoading = false;
    }
  },

  sendMessage: async (senderId, receiverId, content) => {
    if (!senderId.trim() || !receiverId.trim() || !content.trim()) return;
    if (content.length > 1000) return;
    
    const sanitizedContent = content.trim();
    
    chatState.isLoading = true;
    chatState.error = null;
    
    try {
      await new Promise((resolve) => {
        if (resolve) setTimeout(resolve, 500);
      });
      
      const newMessage: Message = {
        id: `msg${Date.now()}`,
        senderId,
        receiverId,
        content: sanitizedContent,
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      let conversation = chatState.conversations.find(
        (c) =>
          c.participantIds.includes(senderId) &&
          c.participantIds.includes(receiverId)
      );
      
      if (!conversation) {
        conversation = {
          id: `conv${Date.now()}`,
          participantIds: [senderId, receiverId],
          unreadCount: 1,
        };
        
        chatState.conversations = [...chatState.conversations, conversation];
      } else {
        chatState.conversations = chatState.conversations.map((c) =>
          c.id === conversation!.id
            ? {
                ...c,
                lastMessage: newMessage,
                unreadCount: senderId === receiverId ? 0 : c.unreadCount + 1,
              }
            : c
        );
      }
      
      chatState.messages = [...chatState.messages, newMessage];
      chatState.isLoading = false;
    } catch {
      chatState.error = "Failed to send message";
      chatState.isLoading = false;
    }
  },

  markConversationAsRead: async (conversationId) => {
    if (!conversationId.trim()) return;
    
    chatState.isLoading = true;
    chatState.error = null;
    
    try {
      await new Promise((resolve) => {
        if (resolve) setTimeout(resolve, 500);
      });
      
      chatState.conversations = chatState.conversations.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
      );
      
      const conversation = chatState.conversations.find(
        (c) => c.id === conversationId
      );
      
      if (conversation) {
        chatState.messages = chatState.messages.map((msg) =>
          conversation.participantIds.includes(msg.senderId) &&
          conversation.participantIds.includes(msg.receiverId)
            ? { ...msg, read: true }
            : msg
        );
      }
      
      chatState.isLoading = false;
    } catch {
      chatState.error = "Failed to mark conversation as read";
      chatState.isLoading = false;
    }
  },

  clearError: () => {
    chatState.error = null;
  },
};

export const useChatStore = () => chatState;