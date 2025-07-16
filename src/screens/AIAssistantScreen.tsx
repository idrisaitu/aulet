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
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../navigation/types';

import { Card } from '../components/ui/Card';

type Props = NativeStackScreenProps<MainTabParamList, 'AIAssistant'>;

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AIAssistantScreen: React.FC<Props> = ({ navigation }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Add welcome message
    const welcomeMessage: Message = {
      id: '1',
      text: 'Привет! Я ваш семейный ИИ помощник. Задавайте любые вопросы о семейных делах, планировании событий или отношениях!',
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  const suggestions = [
    'Семейные советы',
    'Планирование событий',
    'Советы по отношениям',
    'Уход за детьми',
  ];

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage.text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes('семья') || input.includes('отбасы') || input.includes('family')) {
      return 'Семейные отношения очень важны. Старайтесь открыто общаться друг с другом и проводить время вместе. Организуйте общие традиции и мероприятия.';
    }

    if (input.includes('событие') || input.includes('іс-шара') || input.includes('event')) {
      return 'Для планирования семейных событий: 1) Учтите пожелания всех членов 2) Подготовьтесь заранее 3) Распределите обязанности 4) Создайте веселую атмосферу!';
    }

    if (input.includes('дети') || input.includes('бала') || input.includes('child')) {
      return 'В воспитании детей важны терпение и любовь. Слушайте их, хвалите и будьте хорошим примером. Обучайте через игру.';
    }

    if (input.includes('календарь') || input.includes('күнтізбе') || input.includes('calendar')) {
      return 'Используйте семейный календарь, чтобы не забывать важные даты: дни рождения, праздники, визиты к врачу. Создайте общий календарь, который могут видеть все члены семьи.';
    }

    return 'Извините, сейчас не могу ответить. Попробуйте позже.';
  };

  const handleSuggestionPress = (suggestion: string) => {
    setInputText(suggestion);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessageContainer : styles.aiMessageContainer
    ]}>
      <Card style={[
        styles.messageCard,
        item.isUser ? styles.userMessageCard : styles.aiMessageCard
      ]}>
        {!item.isUser && (
          <View style={styles.aiHeader}>
            <View style={styles.aiAvatar}>
              <Ionicons name="sparkles" size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.aiName}>ИИ Помощник</Text>
          </View>
        )}
        <Text style={[
          styles.messageText,
          item.isUser ? styles.userMessageText : styles.aiMessageText
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.timeText,
          item.isUser ? styles.userTimeText : styles.aiTimeText
        ]}>
          {formatTime(item.timestamp)}
        </Text>
      </Card>
    </View>
  );

  const renderTypingIndicator = () => (
    <View style={styles.aiMessageContainer}>
      <Card style={styles.aiMessageCard}>
        <View style={styles.aiHeader}>
          <View style={styles.aiAvatar}>
            <Ionicons name="sparkles" size={16} color="#FFFFFF" />
          </View>
          <Text style={styles.aiName}>ИИ Помощник</Text>
        </View>
        <Text style={styles.typingText}>Думаю...</Text>
      </Card>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>ИИ Помощник</Text>
          <Text style={styles.subtitle}>Семейный помощник</Text>
        </View>
        <View style={styles.aiIcon}>
          <Ionicons name="sparkles" size={24} color="#228B22" />
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        ListFooterComponent={isTyping ? renderTypingIndicator : null}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      {/* Suggestions */}
      {messages.length <= 1 && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Предложения:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => handleSuggestionPress(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Input */}
      <View style={styles.inputContainer}>
        <Card style={styles.inputCard}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              placeholder="Спросите что угодно о семье..."
              placeholderTextColor="#6B8E23"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            
            <TouchableOpacity 
              style={[
                styles.sendButton,
                inputText.trim() ? styles.sendButtonActive : styles.sendButtonInactive
              ]}
              onPress={handleSend}
              disabled={!inputText.trim() || isTyping}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={inputText.trim() ? "#FFFFFF" : "#90EE90"} 
              />
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2D5016',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B8E23',
    marginTop: 2,
  },
  aiIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0FFF0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  messageContainer: {
    marginVertical: 4,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  aiMessageContainer: {
    alignItems: 'flex-start',
  },
  messageCard: {
    maxWidth: '85%',
    padding: 12,
  },
  userMessageCard: {
    backgroundColor: '#228B22',
  },
  aiMessageCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8F5E8',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#228B22',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  aiName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B8E23',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  aiMessageText: {
    color: '#2D5016',
  },
  timeText: {
    fontSize: 11,
    alignSelf: 'flex-end',
  },
  userTimeText: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  aiTimeText: {
    color: '#6B8E23',
  },
  typingText: {
    fontSize: 16,
    color: '#6B8E23',
    fontStyle: 'italic',
  },
  suggestionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D5016',
    marginBottom: 12,
  },
  suggestionChip: {
    backgroundColor: '#F0FFF0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E8F5E8',
  },
  suggestionText: {
    fontSize: 14,
    color: '#228B22',
    fontWeight: '500',
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 12,
  },
  inputCard: {
    padding: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#2D5016',
    maxHeight: 100,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: '#228B22',
  },
  sendButtonInactive: {
    backgroundColor: '#F0F0F0',
  },
});

export default AIAssistantScreen;
