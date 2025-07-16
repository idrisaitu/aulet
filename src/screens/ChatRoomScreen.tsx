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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useApp, Message } from '../context/AppContext';
import { Card } from '../components/ui/Card';

type Props = NativeStackScreenProps<RootStackParamList, 'ChatRoom'>;

const ChatRoomScreen: React.FC<Props> = ({ route, navigation }) => {
  const { familyId, familyName } = route.params;
  const { messages, sendMessage, user, families } = useApp();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const familyMessages = messages.filter(msg => msg.familyId === familyId);
  const family = families.find(f => f.id === familyId);

  useEffect(() => {
    navigation.setOptions({
      title: familyName,
      headerStyle: {
        backgroundColor: '#FFFFFF',
      },
      headerTintColor: '#2D5016',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => Alert.alert('Мәліметтер', 'Отбасы мәліметтері')}
        >
          <Ionicons name="information-circle-outline" size={24} color="#228B22" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, familyName]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    sendMessage(familyId, inputText.trim());
    setInputText('');
    setIsTyping(false);

    // Scroll to bottom after sending
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleInputChange = (text: string) => {
    setInputText(text);
    setIsTyping(text.length > 0);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('kk-KZ', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Бүгін';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Кеше';
    }
    
    return messageDate.toLocaleDateString('kk-KZ');
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isMyMessage = item.senderId === user?.id;
    const showDate = index === 0 || 
      formatDate(item.timestamp) !== formatDate(familyMessages[index - 1]?.timestamp);

    return (
      <View>
        {showDate && (
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>
          </View>
        )}
        <View style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer
        ]}>
          <Card style={[
            styles.messageCard,
            isMyMessage ? styles.myMessageCard : styles.otherMessageCard
          ]}>
            {!isMyMessage && (
              <Text style={styles.senderName}>{item.senderName}</Text>
            )}
            <Text style={[
              styles.messageText,
              isMyMessage ? styles.myMessageText : styles.otherMessageText
            ]}>
              {item.text}
            </Text>
            <Text style={[
              styles.timeText,
              isMyMessage ? styles.myTimeText : styles.otherTimeText
            ]}>
              {formatTime(item.timestamp)}
            </Text>
          </Card>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="chatbubbles-outline" size={64} color="#90EE90" />
      <Text style={styles.emptyStateTitle}>Хабарлар жоқ</Text>
      <Text style={styles.emptyStateSubtitle}>
        {familyName} отбасысымен алғашқы хабарыңызды жіберіңіз!
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        ref={flatListRef}
        data={familyMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        ListEmptyComponent={renderEmptyState}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      {/* Typing Indicator */}
      {family && family.members.length > 1 && (
        <View style={styles.typingContainer}>
          <Text style={styles.typingText}>
            {family.members.find(m => m.id !== user?.id)?.name} теріп жатыр...
          </Text>
        </View>
      )}

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <Card style={styles.inputCard}>
          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.attachButton}>
              <Ionicons name="add" size={24} color="#228B22" />
            </TouchableOpacity>
            
            <TextInput
              style={styles.textInput}
              placeholder="Хабар жазыңыз..."
              placeholderTextColor="#6B8E23"
              value={inputText}
              onChangeText={handleInputChange}
              multiline
              maxLength={1000}
            />
            
            <TouchableOpacity 
              style={[
                styles.sendButton,
                inputText.trim() ? styles.sendButtonActive : styles.sendButtonInactive
              ]}
              onPress={handleSend}
              disabled={!inputText.trim()}
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
  headerButton: {
    padding: 8,
    marginRight: 8,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    flexGrow: 1,
  },
  dateContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateText: {
    fontSize: 12,
    color: '#6B8E23',
    backgroundColor: '#F0FFF0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  messageContainer: {
    marginVertical: 4,
  },
  myMessageContainer: {
    alignItems: 'flex-end',
  },
  otherMessageContainer: {
    alignItems: 'flex-start',
  },
  messageCard: {
    maxWidth: '80%',
    padding: 12,
  },
  myMessageCard: {
    backgroundColor: '#228B22',
  },
  otherMessageCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8F5E8',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B8E23',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 4,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#2D5016',
  },
  timeText: {
    fontSize: 11,
    alignSelf: 'flex-end',
  },
  myTimeText: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherTimeText: {
    color: '#6B8E23',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D5016',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#6B8E23',
    textAlign: 'center',
    lineHeight: 22,
  },
  typingContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  typingText: {
    fontSize: 14,
    color: '#6B8E23',
    fontStyle: 'italic',
  },
  inputContainer: {
    paddingHorizontal: 16,
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
  attachButton: {
    padding: 8,
    marginRight: 8,
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

export default ChatRoomScreen;
