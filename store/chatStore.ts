import { useState, useEffect, useCallback, useMemo } from "react";
import createContextHook from "@nkzw/create-context-hook";
import { Conversation, Message } from "@/types";
import { mockConversations, mockMessages } from "@/mocks/messages";

const useStorage = () => {
  const getItem = async (key: string): Promise<string | null> => {
    if (!key.trim() || key.length > 100) return null;
    const sanitizedKey = key.trim();
    
    try {
      const AsyncStorageModule = await import('@react-native-async-storage/async-storage');
      return await AsyncStorageModule.default.getItem(sanitizedKey);
    } catch {
      return null;
    }
  };

  const setItem = async (key: string, value: string): Promise<void> => {
    if (!key.trim() || key.length > 100) return;
    if (!value.trim() || value.length > 10000) return;
    const sanitizedKey = key.trim();
    const sanitizedValue = value.trim();
    
    try {
      const AsyncStorageModule = await import('@react-native-async-storage/async-storage');
      await AsyncStorageModule.default.setItem(sanitizedKey, sanitizedValue);
    } catch {
      // Ignore storage errors
    }
  };

  return { getItem, setItem };
};

export const [ChatProvider, useChatStore] = createContextHook(() => {
  const [conversations, setConversations] = useState<Conversation[]>([...mockConversations]);
  const [messages, setMessages] = useState<Message[]>([...mockMessages]);
  const [currentConversationMessages, setCurrentConversationMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const storage = useStorage();

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedConversations = await storage.getItem('chat-conversations');
        const storedMessages = await storage.getItem('chat-messages');
        
        if (storedConversations) {
          setConversations(JSON.parse(storedConversations));
        }
        if (storedMessages) {
          setMessages(JSON.parse(storedMessages));
        }
      } catch {
        // Use default mock data if storage fails
      }
    };
    
    loadStoredData();
  }, [storage]);

  const saveToStorage = useCallback(async (conversations: Conversation[], messages: Message[]) => {
    if (!Array.isArray(conversations) || !Array.isArray(messages)) return;
    if (conversations.length > 1000 || messages.length > 10000) return;
    
    try {
      const conversationsStr = JSON.stringify(conversations);
      const messagesStr = JSON.stringify(messages);
      
      await storage.setItem('chat-conversations', conversationsStr);
      await storage.setItem('chat-messages', messagesStr);
    } catch {
      // Ignore storage errors
    }
  }, [storage]);

  const fetchConversations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 500);
      });
      
      setConversations([...mockConversations]);
      setIsLoading(false);
    } catch {
      setError("Failed to fetch conversations");
      setIsLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!conversationId.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 500);
      });
      
      const conversation = conversations.find((c) => c.id === conversationId);
      
      if (!conversation) {
        throw new Error("Conversation not found");
      }
      
      const conversationMessages = messages.filter(
        (msg) =>
          conversation.participantIds.includes(msg.senderId) &&
          conversation.participantIds.includes(msg.receiverId)
      );
      
      setCurrentConversationMessages(conversationMessages);
      setIsLoading(false);
    } catch {
      setError("Failed to fetch messages");
      setCurrentConversationMessages([]);
      setIsLoading(false);
    }
  }, [conversations, messages]);

  const sendMessage = useCallback(async (senderId: string, receiverId: string, content: string) => {
    if (!senderId.trim() || !receiverId.trim() || !content.trim()) return;
    if (content.length > 1000) return;
    
    const sanitizedContent = content.trim();
    
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 500);
      });
      
      const newMessage: Message = {
        id: `msg${Date.now()}`,
        senderId,
        receiverId,
        content: sanitizedContent,
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      let conversation = conversations.find(
        (c) =>
          c.participantIds.includes(senderId) &&
          c.participantIds.includes(receiverId)
      );
      
      let updatedConversations = [...conversations];
      
      if (!conversation) {
        conversation = {
          id: `conv${Date.now()}`,
          participantIds: [senderId, receiverId],
          unreadCount: 1,
        };
        
        updatedConversations = [...conversations, conversation];
      } else {
        updatedConversations = conversations.map((c) =>
          c.id === conversation!.id
            ? {
                ...c,
                lastMessage: newMessage,
                unreadCount: senderId === receiverId ? 0 : c.unreadCount + 1,
              }
            : c
        );
      }
      
      const updatedMessages = [...messages, newMessage];
      
      setConversations(updatedConversations);
      setMessages(updatedMessages);
      setIsLoading(false);
      
      await saveToStorage(updatedConversations, updatedMessages);
    } catch {
      setError("Failed to send message");
      setIsLoading(false);
    }
  }, [conversations, messages, saveToStorage]);

  const markConversationAsRead = useCallback(async (conversationId: string) => {
    if (!conversationId.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 500);
      });
      
      const conversation = conversations.find((c) => c.id === conversationId);
      
      if (conversation) {
        const updatedConversations = conversations.map((c) =>
          c.id === conversationId ? { ...c, unreadCount: 0 } : c
        );
        
        const updatedMessages = messages.map((msg) =>
          conversation.participantIds.includes(msg.senderId) &&
          conversation.participantIds.includes(msg.receiverId)
            ? { ...msg, read: true }
            : msg
        );
        
        setConversations(updatedConversations);
        setMessages(updatedMessages);
        
        await saveToStorage(updatedConversations, updatedMessages);
      }
      
      setIsLoading(false);
    } catch {
      setError("Failed to mark conversation as read");
      setIsLoading(false);
    }
  }, [conversations, messages, saveToStorage]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return useMemo(() => ({
    conversations,
    messages,
    currentConversationMessages,
    isLoading,
    error,
    fetchConversations,
    fetchMessages,
    sendMessage,
    markConversationAsRead,
    clearError,
  }), [
    conversations,
    messages,
    currentConversationMessages,
    isLoading,
    error,
    fetchConversations,
    fetchMessages,
    sendMessage,
    markConversationAsRead,
    clearError,
  ]);
});