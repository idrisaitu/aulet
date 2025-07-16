import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Полнофункциональная версия с логином для Android
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentScreen, setCurrentScreen] = useState('chats'); // chats, calendar, ai, profile, tasks, timecapsule

  // Состояния для данных
  const [chats, setChats] = useState([
    { id: 1, name: '👨‍👩‍👧‍👦 Семья Иванов', lastMessage: 'Привет всем! Как дела?', messages: [] },
    { id: 2, name: '👵 Бабушка и дедушка', lastMessage: 'Приезжайте в гости!', messages: [] },
    { id: 3, name: '👶 Детский чат', lastMessage: 'Мама, когда обед?', messages: [] },
  ]);

  const [selectedChatId, setSelectedChatId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [aiMessages, setAiMessages] = useState([
    { id: 1, text: 'Привет! Я ваш семейный ИИ помощник. Задавайте вопросы о семейных делах!', isBot: true }
  ]);
  const [aiInput, setAiInput] = useState('');

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Купить продукты', completed: false, assignee: 'Мама', dueDate: '2024-01-15' },
    { id: 2, title: 'Забрать детей из школы', completed: true, assignee: 'Папа', dueDate: '2024-01-14' },
    { id: 3, title: 'Подготовить ужин', completed: false, assignee: 'Бабушка', dueDate: '2024-01-15' },
  ]);

  const [timeCapsules, setTimeCapsules] = useState([
    { id: 1, title: 'Поздравление с Новым Годом', message: 'С Новым Годом, дорогая семья!', deliveryDate: '2025-01-01', created: '2024-01-10', recipient: 'Всей семье' },
    { id: 2, title: 'День рождения мамы', message: 'Не забудьте поздравить маму!', deliveryDate: '2024-03-15', created: '2024-01-10', recipient: 'Маме' },
    { id: 3, title: 'Напоминание себе', message: 'Помни о своих целях и мечтах!', deliveryDate: '2024-12-31', created: '2024-01-10', recipient: 'Себе в будущем' },
  ]);

  const [events, setEvents] = useState([
    { id: 1, title: 'День рождения мамы', date: '2024-01-15', time: '18:00' },
    { id: 2, title: 'Семейный ужин', date: '2024-01-20', time: '19:00' },
    { id: 3, title: 'Поход в театр', date: '2024-01-25', time: '15:00' },
  ]);

  // Состояния для модальных окон
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showCapsuleForm, setShowCapsuleForm] = useState(false);
  const [showChatForm, setShowChatForm] = useState(false);

  // Состояния для форм
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');

  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('');

  const [newCapsuleTitle, setNewCapsuleTitle] = useState('');
  const [newCapsuleMessage, setNewCapsuleMessage] = useState('');
  const [newCapsuleDate, setNewCapsuleDate] = useState('');
  const [newCapsuleRecipient, setNewCapsuleRecipient] = useState('');

  const [newChatName, setNewChatName] = useState('');
  const [newChatType, setNewChatType] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Список членов семьи для выбора адресата
  const familyMembers = [
    'Всей семье',
    'Маме',
    'Папе',
    'Бабушке',
    'Дедушке',
    'Сыну',
    'Дочери',
    'Брату',
    'Сестре',
    'Себе в будущем'
  ];

  // Типы чатов
  const chatTypes = [
    { id: 'family', name: '👨‍👩‍👧‍👦 Семейный чат', icon: '👨‍👩‍👧‍👦' },
    { id: 'parents', name: '👫 Родители', icon: '👫' },
    { id: 'children', name: '👶 Детский чат', icon: '👶' },
    { id: 'grandparents', name: '👴👵 Бабушки и дедушки', icon: '👴👵' },
    { id: 'siblings', name: '👫 Братья и сестры', icon: '👫' },
    { id: 'custom', name: '💬 Особый чат', icon: '💬' }
  ];

  // Члены семьи для выбора участников чата
  const chatMembers = [
    'Мама',
    'Папа',
    'Бабушка',
    'Дедушка',
    'Сын',
    'Дочь',
    'Брат',
    'Сестра',
    'Тетя',
    'Дядя'
  ];

  const handleLogin = () => {
    try {
      if (!email.trim() || !password.trim()) {
        Alert.alert('Ошибка', 'Заполните все поля');
        return;
      }

      // Моковый логин - любые данные подходят
      setIsLoggedIn(true);
      Alert.alert('Успех!', 'Добро пожаловать в Aulet Family Chat!');
    } catch (error) {
      console.error('Error in handleLogin:', error);
      Alert.alert('Ошибка', 'Произошла ошибка при входе');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Выход',
      'Вы действительно хотите выйти?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Выйти',
          onPress: () => {
            setIsLoggedIn(false);
            setEmail('');
            setPassword('');
            setCurrentScreen('chats');
            setSelectedChatId(null);
            setNewMessage('');
            setAiInput('');
          }
        },
      ]
    );
  };

  // Функции для чатов
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChatId) return;

    const updatedChats = chats.map(chat => {
      if (chat.id === selectedChatId) {
        const newMsg = {
          id: Date.now(),
          text: newMessage,
          sender: 'Вы',
          timestamp: new Date().toLocaleTimeString(),
        };
        return {
          ...chat,
          messages: [...chat.messages, newMsg],
          lastMessage: newMessage,
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setNewMessage('');
    Alert.alert('Успех!', 'Сообщение отправлено');
  };

  const createChat = () => {
    setShowChatForm(true);
    setNewChatName('');
    setNewChatType('family');
    setSelectedMembers([]);
  };

  const toggleMember = (member) => {
    if (selectedMembers.includes(member)) {
      setSelectedMembers(selectedMembers.filter(m => m !== member));
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const saveChat = () => {
    if (!newChatName.trim()) {
      Alert.alert('Ошибка', 'Введите название чата');
      return;
    }

    if (selectedMembers.length === 0) {
      Alert.alert('Ошибка', 'Выберите хотя бы одного участника');
      return;
    }

    const selectedChatType = chatTypes.find(type => type.id === newChatType);
    const chatIcon = selectedChatType ? selectedChatType.icon : '💬';

    const newChat = {
      id: Date.now(),
      name: `${chatIcon} ${newChatName}`,
      lastMessage: 'Чат создан!',
      messages: [{
        id: Date.now(),
        text: `Добро пожаловать в чат "${newChatName}"! Участники: ${selectedMembers.join(', ')}`,
        sender: 'Система',
        timestamp: new Date().toLocaleTimeString(),
      }],
      members: selectedMembers,
      type: newChatType,
      created: new Date().toISOString(),
    };

    setChats([...chats, newChat]);
    setShowChatForm(false);
    Alert.alert('Успех!', `Чат "${newChatName}" создан!`);
  };

  // Функции для ИИ
  const sendAiMessage = () => {
    if (!aiInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: aiInput,
      isBot: false,
    };

    const botResponses = [
      'Отличный вопрос! Давайте разберем это вместе.',
      'Я думаю, что лучший подход здесь - обсудить это с семьей.',
      'Это интересная семейная ситуация. Вот мои рекомендации...',
      'Семейные дела требуют особого внимания. Предлагаю следующее...',
      'Отличная идея! Это поможет укрепить семейные связи.',
    ];

    const botMessage = {
      id: Date.now() + 1,
      text: botResponses[Math.floor(Math.random() * botResponses.length)],
      isBot: true,
    };

    setAiMessages([...aiMessages, userMessage, botMessage]);
    setAiInput('');
  };

  // Функции для задач
  const toggleTask = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const addTask = () => {
    setShowTaskForm(true);
    setNewTaskTitle('');
    setNewTaskAssignee('');
    setNewTaskDate(new Date().toISOString().split('T')[0]);
  };

  const saveTask = () => {
    if (!newTaskTitle.trim()) {
      Alert.alert('Ошибка', 'Введите название задачи');
      return;
    }

    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      completed: false,
      assignee: newTaskAssignee || 'Не назначен',
      dueDate: newTaskDate || new Date().toISOString().split('T')[0],
    };

    setTasks([...tasks, newTask]);
    setShowTaskForm(false);
    Alert.alert('Успех!', 'Задача добавлена');
  };

  // Функции для капсул времени
  const createTimeCapsule = () => {
    setShowCapsuleForm(true);
    setNewCapsuleTitle('');
    setNewCapsuleMessage('');
    setNewCapsuleDate('2025-01-01');
    setNewCapsuleRecipient('Всей семье');
  };

  const saveCapsule = () => {
    if (!newCapsuleTitle.trim() || !newCapsuleMessage.trim() || !newCapsuleRecipient) {
      Alert.alert('Ошибка', 'Заполните все поля и выберите адресата');
      return;
    }

    const newCapsule = {
      id: Date.now(),
      title: newCapsuleTitle,
      message: newCapsuleMessage,
      deliveryDate: newCapsuleDate || '2025-01-01',
      created: new Date().toISOString().split('T')[0],
      recipient: newCapsuleRecipient,
    };

    setTimeCapsules([...timeCapsules, newCapsule]);
    setShowCapsuleForm(false);
    Alert.alert('Успех!', `Капсула времени для "${newCapsuleRecipient}" создана!`);
  };

  // Функции для событий
  const addEvent = () => {
    setShowEventForm(true);
    setNewEventTitle('');
    setNewEventDate(new Date().toISOString().split('T')[0]);
    setNewEventTime('12:00');
  };

  const saveEvent = () => {
    if (!newEventTitle.trim()) {
      Alert.alert('Ошибка', 'Введите название события');
      return;
    }

    const newEvent = {
      id: Date.now(),
      title: newEventTitle,
      date: newEventDate || new Date().toISOString().split('T')[0],
      time: newEventTime || '12:00',
    };

    setEvents([...events, newEvent]);
    setShowEventForm(false);
    Alert.alert('Успех!', 'Событие добавлено!');
  };

  // Функция для рендеринга модальных форм
  const renderModal = () => {
    if (showChatForm) {
      return (
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalScrollContent}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Создать новый чат</Text>

              <TextInput
                style={styles.modalInput}
                placeholder="Название чата"
                value={newChatName}
                onChangeText={setNewChatName}
              />

              <Text style={styles.modalLabel}>Тип чата:</Text>
              <ScrollView horizontal style={styles.chatTypeSelector} showsHorizontalScrollIndicator={false}>
                {chatTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.chatTypeButton,
                      newChatType === type.id && styles.selectedChatType
                    ]}
                    onPress={() => setNewChatType(type.id)}
                  >
                    <Text style={styles.chatTypeIcon}>{type.icon}</Text>
                    <Text style={[
                      styles.chatTypeText,
                      newChatType === type.id && styles.selectedChatTypeText
                    ]}>
                      {type.name.split(' ').slice(1).join(' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.modalLabel}>Участники чата:</Text>
              <View style={styles.membersGrid}>
                {chatMembers.map((member) => (
                  <TouchableOpacity
                    key={member}
                    style={[
                      styles.memberButton,
                      selectedMembers.includes(member) && styles.selectedMember
                    ]}
                    onPress={() => toggleMember(member)}
                  >
                    <Text style={[
                      styles.memberText,
                      selectedMembers.includes(member) && styles.selectedMemberText
                    ]}>
                      {selectedMembers.includes(member) ? '✅' : '👤'} {member}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setShowChatForm(false)}
                >
                  <Text style={styles.modalCancelText}>Отмена</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalSaveButton} onPress={saveChat}>
                  <Text style={styles.modalSaveText}>Создать</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      );
    }

    if (showTaskForm) {
      return (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Новая задача</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Название задачи"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Исполнитель"
              value={newTaskAssignee}
              onChangeText={setNewTaskAssignee}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Дата (YYYY-MM-DD)"
              value={newTaskDate}
              onChangeText={setNewTaskDate}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowTaskForm(false)}
              >
                <Text style={styles.modalCancelText}>Отмена</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalSaveButton} onPress={saveTask}>
                <Text style={styles.modalSaveText}>Сохранить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    if (showEventForm) {
      return (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Новое событие</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Название события"
              value={newEventTitle}
              onChangeText={setNewEventTitle}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Дата (YYYY-MM-DD)"
              value={newEventDate}
              onChangeText={setNewEventDate}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Время (HH:MM)"
              value={newEventTime}
              onChangeText={setNewEventTime}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowEventForm(false)}
              >
                <Text style={styles.modalCancelText}>Отмена</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalSaveButton} onPress={saveEvent}>
                <Text style={styles.modalSaveText}>Сохранить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    if (showCapsuleForm) {
      return (
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalScrollContent}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Новая капсула времени</Text>

              <TextInput
                style={styles.modalInput}
                placeholder="Название капсулы"
                value={newCapsuleTitle}
                onChangeText={setNewCapsuleTitle}
              />

              <Text style={styles.modalLabel}>Адресат:</Text>
              <ScrollView horizontal style={styles.recipientSelector} showsHorizontalScrollIndicator={false}>
                {familyMembers.map((member) => (
                  <TouchableOpacity
                    key={member}
                    style={[
                      styles.recipientButton,
                      newCapsuleRecipient === member && styles.selectedRecipient
                    ]}
                    onPress={() => setNewCapsuleRecipient(member)}
                  >
                    <Text style={[
                      styles.recipientText,
                      newCapsuleRecipient === member && styles.selectedRecipientText
                    ]}>
                      {member}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TextInput
                style={[styles.modalInput, styles.modalTextArea]}
                placeholder="Сообщение для будущего"
                value={newCapsuleMessage}
                onChangeText={setNewCapsuleMessage}
                multiline
              />

              <TextInput
                style={styles.modalInput}
                placeholder="Дата доставки (YYYY-MM-DD)"
                value={newCapsuleDate}
                onChangeText={setNewCapsuleDate}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setShowCapsuleForm(false)}
                >
                  <Text style={styles.modalCancelText}>Отмена</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalSaveButton} onPress={saveCapsule}>
                  <Text style={styles.modalSaveText}>Создать</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      );
    }

    return null;
  };

  // Функции для навигации
  const renderTabButton = (screenName: string, title: string, icon: string) => (
    <TouchableOpacity
      key={screenName}
      style={[
        styles.tabButton,
        currentScreen === screenName && styles.activeTabButton
      ]}
      onPress={() => {
        setCurrentScreen(screenName);
        setSelectedChatId(null); // Сбрасываем выбранный чат при смене экрана
      }}
    >
      <Text style={[
        styles.tabIcon,
        currentScreen === screenName && styles.activeTabIcon
      ]}>
        {icon}
      </Text>
      <Text style={[
        styles.tabText,
        currentScreen === screenName && styles.activeTabText
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderScreen = () => {
    switch (currentScreen) {
      case 'chats':
        if (selectedChatId) {
          const selectedChat = chats.find(chat => chat.id === selectedChatId);
          return (
            <View style={styles.screenContent}>
              <View style={styles.chatHeader}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setSelectedChatId(null)}
                >
                  <Text style={styles.backButtonText}>← Назад</Text>
                </TouchableOpacity>
                <Text style={styles.chatHeaderTitle}>{selectedChat?.name}</Text>
              </View>

              <ScrollView style={styles.messagesContainer}>
                {selectedChat?.messages.map(message => (
                  <View key={message.id} style={styles.messageItem}>
                    <Text style={styles.messageSender}>{message.sender}</Text>
                    <Text style={styles.messageText}>{message.text}</Text>
                    <Text style={styles.messageTime}>{message.timestamp}</Text>
                  </View>
                ))}
                {selectedChat?.messages.length === 0 && (
                  <Text style={styles.emptyMessages}>Начните общение!</Text>
                )}
              </ScrollView>

              <View style={styles.messageInput}>
                <TextInput
                  style={styles.messageTextInput}
                  placeholder="Введите сообщение..."
                  value={newMessage}
                  onChangeText={setNewMessage}
                  multiline
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                  <Text style={styles.sendButtonText}>Отправить</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }

        return (
          <View style={styles.screenContent}>
            <Text style={styles.screenTitle}>💬 Семейные чаты</Text>
            {chats.map(chat => (
              <TouchableOpacity
                key={chat.id}
                style={styles.chatItem}
                onPress={() => setSelectedChatId(chat.id)}
              >
                <Text style={styles.chatName}>{chat.name}</Text>
                <Text style={styles.chatMessage}>{chat.lastMessage}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.actionButton} onPress={createChat}>
              <Text style={styles.actionButtonText}>+ Создать чат</Text>
            </TouchableOpacity>
          </View>
        );
      case 'calendar':
        return (
          <View style={styles.screenContent}>
            <Text style={styles.screenTitle}>📅 Календарь событий</Text>
            {events.map(event => (
              <View key={event.id} style={styles.eventItem}>
                <Text style={styles.eventDate}>{event.date}</Text>
                <Text style={styles.eventName}>{event.title}</Text>
                <Text style={styles.eventTime}>{event.time}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.actionButton} onPress={addEvent}>
              <Text style={styles.actionButtonText}>+ Добавить событие</Text>
            </TouchableOpacity>
          </View>
        );
      case 'ai':
        return (
          <View style={styles.screenContent}>
            <Text style={styles.screenTitle}>🤖 ИИ Помощник</Text>
            <ScrollView style={styles.aiMessagesContainer}>
              {aiMessages.map(message => (
                <View key={message.id} style={[
                  styles.aiMessageItem,
                  message.isBot ? styles.botMessage : styles.userMessage
                ]}>
                  <Text style={styles.aiMessageText}>{message.text}</Text>
                </View>
              ))}
            </ScrollView>
            <View style={styles.aiInputContainer}>
              <TextInput
                style={styles.aiInput}
                placeholder="Спросите что-нибудь..."
                value={aiInput}
                onChangeText={setAiInput}
                multiline
              />
              <TouchableOpacity style={styles.actionButton} onPress={sendAiMessage}>
                <Text style={styles.actionButtonText}>Отправить</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'tasks':
        return (
          <View style={styles.screenContent}>
            <Text style={styles.screenTitle}>📋 Менеджер задач</Text>
            {tasks.map(task => (
              <TouchableOpacity
                key={task.id}
                style={styles.taskItem}
                onPress={() => toggleTask(task.id)}
              >
                <Text style={[styles.taskTitle, task.completed && styles.completedTask]}>
                  {task.completed ? '✅' : '⏳'} {task.title}
                </Text>
                <Text style={styles.taskAssignee}>Исполнитель: {task.assignee}</Text>
                <Text style={styles.taskDate}>Срок: {task.dueDate}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.actionButton} onPress={addTask}>
              <Text style={styles.actionButtonText}>+ Добавить задачу</Text>
            </TouchableOpacity>
          </View>
        );
      case 'timecapsule':
        return (
          <View style={styles.screenContent}>
            <Text style={styles.screenTitle}>⏰ Капсулы времени</Text>
            <ScrollView style={styles.capsulesContainer}>
              {timeCapsules.map(capsule => (
                <View key={capsule.id} style={styles.capsuleItem}>
                  <View style={styles.capsuleHeader}>
                    <Text style={styles.capsuleTitle}>{capsule.title}</Text>
                    <Text style={styles.capsuleRecipient}>Для: {capsule.recipient}</Text>
                  </View>
                  <Text style={styles.capsuleMessage}>"{capsule.message}"</Text>
                  <View style={styles.capsuleFooter}>
                    <Text style={styles.capsuleDate}>📅 Доставка: {capsule.deliveryDate}</Text>
                    <Text style={styles.capsuleCreated}>📝 Создано: {capsule.created}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.actionButton} onPress={createTimeCapsule}>
              <Text style={styles.actionButtonText}>+ Создать капсулу</Text>
            </TouchableOpacity>
          </View>
        );
      case 'profile':
        return (
          <View style={styles.screenContent}>
            <Text style={styles.screenTitle}>👤 Профиль</Text>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Пользователь</Text>
              <Text style={styles.profileEmail}>{email}</Text>
            </View>
            <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Настройки', 'Экран настроек')}>
              <Text style={styles.settingText}>⚙️ Настройки</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Уведомления', 'Настройки уведомлений')}>
              <Text style={styles.settingText}>🔔 Уведомления</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Выйти</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  // Экран логина
  if (!isLoggedIn) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StatusBar style="auto" />
        <ScrollView contentContainerStyle={styles.loginContainer}>
          <Image
            source={require('./src/logo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Aulet Family Chat</Text>
          <Text style={styles.subtitle}>Семейный мессенджер</Text>

          <View style={styles.loginCard}>
            <Text style={styles.loginTitle}>Вход в приложение</Text>

            <TextInput
              style={styles.input}
              placeholder="Электронная почта"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Пароль"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Войти</Text>
            </TouchableOpacity>

            <Text style={styles.hint}>
              Введите любые данные для входа (это демо версия)
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // Основное приложение после логина
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {/* Заголовок с логотипом */}
      <View style={styles.header}>
        <Image
          source={require('./src/logo.jpg')}
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Aulet Family Chat</Text>
      </View>

      {/* Основной контент */}
      <View style={styles.mainContent}>
        {renderScreen()}
      </View>

      {/* Нижняя навигация */}
      <View style={styles.tabBarContainer}>
        <ScrollView horizontal style={styles.tabBar} showsHorizontalScrollIndicator={false}>
          {renderTabButton('chats', 'Чаты', '💬')}
          {renderTabButton('calendar', 'События', '📅')}
          {renderTabButton('tasks', 'Задачи', '📋')}
          {renderTabButton('timecapsule', 'Капсулы', '⏰')}
          {renderTabButton('ai', 'ИИ', '🤖')}
          {renderTabButton('profile', 'Профиль', '👤')}
        </ScrollView>
      </View>

      {/* Модальные окна */}
      {renderModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  // Стили для логина
  loginContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B8E23',
    marginBottom: 40,
    textAlign: 'center',
  },
  loginCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#228B22',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E8F5E8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#F9FFF9',
  },
  loginButton: {
    backgroundColor: '#228B22',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hint: {
    fontSize: 12,
    color: '#6B8E23',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  // Стили для основного приложения
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  headerLogo: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D5016',
  },
  mainContent: {
    flex: 1,
  },
  screenContent: {
    flex: 1,
    padding: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 20,
    textAlign: 'center',
  },
  // Стили для чатов
  chatItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 4,
  },
  chatMessage: {
    fontSize: 14,
    color: '#6B8E23',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E8',
    marginBottom: 16,
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#228B22',
    fontWeight: 'bold',
  },
  chatHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D5016',
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 16,
  },
  messageItem: {
    backgroundColor: '#F0FFF0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  messageSender: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#228B22',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: '#2D5016',
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 10,
    color: '#6B8E23',
    textAlign: 'right',
  },
  emptyMessages: {
    textAlign: 'center',
    color: '#6B8E23',
    fontStyle: 'italic',
    marginTop: 50,
  },
  messageInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8F5E8',
  },
  messageTextInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E8F5E8',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
    backgroundColor: '#FFFFFF',
  },
  sendButton: {
    backgroundColor: '#228B22',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  // Стили для событий
  eventItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  eventDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#228B22',
    marginBottom: 4,
  },
  eventName: {
    fontSize: 16,
    color: '#2D5016',
  },
  eventTime: {
    fontSize: 12,
    color: '#6B8E23',
    marginTop: 4,
  },
  // Стили для ИИ
  aiMessagesContainer: {
    flex: 1,
    marginBottom: 16,
  },
  aiMessageItem: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    maxWidth: '80%',
  },
  botMessage: {
    backgroundColor: '#F0FFF0',
    alignSelf: 'flex-start',
  },
  userMessage: {
    backgroundColor: '#E8F5E8',
    alignSelf: 'flex-end',
  },
  aiMessageText: {
    fontSize: 14,
    color: '#2D5016',
    lineHeight: 20,
  },
  aiInputContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8F5E8',
  },
  aiInput: {
    borderWidth: 1,
    borderColor: '#E8F5E8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  // Стили для профиля
  profileInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B8E23',
  },
  settingItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingText: {
    fontSize: 16,
    color: '#2D5016',
  },
  // Стили для задач
  taskItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 4,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#6B8E23',
  },
  taskAssignee: {
    fontSize: 14,
    color: '#6B8E23',
    marginBottom: 2,
  },
  taskDate: {
    fontSize: 12,
    color: '#999',
  },
  // Стили для капсул времени
  capsulesContainer: {
    flex: 1,
    marginBottom: 16,
  },
  capsuleItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderLeftWidth: 4,
    borderLeftColor: '#228B22',
  },
  capsuleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  capsuleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D5016',
    flex: 1,
  },
  capsuleRecipient: {
    fontSize: 12,
    color: '#228B22',
    fontWeight: 'bold',
    backgroundColor: '#F0FFF0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  capsuleMessage: {
    fontSize: 14,
    color: '#2D5016',
    marginBottom: 12,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  capsuleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  capsuleDate: {
    fontSize: 12,
    color: '#228B22',
    fontWeight: 'bold',
  },
  capsuleCreated: {
    fontSize: 10,
    color: '#999',
  },
  // Общие кнопки
  actionButton: {
    backgroundColor: '#228B22',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#DC3545',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Стили для навигации
  tabBarContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8F5E8',
  },
  tabBar: {
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingHorizontal: 8,
  },
  tabButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    minWidth: 80,
  },
  activeTabButton: {
    backgroundColor: '#F0FFF0',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  activeTabIcon: {
    fontSize: 22,
  },
  tabText: {
    fontSize: 12,
    color: '#6B8E23',
  },
  activeTabText: {
    fontSize: 12,
    color: '#228B22',
    fontWeight: 'bold',
  },
  // Стили для модальных окон
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E8F5E8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#F9FFF9',
  },
  modalTextArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: '#228B22',
    borderRadius: 12,
    paddingVertical: 12,
    marginLeft: 8,
    alignItems: 'center',
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Стили для селектора адресата
  modalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 8,
  },
  recipientSelector: {
    marginBottom: 16,
  },
  recipientButton: {
    backgroundColor: '#F9FFF9',
    borderWidth: 1,
    borderColor: '#E8F5E8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedRecipient: {
    backgroundColor: '#228B22',
    borderColor: '#228B22',
  },
  recipientText: {
    fontSize: 14,
    color: '#2D5016',
    fontWeight: '500',
  },
  selectedRecipientText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  // Стили для создания чата
  chatTypeSelector: {
    marginBottom: 16,
  },
  chatTypeButton: {
    backgroundColor: '#F9FFF9',
    borderWidth: 1,
    borderColor: '#E8F5E8',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    alignItems: 'center',
    minWidth: 80,
  },
  selectedChatType: {
    backgroundColor: '#228B22',
    borderColor: '#228B22',
  },
  chatTypeIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  chatTypeText: {
    fontSize: 12,
    color: '#2D5016',
    textAlign: 'center',
  },
  selectedChatTypeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  membersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  memberButton: {
    backgroundColor: '#F9FFF9',
    borderWidth: 1,
    borderColor: '#E8F5E8',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  selectedMember: {
    backgroundColor: '#E8F5E8',
    borderColor: '#228B22',
  },
  memberText: {
    fontSize: 14,
    color: '#2D5016',
  },
  selectedMemberText: {
    color: '#228B22',
    fontWeight: 'bold',
  },
});
