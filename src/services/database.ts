import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Family, Message, Task, AIMessage, Event, TimeCapsule } from '../context/AppContext';

// Storage keys
const STORAGE_KEYS = {
  USER: '@user',
  FAMILIES: '@families',
  MESSAGES: '@messages',
  TASKS: '@tasks',
  AI_MESSAGES: '@ai_messages',
  EVENTS: '@events',
  TIME_CAPSULES: '@time_capsules',
  SETTINGS: '@settings',
};

// Database service class
export class DatabaseService {
  // User operations
  static async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  static async getUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  static async clearUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Error clearing user:', error);
      throw error;
    }
  }

  // Family operations
  static async saveFamilies(families: Family[]): Promise<void> {
    try {
      const familiesWithDates = families.map(family => ({
        ...family,
        createdAt: family.createdAt.toISOString(),
      }));
      await AsyncStorage.setItem(STORAGE_KEYS.FAMILIES, JSON.stringify(familiesWithDates));
    } catch (error) {
      console.error('Error saving families:', error);
      throw error;
    }
  }

  static async getFamilies(): Promise<Family[]> {
    try {
      const familiesData = await AsyncStorage.getItem(STORAGE_KEYS.FAMILIES);
      if (!familiesData) return [];

      const families = JSON.parse(familiesData);
      return families.map((family: any) => ({
        ...family,
        createdAt: family.createdAt ? new Date(family.createdAt) : new Date(),
      }));
    } catch (error) {
      console.error('Error getting families:', error);
      return [];
    }
  }

  static async addFamily(family: Family): Promise<void> {
    try {
      const families = await this.getFamilies();
      families.push(family);
      await this.saveFamilies(families);
    } catch (error) {
      console.error('Error adding family:', error);
      throw error;
    }
  }

  static async updateFamily(familyId: string, updates: Partial<Family>): Promise<void> {
    try {
      const families = await this.getFamilies();
      const index = families.findIndex(f => f.id === familyId);
      if (index !== -1) {
        families[index] = { ...families[index], ...updates };
        await this.saveFamilies(families);
      }
    } catch (error) {
      console.error('Error updating family:', error);
      throw error;
    }
  }

  // Message operations
  static async saveMessages(messages: Message[]): Promise<void> {
    try {
      const messagesWithDates = messages.map(message => ({
        ...message,
        timestamp: message.timestamp.toISOString(),
      }));
      await AsyncStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messagesWithDates));
    } catch (error) {
      console.error('Error saving messages:', error);
      throw error;
    }
  }

  static async getMessages(): Promise<Message[]> {
    try {
      const messagesData = await AsyncStorage.getItem(STORAGE_KEYS.MESSAGES);
      if (!messagesData) return [];
      
      const messages = JSON.parse(messagesData);
      return messages.map((message: any) => ({
        ...message,
        timestamp: new Date(message.timestamp),
      }));
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  }

  static async addMessage(message: Message): Promise<void> {
    try {
      const messages = await this.getMessages();
      messages.push(message);
      await this.saveMessages(messages);
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  }

  // Task operations
  static async saveTasks(tasks: Task[]): Promise<void> {
    try {
      const tasksWithDates = tasks.map(task => ({
        ...task,
        createdAt: task.createdAt.toISOString(),
        dueDate: task.dueDate?.toISOString(),
      }));
      await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasksWithDates));
    } catch (error) {
      console.error('Error saving tasks:', error);
      throw error;
    }
  }

  static async getTasks(): Promise<Task[]> {
    try {
      const tasksData = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
      if (!tasksData) return [];
      
      const tasks = JSON.parse(tasksData);
      return tasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      }));
    } catch (error) {
      console.error('Error getting tasks:', error);
      return [];
    }
  }

  static async addTask(task: Task): Promise<void> {
    try {
      const tasks = await this.getTasks();
      tasks.push(task);
      await this.saveTasks(tasks);
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  }

  static async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    try {
      const tasks = await this.getTasks();
      const index = tasks.findIndex(t => t.id === taskId);
      if (index !== -1) {
        tasks[index] = { ...tasks[index], ...updates };
        await this.saveTasks(tasks);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  static async deleteTask(taskId: string): Promise<void> {
    try {
      const tasks = await this.getTasks();
      const filteredTasks = tasks.filter(t => t.id !== taskId);
      await this.saveTasks(filteredTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  // AI Messages operations
  static async saveAIMessages(messages: AIMessage[]): Promise<void> {
    try {
      const messagesWithDates = messages.map(message => ({
        ...message,
        timestamp: message.timestamp.toISOString(),
      }));
      await AsyncStorage.setItem(STORAGE_KEYS.AI_MESSAGES, JSON.stringify(messagesWithDates));
    } catch (error) {
      console.error('Error saving AI messages:', error);
      throw error;
    }
  }

  static async getAIMessages(): Promise<AIMessage[]> {
    try {
      const messagesData = await AsyncStorage.getItem(STORAGE_KEYS.AI_MESSAGES);
      if (!messagesData) return [];
      
      const messages = JSON.parse(messagesData);
      return messages.map((message: any) => ({
        ...message,
        timestamp: new Date(message.timestamp),
      }));
    } catch (error) {
      console.error('Error getting AI messages:', error);
      return [];
    }
  }

  static async addAIMessage(message: AIMessage): Promise<void> {
    try {
      const messages = await this.getAIMessages();
      messages.push(message);
      await this.saveAIMessages(messages);
    } catch (error) {
      console.error('Error adding AI message:', error);
      throw error;
    }
  }

  static async clearAIMessages(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.AI_MESSAGES);
    } catch (error) {
      console.error('Error clearing AI messages:', error);
      throw error;
    }
  }

  // Events operations
  static async saveEvents(events: Event[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    } catch (error) {
      console.error('Error saving events:', error);
      throw error;
    }
  }

  static async getEvents(): Promise<Event[]> {
    try {
      const eventsData = await AsyncStorage.getItem(STORAGE_KEYS.EVENTS);
      return eventsData ? JSON.parse(eventsData) : [];
    } catch (error) {
      console.error('Error getting events:', error);
      return [];
    }
  }

  // Clear all data
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }

  // Initialize with default data
  static async initializeDefaultData(): Promise<void> {
    try {
      const user = await this.getUser();
      if (!user) {
        // Create default user
        const defaultUser: User = {
          id: '1',
          name: 'Айгүл Назарбаева',
          email: 'aigul@example.com',
        };
        await this.saveUser(defaultUser);
      }
    } catch (error) {
      console.error('Error initializing default data:', error);
      // Don't throw error to prevent app crash
    }
  }

  // Time Capsule operations
  static async saveTimeCapsules(timeCapsules: TimeCapsule[]): Promise<void> {
    try {
      const capsulesWithDates = timeCapsules.map(capsule => ({
        ...capsule,
        createdAt: capsule.createdAt.toISOString(),
        deliveryDate: capsule.deliveryDate.toISOString(),
      }));
      await AsyncStorage.setItem(STORAGE_KEYS.TIME_CAPSULES, JSON.stringify(capsulesWithDates));
    } catch (error) {
      console.error('Error saving time capsules:', error);
      throw error;
    }
  }

  static async getTimeCapsules(): Promise<TimeCapsule[]> {
    try {
      const capsulesData = await AsyncStorage.getItem(STORAGE_KEYS.TIME_CAPSULES);
      if (!capsulesData) return [];

      const capsules = JSON.parse(capsulesData);
      return capsules.map((capsule: any) => ({
        ...capsule,
        createdAt: new Date(capsule.createdAt),
        deliveryDate: new Date(capsule.deliveryDate),
      }));
    } catch (error) {
      console.error('Error getting time capsules:', error);
      return [];
    }
  }

  static async addTimeCapsule(timeCapsule: TimeCapsule): Promise<void> {
    try {
      const existingCapsules = await this.getTimeCapsules();
      const updatedCapsules = [...existingCapsules, timeCapsule];
      await this.saveTimeCapsules(updatedCapsules);
    } catch (error) {
      console.error('Error adding time capsule:', error);
      throw error;
    }
  }

  static async updateTimeCapsule(capsuleId: string, updates: Partial<TimeCapsule>): Promise<void> {
    try {
      const existingCapsules = await this.getTimeCapsules();
      const updatedCapsules = existingCapsules.map(capsule =>
        capsule.id === capsuleId ? { ...capsule, ...updates } : capsule
      );
      await this.saveTimeCapsules(updatedCapsules);
    } catch (error) {
      console.error('Error updating time capsule:', error);
      throw error;
    }
  }

  static async deleteTimeCapsule(capsuleId: string): Promise<void> {
    try {
      const existingCapsules = await this.getTimeCapsules();
      const updatedCapsules = existingCapsules.filter(capsule => capsule.id !== capsuleId);
      await this.saveTimeCapsules(updatedCapsules);
    } catch (error) {
      console.error('Error deleting time capsule:', error);
      throw error;
    }
  }
}
