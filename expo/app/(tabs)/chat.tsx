import React, { useEffect } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { MessageSquare } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import { mockUsers } from "@/mocks/users";

export default function ChatScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { conversations, fetchConversations, isLoading } = useChatStore();

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleRefresh = () => {
    fetchConversations();
  };

  const getConversationPartner = (participantIds: string[]) => {
    const partnerId = participantIds.find(id => id !== user?.id);
    return mockUsers.find(u => u.id === partnerId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={typography.h2}>Messages</Text>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const partner = getConversationPartner(item.participantIds);
          if (!partner) return null;

          return (
            <TouchableOpacity
              onPress={() => router.push(`/chat/${item.id}`)}
              activeOpacity={0.7}
            >
              <Card style={styles.conversationCard}>
                <View style={styles.conversationContainer}>
                  <Image
                    source={{ uri: partner.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" }}
                    style={styles.avatar}
                  />
                  <View style={styles.conversationContent}>
                    <View style={styles.conversationHeader}>
                      <Text style={typography.h4}>{partner.name}</Text>
                      {item.lastMessage && (
                        <Text style={styles.timestamp}>
                          {new Date(item.lastMessage.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                      )}
                    </View>
                    <Text
                      style={[
                        typography.body,
                        styles.lastMessage,
                        item.unreadCount > 0 && styles.unreadMessage,
                      ]}
                      numberOfLines={1}
                    >
                      {item.lastMessage?.content || "No messages yet"}
                    </Text>
                  </View>
                  {item.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadBadgeText}>
                        {item.unreadCount}
                      </Text>
                    </View>
                  )}
                </View>
              </Card>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            title="No Conversations"
            description="You don't have any conversations yet"
            icon={<MessageSquare size={48} color={colors.gray[400]} />}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  listContent: {
    padding: 16,
  },
  conversationCard: {
    padding: 12,
  },
  conversationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: colors.gray[500],
  },
  lastMessage: {
    color: colors.gray[600],
  },
  unreadMessage: {
    color: colors.text,
    fontWeight: "500",
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  unreadBadgeText: {
    color: colors.card,
    fontSize: 12,
    fontWeight: "600",
  },
});