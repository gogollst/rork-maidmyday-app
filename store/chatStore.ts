import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Conversation, Message } from '@/types';
import { mockConversations, mockMessages } from '@/mocks/messages';

const useStorage = () => {
  const getItem = useCallback(async (key: string): Promise<string | null> => {
    try {
      const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  }, []);

  const setItem = useCallback(async (key: string, value: string): Promise<void> => {
    try {
      const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
      await AsyncStorage.setItem(key, value);
    } catch {
      // Ignore storage errors
    }
  }, []);

  return { getItem, setItem };
};

export const [ChatProvider, useChat] = createContextHook(() => {
  const [conversations, setConversations] = useState<Conversation[]>([...mockConversations]);
  const [messages, setMessages] = useState<Message[]>([...mockMessages]);
  const [currentConversationMessages, setCurrentConversationMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const storage = useStorage();

  const loadStoredData = useCallback(async () => {
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
  }, [storage]);

  useEffect(() => {
    loadStoredData();
  }, [loadStoredData]);

  const saveToStorage = useCallback(async (newConversations: Conversation[], newMessages: Message[]) => {
    if (!Array.isArray(newConversations) || !Array.isArray(newMessages)) return;
    
    try {
      await storage.setItem('chat-conversations', JSON.stringify(newConversations));
      await storage.setItem('chat-messages', JSON.stringify(newMessages));
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
      setError('Failed to fetch conversations');
      setIsLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!conversationId || !conversationId.trim()) return;
    if (conversationId.length > 100) return;
    const sanitizedId = conversationId.trim();

    setIsLoading(true);
    setError(null);

    try {
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 500);
      });

      const conversation = conversations.find((c) => c.id === sanitizedId);

      if (!conversation) {
        throw new Error('Conversation not found');
      }

      const conversationMessages = messages.filter(
        (msg) =>
          conversation.participantIds.includes(msg.senderId) &&
          conversation.participantIds.includes(msg.receiverId)
      );

      setCurrentConversationMessages(conversationMessages);
      setIsLoading(false);
    } catch {
      setError('Failed to fetch messages');
      setCurrentConversationMessages([]);
      setIsLoading(false);
    }
  }, [conversations, messages]);

  const sendMessage = useCallback(async (senderId: string, receiverId: string, content: string) => {
    if (!senderId || !senderId.trim()) return;
    if (!receiverId || !receiverId.trim()) return;
    if (!content || !content.trim()) return;
    if (senderId.length > 100) return;
    if (receiverId.length > 100) return;
    if (content.length > 1000) return;

    const sanitizedSenderId = senderId.trim();
    const sanitizedReceiverId = receiverId.trim();
    const sanitizedContent = content.trim();

    setIsLoading(true);
    setError(null);

    try {
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 500);
      });

      const newMessage: Message = {
        id: `msg${Date.now()}`,
        senderId: sanitizedSenderId,
        receiverId: sanitizedReceiverId,
        content: sanitizedContent,
        timestamp: new Date().toISOString(),
        read: false,
      };

      let conversation = conversations.find(
        (c) =>
          c.participantIds.includes(sanitizedSenderId) &&
          c.participantIds.includes(sanitizedReceiverId)
      );

      let updatedConversations = [...conversations];

      if (!conversation) {
        conversation = {
          id: `conv${Date.now()}`,
          participantIds: [sanitizedSenderId, sanitizedReceiverId],
          unreadCount: 1,
        };

        updatedConversations = [...conversations, conversation];
      } else {
        updatedConversations = conversations.map((c) =>
          c.id === conversation!.id
            ? {
                ...c,
                lastMessage: newMessage,
                unreadCount: sanitizedSenderId === sanitizedReceiverId ? 0 : c.unreadCount + 1,
              }
            : c
        );
      }

      const updatedMessages = [...messages, newMessage];

      setConversations(updatedConversations);
      setMessages(updatedMessages);
      await saveToStorage(updatedConversations, updatedMessages);
      setIsLoading(false);
    } catch {
      setError('Failed to send message');
      setIsLoading(false);
    }
  }, [conversations, messages, saveToStorage]);

  const markConversationAsRead = useCallback(async (conversationId: string) => {
    if (!conversationId || !conversationId.trim()) return;
    if (conversationId.length > 100) return;
    const sanitizedId = conversationId.trim();

    setIsLoading(true);
    setError(null);

    try {
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 500);
      });

      const conversation = conversations.find((c) => c.id === sanitizedId);

      if (conversation) {
        const updatedConversations = conversations.map((c) =>
          c.id === sanitizedId ? { ...c, unreadCount: 0 } : c
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
      setError('Failed to mark conversation as read');
      setIsLoading(false);
    }
  }, [conversations, messages, saveToStorage]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo(() => ({
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

  return value;
});