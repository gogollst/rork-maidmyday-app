import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Conversation, Message } from "@/types";
import { mockConversations, mockMessages } from "@/mocks/messages";

interface ChatState {
  conversations: Conversation[];
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<Message[]>;
  sendMessage: (senderId: string, receiverId: string, content: string) => Promise<void>;
  markConversationAsRead: (conversationId: string) => Promise<void>;
  clearError: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [...mockConversations],
      messages: [...mockMessages],
      isLoading: false,
      error: null,

      fetchConversations: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          // In a real app, we would fetch conversations from the server
          // For this prototype, we'll use the mock data
          set({ conversations: [...mockConversations], isLoading: false });
        } catch (error) {
          set({
            error: "Failed to fetch conversations",
            isLoading: false,
          });
        }
      },

      fetchMessages: async (conversationId: string): Promise<Message[]> => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          const conversation = get().conversations.find(
            (c) => c.id === conversationId
          );
          
          if (!conversation) {
            throw new Error("Conversation not found");
          }
          
          // Filter messages for this conversation
          const conversationMessages = get().messages.filter(
            (msg) =>
              conversation.participantIds.includes(msg.senderId) &&
              conversation.participantIds.includes(msg.receiverId)
          );
          
          set({ isLoading: false });
          
          return conversationMessages;
        } catch (error) {
          set({
            error: "Failed to fetch messages",
            isLoading: false,
          });
          return [];
        }
      },

      sendMessage: async (senderId, receiverId, content) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          // Create new message
          const newMessage: Message = {
            id: `msg${Date.now()}`,
            senderId,
            receiverId,
            content,
            timestamp: new Date().toISOString(),
            read: false,
          };
          
          // Find or create conversation
          let conversation = get().conversations.find(
            (c) =>
              c.participantIds.includes(senderId) &&
              c.participantIds.includes(receiverId)
          );
          
          if (!conversation) {
            // Create new conversation
            conversation = {
              id: `conv${Date.now()}`,
              participantIds: [senderId, receiverId],
              unreadCount: 1,
            };
            
            set((state) => ({
              conversations: [...state.conversations, conversation!],
            }));
          } else {
            // Update existing conversation
            set((state) => ({
              conversations: state.conversations.map((c) =>
                c.id === conversation!.id
                  ? {
                      ...c,
                      lastMessage: newMessage,
                      unreadCount: senderId === receiverId ? 0 : c.unreadCount + 1,
                    }
                  : c
              ),
            }));
          }
          
          // Add message to messages array
          set((state) => ({
            messages: [...state.messages, newMessage],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: "Failed to send message",
            isLoading: false,
          });
        }
      },

      markConversationAsRead: async (conversationId) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          // Update conversation unread count
          set((state) => ({
            conversations: state.conversations.map((c) =>
              c.id === conversationId ? { ...c, unreadCount: 0 } : c
            ),
            isLoading: false,
          }));
          
          // Mark messages as read
          const conversation = get().conversations.find(
            (c) => c.id === conversationId
          );
          
          if (conversation) {
            set((state) => ({
              messages: state.messages.map((msg) =>
                conversation.participantIds.includes(msg.senderId) &&
                conversation.participantIds.includes(msg.receiverId)
                  ? { ...msg, read: true }
                  : msg
              ),
            }));
          }
        } catch (error) {
          set({
            error: "Failed to mark conversation as read",
            isLoading: false,
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "chat-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);