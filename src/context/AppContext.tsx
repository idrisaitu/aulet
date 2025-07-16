import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { DatabaseService } from '../services/database';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  birthDate: string;
  relationship: string;
  avatar?: string;
  phone?: string;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  familyId: string;
}

export interface Family {
  id: string;
  name: string;
  code: string; // Уникальный код семьи
  members: FamilyMember[];
  lastMessage?: Message;
  unreadCount: number;
  avatar?: string;
  createdAt: Date;
  description?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string; // ID члена семьи
  assignedToName?: string;
  familyId: string;
  familyName: string;
  createdBy: string;
  createdAt: Date;
  dueDate?: Date;
}

export interface AIMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  familyId?: string;
}

export interface TimeCapsule {
  id: string;
  title: string;
  message: string;
  mediaUrl?: string;
  mediaType?: 'photo' | 'video';
  familyId: string;
  familyName: string;
  createdBy: string;
  createdByName: string;
  createdAt: Date;
  deliveryDate: Date;
  isDelivered: boolean;
  recipients?: string[]; // member IDs
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  familyId: string;
  familyName: string;
  createdBy: string;
}

interface AppContextType {
  user: User | null;
  families: Family[];
  messages: Message[];
  events: Event[];
  tasks: Task[];
  aiMessages: AIMessage[];
  timeCapsules: TimeCapsule[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  sendMessage: (familyId: string, text: string) => Promise<void>;
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (eventId: string, updates: Partial<Event>) => void;
  deleteEvent: (eventId: string) => void;
  addFamily: (family: Omit<Family, 'id' | 'unreadCount' | 'createdAt'>) => Promise<void>;
  addFamilyMember: (familyId: string, member: Omit<FamilyMember, 'id'>) => void;
  // Task management
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTaskComplete: (taskId: string) => Promise<void>;
  // AI Assistant
  sendAIMessage: (message: string, familyId?: string) => Promise<void>;
  clearAIHistory: () => Promise<void>;
  // Family code generation
  generateFamilyCode: () => string;
  // Time Capsules
  addTimeCapsule: (capsule: Omit<TimeCapsule, 'id' | 'createdAt' | 'isDelivered'>) => Promise<void>;
  updateTimeCapsule: (capsuleId: string, updates: Partial<TimeCapsule>) => Promise<void>;
  deleteTimeCapsule: (capsuleId: string) => Promise<void>;
  deliverTimeCapsule: (capsuleId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Мок данные для демонстрации
const mockUser: User = {
  id: '1',
  name: 'Айгүл Назарбаева',
  email: 'aigul@example.com',
};

const mockFamilies: Family[] = [
  {
    id: '1',
    name: 'Семья Касымовых',
    code: 'KAS2024',
    members: [
      { id: '1', name: 'Айгуль', birthDate: '1985-03-15', relationship: 'Я' },
      { id: '2', name: 'Нурлан', birthDate: '1982-07-22', relationship: 'Супруг' },
      { id: '3', name: 'Арман', birthDate: '2010-11-08', relationship: 'Сын' },
      { id: '4', name: 'Амина', birthDate: '2013-05-12', relationship: 'Дочь' },
    ],
    unreadCount: 3,
    createdAt: new Date('2024-01-15'),
    description: 'Наша дружная семья',
  },
  {
    id: '2',
    name: 'Большая семья',
    code: 'ULY2023',
    members: [
      { id: '5', name: 'Касым ата', birthDate: '1955-01-10', relationship: 'Отец' },
      { id: '6', name: 'Гульнар апа', birthDate: '1958-09-03', relationship: 'Мать' },
      { id: '7', name: 'Серик', birthDate: '1980-06-18', relationship: 'Брат' },
      { id: '8', name: 'Мадина', birthDate: '1978-12-25', relationship: 'Сестра' },
    ],
    unreadCount: 1,
    createdAt: new Date('2023-12-01'),
    description: 'Все члены большой семьи',
  },
  {
    id: '3',
    name: 'Группа родственников',
    code: 'TUY2024',
    members: [
      { id: '9', name: 'Болат', birthDate: '1975-04-12', relationship: 'Родственник' },
      { id: '10', name: 'Алма', birthDate: '1977-08-30', relationship: 'Родственница' },
    ],
    unreadCount: 0,
    createdAt: new Date('2024-02-10'),
    description: 'Связь с родственниками',
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    text: 'У нас все хорошо! Как дела у вас?',
    senderId: '1',
    senderName: 'Айгуль',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    familyId: '1',
  },
  {
    id: '2',
    text: 'У нас тоже все хорошо! Дети хорошо учатся в школе',
    senderId: '2',
    senderName: 'Нурлан',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    familyId: '1',
  },
  {
    id: '3',
    text: 'Привет семья! Как проводите день?',
    senderId: '3',
    senderName: 'Арман',
    timestamp: new Date(Date.now() - 3600000),
    familyId: '1',
  },
  {
    id: '4',
    text: 'Мама, папа, завтра у нас в школе концерт!',
    senderId: '4',
    senderName: 'Амина',
    timestamp: new Date(Date.now() - 1800000),
    familyId: '1',
  },
  {
    id: '5',
    text: 'Внучата мои, скучаю по вам!',
    senderId: '5',
    senderName: 'Касым ата',
    timestamp: new Date(Date.now() - 7200000),
    familyId: '2',
  },
];

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'День рождения Армана',
    description: 'Нашему сыну исполняется 14 лет',
    date: '2024-11-08',
    time: '18:00',
    familyId: '1',
    familyName: 'Семья Касымовых',
    createdBy: '1',
  },
  {
    id: '2',
    title: 'Семейная встреча',
    description: 'Встреча со всеми родственниками',
    date: '2024-04-20',
    time: '15:00',
    familyId: '2',
    familyName: 'Большая семья',
    createdBy: '5',
  },
  {
    id: '3',
    title: 'Праздник Наурыз',
    description: 'Традиционное празднование Наурыза',
    date: '2024-03-22',
    time: '12:00',
    familyId: '3',
    familyName: 'Группа родственников',
    createdBy: '9',
  },
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Уборка дома',
    description: 'Генеральная уборка в выходные',
    completed: false,
    priority: 'medium',
    assignedTo: '3',
    assignedToName: 'Арман',
    familyId: '1',
    familyName: 'Семья Касымовых',
    createdBy: '1',
    createdAt: new Date(Date.now() - 86400000),
    dueDate: new Date(Date.now() + 86400000 * 2),
  },
  {
    id: '2',
    title: 'Покупка продуктов',
    description: 'Закупка продуктов на неделю',
    completed: true,
    priority: 'high',
    assignedTo: '2',
    assignedToName: 'Нурлан',
    familyId: '1',
    familyName: 'Семья Касымовых',
    createdBy: '1',
    createdAt: new Date(Date.now() - 172800000),
    dueDate: new Date(Date.now() - 86400000),
  },
  {
    id: '3',
    title: 'Родительское собрание',
    description: 'Собрание в школе у Армана',
    completed: false,
    priority: 'high',
    assignedTo: '1',
    assignedToName: 'Айгуль',
    familyId: '1',
    familyName: 'Семья Касымовых',
    createdBy: '2',
    createdAt: new Date(Date.now() - 259200000),
    dueDate: new Date(Date.now() + 432000000),
  },
];

