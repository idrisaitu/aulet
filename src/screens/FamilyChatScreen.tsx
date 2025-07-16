import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useApp, Message } from '../context/AppContext';
import { Avatar } from '../components/ui/Avatar';
import { theme } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'FamilyChat'>;

interface ChatMessage extends Message {
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  reactions?: { emoji: string; users: string[] }[];
  replyTo?: string;
}

export const FamilyChatScreen: React.FC<Props> = ({ navigation, route }) => {
  const { familyId } = route.params;
  const { families, messages, sendMessage, user } = useApp();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;

  const family = families.find(f => f.id === familyId);
  const familyMessages = messages.filter(m => m.familyId === familyId);

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    if (familyMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [familyMessages]);

  useEffect(() => {
    // Animate typing indicator
    if (typingUsers.length > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      typingAnimation.setValue(0);
    }
  }, [typingUsers]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const messageText = replyingTo 
      ? `@${replyingTo.senderName}: ${inputText.trim()}`
      : inputText.trim();

    sendMessage(familyId, messageText);
    setInputText('');
    setReplyingTo(null);
    setIsTyping(false);
  };

  const handleInputChange = (text: string) => {
    setInputText(text);
    
    // Simulate typing indicator
    if (!isTyping && text.length > 0) {
      setIsTyping(true);
      // In real app, send typing status to other users
    } else if (isTyping && text.length === 0) {
      setIsTyping(false);
    }
  };

  const handleReply = (message: ChatMessage) => {
    setReplyingTo(message);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    // In real app, this would update the message with reaction
    Alert.alert('Реакция', `Добавлена реакция ${emoji} к сообщению`);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('kk-KZ', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isMyMessage = (message: Message) => {
    return message.senderId === user?.id;
  };

  const renderMessage = ({ item, index }: { item: ChatMessage; index: number }) => {
    const isMe = isMyMessage(item);
    const prevMessage = index > 0 ? familyMessages[index - 1] : null;
    const showAvatar = !isMe && (!prevMessage || prevMessage.senderId !== item.senderId);
    const showName = !isMe && showAvatar;

    return (
      <View style={[styles.messageContainer, isMe && styles.myMessageContainer]}>
        {showAvatar && (
          <Avatar
            name={item.senderName}
            size="sm"
            style={styles.messageAvatar}
          />
        )}
        
        <View style={[styles.messageContent, !showAvatar && !isMe && styles.messageContentWithoutAvatar]}>
          {showName && (
            <Text style={styles.senderName}>{item.senderName}</Text>
          )}
          
          <TouchableOpacity
            style={[
              styles.messageBubble,
              isMe ? styles.myMessageBubble : styles.otherMessageBubble,
            ]}
            onLongPress={() => handleReply(item)}
          >
            <Text style={[
              styles.messageText,
              isMe ? styles.myMessageText : styles.otherMessageText,
            ]}>
              {item.text}
            </Text>
            
            <View style={styles.messageFooter}>
              <Text style={[
                styles.messageTime,
                isMe ? styles.myMessageTime : styles.otherMessageTime,
              ]}>
                {formatTime(item.timestamp)}
              </Text>
              
              {isMe && (
                <Ionicons
                  name="checkmark-done"
                  size={14}
                  color={theme.colors.primary[300]}
                  style={styles.messageStatus}
                />
              )}
            </View>
          </TouchableOpacity>
          
          {/* Quick reactions */}
          <View style={styles.quickReactions}>
            {['❤️', '👍', '😂', '😮', '😢', '😡'].map((emoji) => (
              <TouchableOpacity
                key={emoji}
                style={styles.reactionButton}
                onPress={() => handleReaction(item.id, emoji)}
              >
                <Text style={styles.reactionEmoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (typingUsers.length === 0) return null;

    return (
      <View style={styles.typingContainer}>
        <Avatar name="Typing" size="sm" style={styles.messageAvatar} />
        <View style={styles.typingBubble}>
          <Animated.View style={[styles.typingDots, { opacity: typingAnimation }]}>
            <View style={styles.typingDot} />
            <View style={styles.typingDot} />
            <View style={styles.typingDot} />
          </Animated.View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Avatar
            name={family?.name}
            source={family?.avatar}
            size="sm"
            showOnlineStatus
            isOnline={true}
          />
          <View style={styles.headerText}>
            <Text style={styles.familyName}>{family?.name}</Text>
            <Text style={styles.memberCount}>
              {family?.members.length} участников • онлайн
            </Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="videocam" size={24} color={theme.colors.primary[500]} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="call" size={24} color={theme.colors.primary[500]} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={familyMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderTypingIndicator}
      />

      {/* Reply preview */}
      {replyingTo && (
        <View style={styles.replyPreview}>
          <View style={styles.replyContent}>
            <Text style={styles.replyLabel}>Жауап беру:</Text>
            <Text style={styles.replyText} numberOfLines={1}>
              {replyingTo.text}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.replyClose}
            onPress={() => setReplyingTo(null)}
          >
            <Ionicons name="close" size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        </View>
      )}

      {/* Input */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Ionicons name="add" size={24} color={theme.colors.primary[500]} />
        </TouchableOpacity>
        
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={handleInputChange}
            placeholder="Напишите сообщение..."
            placeholderTextColor={theme.colors.text.tertiary}
            multiline
            maxLength={1000}
          />
          
          <TouchableOpacity style={styles.emojiButton}>
            <Ionicons name="happy" size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={!inputText.trim()}
        >
          <Ionicons
            name="send"
            size={20}
            color={inputText.trim() ? theme.colors.text.inverse : theme.colors.text.tertiary}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    ...theme.shadows.sm,
  },
  backButton: {
    marginRight: theme.spacing.md,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: theme.spacing.md,
  },
  familyName: {
    ...theme.typography.styles.h4,
    color: theme.colors.text.primary,
  },
  memberCount: {
    ...theme.typography.styles.caption,
    color: theme.colors.text.secondary,
  },
  headerAction: {
    marginLeft: theme.spacing.md,
    padding: theme.spacing.xs,
  },

  // Messages
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: theme.spacing.md,
  },
  messageContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  messageAvatar: {
    marginRight: theme.spacing.sm,
  },
  messageContent: {
    maxWidth: '75%',
  },
  messageContentWithoutAvatar: {
    marginLeft: theme.spacing.avatar.sm + theme.spacing.sm,
  },
  senderName: {
    ...theme.typography.styles.chatName,
    color: theme.colors.primary[600],
    marginBottom: theme.spacing.xs,
  },
  messageBubble: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.spacing.radius.lg,
    marginBottom: theme.spacing.xs,
  },
  myMessageBubble: {
    backgroundColor: theme.colors.chat.myMessage,
    borderBottomRightRadius: theme.spacing.radius.sm,
  },
  otherMessageBubble: {
    backgroundColor: theme.colors.chat.otherMessage,
    borderBottomLeftRadius: theme.spacing.radius.sm,
  },
  messageText: {
    ...theme.typography.styles.chatMessage,
  },
  myMessageText: {
    color: theme.colors.chat.myMessageText,
  },
  otherMessageText: {
    color: theme.colors.chat.otherMessageText,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.xs,
  },
  messageTime: {
    ...theme.typography.styles.chatTime,
  },
  myMessageTime: {
    color: theme.colors.primary[200],
  },
  otherMessageTime: {
    color: theme.colors.text.tertiary,
  },
  messageStatus: {
    marginLeft: theme.spacing.xs,
  },

  // Quick reactions
  quickReactions: {
    flexDirection: 'row',
    marginTop: theme.spacing.xs,
  },
  reactionButton: {
    marginRight: theme.spacing.xs,
  },
  reactionEmoji: {
    fontSize: 16,
  },

  // Typing indicator
  typingContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  typingBubble: {
    backgroundColor: theme.colors.chat.otherMessage,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.spacing.radius.lg,
    borderBottomLeftRadius: theme.spacing.radius.sm,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.text.tertiary,
    marginHorizontal: 2,
  },

  // Reply preview
  replyPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background.tertiary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  replyContent: {
    flex: 1,
  },
  replyLabel: {
    ...theme.typography.styles.caption,
    color: theme.colors.primary[600],
    fontWeight: '600',
  },
  replyText: {
    ...theme.typography.styles.bodySmall,
    color: theme.colors.text.secondary,
  },
  replyClose: {
    padding: theme.spacing.xs,
  },

  // Input
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  attachButton: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.spacing.radius.xl,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    maxHeight: 100,
  },
  textInput: {
    flex: 1,
    ...theme.typography.styles.body,
    color: theme.colors.text.primary,
    textAlignVertical: 'center',
  },
  emojiButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.sm,
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.neutral[300],
  },
});

export default FamilyChatScreen;
