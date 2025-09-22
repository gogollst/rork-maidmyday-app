import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { Message } from "@/types";

interface ChatBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

export const ChatBubble = ({ message, isCurrentUser }: ChatBubbleProps) => {
  return (
    <View
      style={[
        styles.container,
        isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
        ]}
      >
        <Text
          style={[
            typography.body,
            isCurrentUser ? styles.currentUserText : styles.otherUserText,
          ]}
        >
          {message.content}
        </Text>
      </View>
      <Text
        style={[
          styles.timestamp,
          isCurrentUser ? styles.currentUserTimestamp : styles.otherUserTimestamp,
        ]}
      >
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: "80%",
    marginVertical: 4,
  },
  currentUserContainer: {
    alignSelf: "flex-end",
  },
  otherUserContainer: {
    alignSelf: "flex-start",
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  currentUserBubble: {
    backgroundColor: colors.primary,
  },
  otherUserBubble: {
    backgroundColor: colors.gray[200],
  },
  currentUserText: {
    color: colors.card,
  },
  otherUserText: {
    color: colors.text,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
  currentUserTimestamp: {
    color: colors.gray[600],
    alignSelf: "flex-end",
  },
  otherUserTimestamp: {
    color: colors.gray[600],
    alignSelf: "flex-start",
  },
});