const mockAIMessages: AIMessage[] = [
  {
    id: '1',
    text: 'Привет! Я ваш семейный ИИ помощник. Можете задать мне любой вопрос.',
    isUser: false,
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: '2',
    text: 'Можете посоветовать полезные игры для детей?',
    isUser: true,
    timestamp: new Date(Date.now() - 3000000),
    familyId: '1',
  },
  {
    id: '3',
    text: 'Конечно! Рекомендую следующие игры:\n\n1. Развивающие игры - пазлы, конструкторы\n2. Подвижные игры - прятки, игры с мячом\n3. Творческие - рисование, лепка\n4. Обучающие игры - словесные игры, математические головоломки\n\nВыбирайте в зависимости от возраста детей!',
    isUser: false,
    timestamp: new Date(Date.now() - 2940000),
  },
];

const mockTimeCapsules: TimeCapsule[] = [
  {
    id: '1',
    title: 'День рождения Армана',
    message: 'Поздравляем нашего дорогого сына с 15-летием! Желаем здоровья, счастья и успехов в учебе!',
    familyId: '1',
    familyName: 'Семья Касымовых',
    createdBy: '1',
    createdByName: 'Айгуль',
    createdAt: new Date(Date.now() - 86400000 * 30),
    deliveryDate: new Date('2024-11-08T10:00:00'),
    isDelivered: false,
  },
  {
    id: '2',
    title: 'Новогоднее поздравление',
    message: 'С Новым годом, дорогая семья! Пусть новый год принесет много радости и счастья!',
    mediaUrl: 'https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Happy+New+Year',
    mediaType: 'photo',
    familyId: '2',
    familyName: 'Большая семья',
    createdBy: '5',
    createdByName: 'Касым ата',
    createdAt: new Date(Date.now() - 86400000 * 60),
    deliveryDate: new Date('2025-01-01T00:00:00'),
    isDelivered: false,
  },
  {
    id: '3',
    title: 'Семейное фото',
    message: 'Это наше семейное фото с прошлого лета. Какие мы были счастливые!',
    mediaUrl: 'https://via.placeholder.com/300x200/4ade80/ffffff?text=Family+Photo',
    mediaType: 'photo',
    familyId: '1',
    familyName: 'Семья Касымовых',
    createdBy: '2',
    createdByName: 'Нурлан',
    createdAt: new Date(Date.now() - 86400000 * 10),
    deliveryDate: new Date(Date.now() + 86400000 * 7),
    isDelivered: false,
  },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [families, setFamilies] = useState<Family[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [aiMessages, setAIMessages] = useState<AIMessage[]>([]);
  const [timeCapsules, setTimeCapsules] = useState<TimeCapsule[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from database on app start
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);

      // Initialize default data if needed
      try {
        await DatabaseService.initializeDefaultData();
      } catch (dbError) {
        console.warn('Database initialization failed, using fallback data:', dbError);
      }

      // Load all data
      const [
        userData,
        familiesData,
        messagesData,
        eventsData,
        tasksData,
        aiMessagesData,
        timeCapsulesData,
      ] = await Promise.all([
        DatabaseService.getUser(),
        DatabaseService.getFamilies(),
        DatabaseService.getMessages(),
        DatabaseService.getEvents(),
        DatabaseService.getTasks(),
        DatabaseService.getAIMessages(),
        DatabaseService.getTimeCapsules(),
      ]);

      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      }

      // If no data exists, use mock data
      if (familiesData.length === 0) {
        setFamilies(mockFamilies);
        await DatabaseService.saveFamilies(mockFamilies);
      } else {
        setFamilies(familiesData);
      }

      if (messagesData.length === 0) {
        setMessages(mockMessages);
        await DatabaseService.saveMessages(mockMessages);
      } else {
        setMessages(messagesData);
      }

      if (eventsData.length === 0) {
        setEvents(mockEvents);
        await DatabaseService.saveEvents(mockEvents);
      } else {
        setEvents(eventsData);
      }

      if (tasksData.length === 0) {
        setTasks(mockTasks);
        await DatabaseService.saveTasks(mockTasks);
      } else {
        setTasks(tasksData);
      }

      if (aiMessagesData.length === 0) {
        setAIMessages(mockAIMessages);
        await DatabaseService.saveAIMessages(mockAIMessages);
      } else {
        setAIMessages(aiMessagesData);
      }

      if (timeCapsulesData.length === 0) {
        setTimeCapsules(mockTimeCapsules);
        await DatabaseService.saveTimeCapsules(mockTimeCapsules);
      } else {
        setTimeCapsules(timeCapsulesData);
      }

    } catch (error) {
      console.error('Error loading initial data:', error);
      // Fallback to mock data
      setFamilies(mockFamilies);
      setMessages(mockMessages);
      setEvents(mockEvents);
      setTasks(mockTasks);
      setAIMessages(mockAIMessages);
      setTimeCapsules(mockTimeCapsules);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Мок аутентификация - в реальном приложении здесь будет API
      if (email && password) {
        const userData = mockUser;
        await DatabaseService.saveUser(userData);
        setUser(userData);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await DatabaseService.clearUser();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const sendMessage = async (familyId: string, text: string) => {
    if (!user) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      senderId: user.id,
      senderName: user.name,
      timestamp: new Date(),
      familyId,
    };

    try {
      // Add to local state immediately for instant UI update
      setMessages(prev => [...prev, newMessage]);

      // Save to database
      await DatabaseService.addMessage(newMessage);

      // Обновляем последнее сообщение в семье
      const updatedFamilies = families.map(family =>
        family.id === familyId
          ? { ...family, lastMessage: newMessage }
          : family
      );
      setFamilies(updatedFamilies);
      await DatabaseService.saveFamilies(updatedFamilies);

    } catch (error) {
      console.error('Error sending message:', error);
      // Remove from local state if database save failed
      setMessages(prev => prev.filter(m => m.id !== newMessage.id));
    }
  };

  const addEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (eventId: string, updates: Partial<Event>) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, ...updates } : event
    ));
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const addFamily = async (familyData: Omit<Family, 'id' | 'unreadCount' | 'createdAt'>) => {
    const newFamily: Family = {
      ...familyData,
      id: Date.now().toString(),
      unreadCount: 0,
      createdAt: new Date(),
    };

    try {
      setFamilies(prev => [...prev, newFamily]);
      await DatabaseService.addFamily(newFamily);
    } catch (error) {
      console.error('Error adding family:', error);
      setFamilies(prev => prev.filter(f => f.id !== newFamily.id));
    }
  };

  const addFamilyMember = (familyId: string, memberData: Omit<FamilyMember, 'id'>) => {
    const newMember: FamilyMember = {
      ...memberData,
      id: Date.now().toString(),
    };

    setFamilies(prev => prev.map(family =>
      family.id === familyId
        ? { ...family, members: [...family.members, newMember] }
        : family
    ));
  };

  // Task management functions
  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    try {
      setTasks(prev => [...prev, newTask]);
      await DatabaseService.addTask(newTask);
    } catch (error) {
      console.error('Error adding task:', error);
      setTasks(prev => prev.filter(t => t.id !== newTask.id));
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const updatedTasks = tasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      );
      setTasks(updatedTasks);
      await DatabaseService.updateTask(taskId, updates);
    } catch (error) {
      console.error('Error updating task:', error);
      // Revert changes
      setTasks(tasks);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const originalTasks = tasks;
      setTasks(prev => prev.filter(task => task.id !== taskId));
      await DatabaseService.deleteTask(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
      setTasks(tasks);
    }
  };

  const toggleTaskComplete = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        const updates = { completed: !task.completed };
        await updateTask(taskId, updates);
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  // AI Assistant functions
  const sendAIMessage = async (message: string, familyId?: string) => {
    try {
      // Add user message
      const userMessage: AIMessage = {
        id: Date.now().toString(),
        text: message,
        isUser: true,
        timestamp: new Date(),
        familyId,
      };

      setAIMessages(prev => [...prev, userMessage]);
      await DatabaseService.addAIMessage(userMessage);

      // Simulate AI response (in real app, this would be an API call)
      setTimeout(async () => {
        const aiResponse: AIMessage = {
          id: (Date.now() + 1).toString(),
          text: generateAIResponse(message),
          isUser: false,
          timestamp: new Date(),
          familyId,
        };

        setAIMessages(prev => [...prev, aiResponse]);
        await DatabaseService.addAIMessage(aiResponse);
      }, 1000);

    } catch (error) {
      console.error('Error sending AI message:', error);
    }
  };

  const clearAIHistory = async () => {
    try {
      setAIMessages([]);
      await DatabaseService.clearAIMessages();
    } catch (error) {
      console.error('Error clearing AI history:', error);
    }
  };

  // Generate family code
  const generateFamilyCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Time Capsule functions
  const addTimeCapsule = async (capsuleData: Omit<TimeCapsule, 'id' | 'createdAt' | 'isDelivered'>) => {
    const newCapsule: TimeCapsule = {
      ...capsuleData,
      id: Date.now().toString(),
      createdAt: new Date(),
      isDelivered: false,
    };

    try {
      setTimeCapsules(prev => [...prev, newCapsule]);
      await DatabaseService.addTimeCapsule(newCapsule);
    } catch (error) {
      console.error('Error adding time capsule:', error);
    }
  };

  const updateTimeCapsule = async (capsuleId: string, updates: Partial<TimeCapsule>) => {
    try {
      setTimeCapsules(prev => prev.map(capsule =>
        capsule.id === capsuleId ? { ...capsule, ...updates } : capsule
      ));
      await DatabaseService.updateTimeCapsule(capsuleId, updates);
    } catch (error) {
      console.error('Error updating time capsule:', error);
    }
  };

  const deleteTimeCapsule = async (capsuleId: string) => {
    try {
      setTimeCapsules(prev => prev.filter(capsule => capsule.id !== capsuleId));
      await DatabaseService.deleteTimeCapsule(capsuleId);
    } catch (error) {
      console.error('Error deleting time capsule:', error);
    }
  };

  const deliverTimeCapsule = async (capsuleId: string) => {
    try {
      const capsule = timeCapsules.find(c => c.id === capsuleId);
      if (capsule) {
        // Convert to regular message
        const message: Message = {
          id: Date.now().toString(),
          text: `🕰️ Капсула времени: ${capsule.title}\n\n${capsule.message}`,
          senderId: capsule.createdBy,
          senderName: capsule.createdByName,
          timestamp: new Date(),
          familyId: capsule.familyId,
        };

        await sendMessage(capsule.familyId, message.text);
        await updateTimeCapsule(capsuleId, { isDelivered: true });
      }
    } catch (error) {
      console.error('Error delivering time capsule:', error);
    }
  };

  // Simple AI response generator (mock)
  const generateAIResponse = (userMessage: string): string => {
    const responses = [
      'Это очень интересный вопрос! Я постараюсь вам помочь.',
      'Консультирование по семейным вопросам - моя специальность.',
      'Могу рассказать много полезного о работе с детьми.',
      'У меня есть рекомендации по организации домашнего хозяйства.',
      'Можете спросить о семейных традициях и праздниках.',
    ];

    if (userMessage.toLowerCase().includes('дети') || userMessage.toLowerCase().includes('ребенок') || userMessage.toLowerCase().includes('сын') || userMessage.toLowerCase().includes('дочь')) {
      return 'Работа с детьми - это очень важная тема. Нужно уделять детям много времени, разговаривать с ними, играть. Важно поддерживать их интересы и помогать развиваться.';
    }

    if (userMessage.toLowerCase().includes('еда') || userMessage.toLowerCase().includes('готовить') || userMessage.toLowerCase().includes('кухня')) {
      return 'Семейная готовка - это проявление любви и заботы. Рекомендую изучать традиционные рецепты. Привлекайте детей к приготовлению пищи.';
    }

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const value: AppContextType = {
    user,
    families,
    messages,
    events,
    tasks,
    aiMessages,
    timeCapsules,
    isAuthenticated,
    isLoading,
    login,
    logout,
    sendMessage,
    addEvent,
    updateEvent,
    deleteEvent,
    addFamily,
    addFamilyMember,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    sendAIMessage,
    clearAIHistory,
    generateFamilyCode,
    addTimeCapsule,
    updateTimeCapsule,
    deleteTimeCapsule,
    deliverTimeCapsule,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
