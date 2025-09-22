import { Conversation, Message } from "@/types";
import { mockUsers } from "./users";

export const mockMessages: Message[] = [
  {
    id: "msg1",
    senderId: "user1", // John (owner)
    receiverId: "user2", // Anna
    content: "Hi Anna, have you finished vacuuming the living room?",
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    read: true,
  },
  {
    id: "msg2",
    senderId: "user2", // Anna
    receiverId: "user1", // John
    content: "Yes, I just finished. I also dusted the shelves.",
    timestamp: new Date(Date.now() - 3300000).toISOString(), // 55 minutes ago
    read: true,
  },
  {
    id: "msg3",
    senderId: "user1", // John
    receiverId: "user2", // Anna
    content: "Great! Thank you for the extra effort.",
    timestamp: new Date(Date.now() - 3000000).toISOString(), // 50 minutes ago
    read: true,
  },
  {
    id: "msg4",
    senderId: "user1", // John
    receiverId: "user3", // Maria
    content: "Maria, can you please clean the kitchen tomorrow?",
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    read: false,
  },
  {
    id: "msg5",
    senderId: "user3", // Maria
    receiverId: "user1", // John
    content: "Sure, I'll do it first thing in the morning.",
    timestamp: new Date(Date.now() - 5400000).toISOString(), // 1.5 hours ago
    read: true,
  },
  {
    id: "msg6",
    senderId: "user1", // John
    receiverId: "user4", // Robert
    content: "Robert, don't forget to water the plants today.",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    read: true,
  },
  {
    id: "msg7",
    senderId: "user4", // Robert
    receiverId: "user1", // John
    content: "I already did it this morning. All plants are watered.",
    timestamp: new Date(Date.now() - 82800000).toISOString(), // 23 hours ago
    read: true,
  },
  {
    id: "msg8",
    senderId: "user1", // John
    receiverId: "user4", // Robert
    content: "Perfect, thank you!",
    timestamp: new Date(Date.now() - 79200000).toISOString(), // 22 hours ago
    read: false,
  },
];

export const mockConversations: Conversation[] = [
  {
    id: "conv1",
    participantIds: ["user1", "user2"], // John and Anna
    lastMessage: mockMessages[2],
    unreadCount: 0,
  },
  {
    id: "conv2",
    participantIds: ["user1", "user3"], // John and Maria
    lastMessage: mockMessages[4],
    unreadCount: 1,
  },
  {
    id: "conv3",
    participantIds: ["user1", "user4"], // John and Robert
    lastMessage: mockMessages[7],
    unreadCount: 1,
  },
];

export const getConversationMessages = (conversationId: string) => {
  const conversation = mockConversations.find(conv => conv.id === conversationId);
  if (!conversation) return [];

  return mockMessages.filter(
    msg =>
      conversation.participantIds.includes(msg.senderId) &&
      conversation.participantIds.includes(msg.receiverId)
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

export const getConversationByParticipants = (userId1: string, userId2: string) => {
  return mockConversations.find(
    conv =>
      conv.participantIds.includes(userId1) && conv.participantIds.includes(userId2)
  );
};

export const getUserConversations = (userId: string) => {
  return mockConversations
    .filter(conv => conv.participantIds.includes(userId))
    .sort((a, b) => {
      if (!a.lastMessage || !b.lastMessage) return 0;
      return (
        new Date(b.lastMessage.timestamp).getTime() -
        new Date(a.lastMessage.timestamp).getTime()
      );
    });
};