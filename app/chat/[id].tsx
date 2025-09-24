import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Image
} from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Send } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { ChatBubble } from "@/components/ChatBubble";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import { mockUsers } from "@/mocks/users";

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { 
    conversations, 
    currentConversationMessages,
    fetchMessages, 
    sendMessage, 
    markConversationAsRead,
    isLoading 
  } = useChatStore();
  
  const [messageText, setMessageText] = useState("");
  const flatListRef = useRef<FlatList>(null);
  
  const conversation = conversations.find(c => c.id === id);
  const partner = conversation ? mockUsers.find(
    u => conversation.participantIds.includes(u.id) && u.id !== user?.id
  ) : null;

  const handleFetchMessages = useCallback(async () => {
    if (conversation) {
      await fetchMessages(conversation.id);
      await markConversationAsRead(conversation.id);
    }
  }, [conversation, fetchMessages, markConversationAsRead]);

  useEffect(() => {
    handleFetchMessages();
  }, [handleFetchMessages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !user || !partner) return;
    
    await sendMessage(user.id, partner.id, messageText.trim());
    setMessageText("");
    fetchMessages(conversation!.id);
    
    // Scroll to bottom after sending
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  if (!conversation || !partner) {
    return (
      <View style={styles.container}>
        <Text style={typography.h3}>Conversation not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: partner.name,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <Image
              source={{ uri: partner.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" }}
              style={styles.headerAvatar}
            />
          ),
        }} 
      />
      <KeyboardAvoidingView
        style={[styles.container, { paddingBottom: insets.bottom }]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={currentConversationMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatBubble
              message={item}
              isCurrentUser={item.senderId === user?.id}
            />
          )}
          contentContainerStyle={styles.messagesList}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={messageText}
            onChangeText={setMessageText}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !messageText.trim() && styles.disabledSendButton,
            ]}
            onPress={handleSendMessage}
            disabled={!messageText.trim() || isLoading}
          >
            <Send size={20} color={colors.card} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: 4,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "500",
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    backgroundColor: colors.card,
  },
  input: {
    flex: 1,
    backgroundColor: colors.gray[100],
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  disabledSendButton: {
    backgroundColor: colors.gray[400],
  },
});