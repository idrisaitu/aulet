import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../navigation/types';
import { useApp, AIMessage } from '../context/AppContext';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { theme } from '../theme';

type Props = NativeStackScreenProps<MainTabParamList, 'AIAssistant'>;

const FamilyAIAssistantScreen: React.FC<Props> = () => {
  const { aiMessages, sendAIMessage, clearAIHistory, families } = useApp();
  const [inputText, setInputText] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    if (aiMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [aiMessages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) {
      Alert.alert('Ошибка', 'Введите сообщение');
      return;
    }

    setIsLoading(true);
    try {
      await sendAIMessage(inputText.trim(), selectedFamily);
      setInputText('');
    } catch (error) {
      Alert.alert('Қате', 'Хабар жіберу кезінде қате орын алды');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Тарихты тазалау',
      'Барлық хабарларды жою керек пе?',
      [
        { text: 'Жоқ', style: 'cancel' },
        {
          text: 'Иә',
          style: 'destructive',
          onPress: clearAIHistory
        },
      ]
    );
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('kk-KZ', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderMessage = ({ item }: { item: AIMessage }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessage : styles.aiMessage
    ]}>
      {!item.isUser && (
        <Avatar
          name="AI"
          size="sm"
          style={styles.aiAvatar}
        />
      )}

      <View style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.aiBubble
      ]}>
        {!item.isUser && (
          <View style={styles.aiHeader}>
            <Text style={styles.aiName}>ИИ Көмекші</Text>
            <View style={styles.aiStatus}>
              <View style={styles.onlineIndicator} />
              <Text style={styles.statusText}>онлайн</Text>
            </View>
          </View>
        )}

        <Text style={[
          styles.messageText,
          item.isUser ? styles.userText : styles.aiText
        ]}>
          {item.text}
        </Text>

        <View style={styles.messageFooter}>
          <Text style={[
            styles.timestamp,
            item.isUser ? styles.userTimestamp : styles.aiTimestamp
          ]}>
            {formatTimestamp(item.timestamp)}
          </Text>

          {!item.isUser && (
            <View style={styles.aiActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="copy-outline" size={14} color={theme.colors.text.tertiary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="thumbs-up-outline" size={14} color={theme.colors.text.tertiary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="thumbs-down-outline" size={14} color={theme.colors.text.tertiary} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const quickQuestions = [
    'Игры для детей',
    'Семейные традиции',
    'Советы по готовке',
    'Домашнее хозяйство',
    'Общение с детьми',
  ];

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.aiAvatar}>
            <Ionicons name="chatbubbles" size={24} color="#fff" />
          </View>
          <View>
            <Text style={styles.title}>ИИ Помощник</Text>
            <Text style={styles.subtitle}>Семейный консультант</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearHistory}
        >
          <Ionicons name="trash-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {aiMessages.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="chatbubbles-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>Сәлем!</Text>
          <Text style={styles.emptySubtitle}>
            Мен сіздің отбасылық ИИ көмекшіңізбін. Маған кез келген сұрақ қоя аласыз.
          </Text>

          <Text style={styles.quickQuestionsTitle}>Жиі қойылатын сұрақтар:</Text>
          <View style={styles.quickQuestions}>
            {quickQuestions.map((question, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickQuestionButton}
                onPress={() => handleQuickQuestion(question)}
              >
                <Text style={styles.quickQuestionText}>{question}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={aiMessages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Сұрағыңызды жазыңыз..."
          placeholderTextColor="#999"
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={!inputText.trim() || isLoading}
        >
          {isLoading ? (
            <Ionicons name="hourglass-outline" size={20} color="#fff" />
          ) : (
            <Ionicons name="send" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#228B22',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  clearButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  quickQuestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  quickQuestions: {
    width: '100%',
  },
  quickQuestionButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  quickQuestionText: {
    fontSize: 14,
    color: '#228B22',
    textAlign: 'center',
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageContainer: {
    marginVertical: 4,
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
  },
  userMessage: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    marginRight: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.spacing.radius.lg,
    marginBottom: theme.spacing.xs,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  aiName: {
    ...theme.typography.styles.chatName,
    color: theme.colors.primary[600],
    fontWeight: '600',
  },
  aiStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.chat.online,
    marginRight: theme.spacing.xs,
  },
  statusText: {
    ...theme.typography.styles.caption,
    color: theme.colors.text.tertiary,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
  },
  aiActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
  userBubble: {
    backgroundColor: '#228B22',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  aiText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  aiTimestamp: {
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#228B22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
});

export default FamilyAIAssistantScreen;