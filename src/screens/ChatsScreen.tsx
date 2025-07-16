import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Modal,
  TextInput,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../navigation/types';
import { useApp, Family } from '../context/AppContext';
import { Card } from '../components/ui/Card';

type Props = NativeStackScreenProps<MainTabParamList, 'Chats'>;

const ChatsScreen: React.FC<Props> = ({ navigation }) => {
  const { families, addFamily, user, messages } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const handleAddFamily = () => {
    if (!newFamilyName.trim()) {
      Alert.alert('Қате', 'Отбасы атын енгізіңіз');
      return;
    }

    addFamily({
      name: newFamilyName,
      members: user ? [{
        id: user.id,
        name: user.name,
        birthDate: '1985-03-15',
        relationship: 'Өзім',
      }] : [],
    });

    setNewFamilyName('');
    setShowAddModal(false);
    Alert.alert('Сәттілік', 'Жаңа отбасы қосылды!');
  };

  const formatTimestamp = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleTimeString('kk-KZ', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openFamilyChat = (family: Family) => {
    (navigation as any).navigate('ChatRoom', {
      familyId: family.id,
      familyName: family.name,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getLastMessagePreview = (family: Family) => {
    const familyMessages = messages.filter(msg => msg.familyId === family.id);
    const lastMessage = familyMessages[familyMessages.length - 1];

    if (!lastMessage) {
      return 'Хабарлар жоқ';
    }

    return `${lastMessage.senderName}: ${lastMessage.text}`;
  };

  const getLastMessageTime = (family: Family) => {
    const familyMessages = messages.filter(msg => msg.familyId === family.id);
    const lastMessage = familyMessages[familyMessages.length - 1];

    if (!lastMessage) {
      return '';
    }

    return formatTimestamp(lastMessage.timestamp);
  };

  const renderFamilyItem = ({ item }: { item: Family }) => (
    <Card style={styles.familyCard}>
      <TouchableOpacity
        style={styles.familyItem}
        onPress={() => openFamilyChat(item)}
        activeOpacity={0.7}
      >
        <View style={styles.familyLeft}>
          <View style={styles.avatarContainer}>
            {item.avatar ? (
              <Image source={{ uri: item.avatar }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{item.name[0]}</Text>
              </View>
            )}
            {item.unreadCount > 0 && (
              <View style={styles.onlineDot} />
            )}
          </View>

          <View style={styles.familyInfo}>
            <View style={styles.familyHeader}>
              <Text style={styles.familyName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.memberCount}>
                {item.members.length} мүше
              </Text>
            </View>

            <Text style={styles.lastMessage} numberOfLines={2}>
              {getLastMessagePreview(item)}
            </Text>
          </View>
        </View>

        <View style={styles.familyRight}>
          <Text style={styles.timestamp}>
            {getLastMessageTime(item)}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {item.unreadCount > 99 ? '99+' : item.unreadCount}
              </Text>
            </View>
          )}
          <Ionicons name="chevron-forward" size={16} color="#90EE90" />
        </View>
      </TouchableOpacity>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Отбасылық чаттар</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add-circle-outline" size={24} color="#228B22" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => (navigation as any).navigate('CreateFamily')}
          >
            <Ionicons name="people-outline" size={24} color="#228B22" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => (navigation as any).navigate('TimeCapsule')}
        >
          <View style={styles.quickActionIcon}>
            <Ionicons name="time" size={24} color="#3b82f6" />
          </View>
          <Text style={styles.quickActionText}>Капсула времени</Text>
          <Text style={styles.quickActionSubtext}>Отправить в будущее</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => (navigation as any).navigate('FamilyTree')}
        >
          <View style={styles.quickActionIcon}>
            <Ionicons name="git-network" size={24} color="#10b981" />
          </View>
          <Text style={styles.quickActionText}>Семейное дерево</Text>
          <Text style={styles.quickActionSubtext}>Родословная</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={families}
        renderItem={renderFamilyItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Жаңа отбасы қосу</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Отбасы атын енгізіңіз"
              value={newFamilyName}
              onChangeText={setNewFamilyName}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddModal(false);
                  setNewFamilyName('');
                }}
              >
                <Text style={styles.cancelButtonText}>Болдырмау</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={handleAddFamily}
              >
                <Text style={styles.addButtonText}>Қосу</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0', // Теплый кремовый фон
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
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
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#228B22',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: '#228B22',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 2,
  },
  quickActionSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  familyCard: {
    marginBottom: 12,
    padding: 0,
  },
  familyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  familyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  familyRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 60,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#E8F5E8',
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#228B22',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E8F5E8',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#32CD32',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  familyInfo: {
    flex: 1,
  },
  familyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  familyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D5016', // Темно-зеленый
  },
  timestamp: {
    fontSize: 12,
    color: '#6B8E23', // Оливково-зеленый
  },
  familyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: '#556B2F', // Темный оливково-зеленый
    marginRight: 8,
  },
  memberCount: {
    fontSize: 12,
    color: '#6B8E23',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#32CD32', // Лайм-зеленый
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Стили для модального окна
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D5016',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 2,
    borderColor: '#90EE90',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    color: '#2D5016',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#228B22',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatsScreen; 