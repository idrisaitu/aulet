import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useApp, FamilyMember } from '../context/AppContext';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { theme } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'FamilyTree'>;

interface TreeMember {
  id: string;
  name: string;
  birthDate: string;
  photo?: string;
  parentIds: string[];
  spouseId?: string;
  level: number;
  position: number;
  relationship: string;
}

const mockFamilyMembers: TreeMember[] = [
  {
    id: '1',
    name: 'Касым ата',
    birthDate: '1955-01-10',
    parentIds: [],
    level: 0,
    position: 0,
    relationship: 'Дедушка',
  },
  {
    id: '2',
    name: 'Гульнар апа',
    birthDate: '1958-09-03',
    parentIds: [],
    spouseId: '1',
    level: 0,
    position: 1,
    relationship: 'Бабушка',
  },
  {
    id: '3',
    name: 'Серик',
    birthDate: '1980-06-18',
    parentIds: ['1', '2'],
    level: 1,
    position: 0,
    relationship: 'Сын',
  },
  {
    id: '4',
    name: 'Мадина',
    birthDate: '1978-12-25',
    parentIds: ['1', '2'],
    level: 1,
    position: 1,
    relationship: 'Дочь',
  },
  {
    id: '5',
    name: 'Айгуль',
    birthDate: '1985-03-15',
    parentIds: ['1', '2'],
    level: 1,
    position: 2,
    relationship: 'Дочь',
  },
  {
    id: '6',
    name: 'Арман',
    birthDate: '2010-11-08',
    parentIds: ['5'],
    level: 2,
    position: 0,
    relationship: 'Внук',
  },
  {
    id: '7',
    name: 'Амина',
    birthDate: '2013-05-12',
    parentIds: ['5'],
    level: 2,
    position: 1,
    relationship: 'Внучка',
  },
];

const { width } = Dimensions.get('window');
const MEMBER_WIDTH = 120;
const MEMBER_HEIGHT = 150;
const LEVEL_HEIGHT = 200;

const FamilyTreeScreen: React.FC<Props> = ({ navigation }) => {
  const { families, addFamilyMember } = useApp();
  const [members, setMembers] = useState<TreeMember[]>(mockFamilyMembers);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState(families[0]?.id || '');
  const [newMember, setNewMember] = useState({
    name: '',
    birthDate: '',
    relationship: '',
    parentId: '',
  });

  const handleAddMember = () => {
    if (!newMember.name.trim() || !newMember.relationship.trim()) {
      Alert.alert('Қате', 'Аты мен туыстық қатынасын енгізіңіз');
      return;
    }

    const newTreeMember: TreeMember = {
      id: Date.now().toString(),
      name: newMember.name,
      birthDate: newMember.birthDate || new Date().toISOString().split('T')[0],
      parentIds: newMember.parentId ? [newMember.parentId] : [],
      level: newMember.parentId ?
        (members.find(m => m.id === newMember.parentId)?.level || 0) + 1 : 0,
      position: members.filter(m =>
        m.level === (newMember.parentId ?
          (members.find(p => p.id === newMember.parentId)?.level || 0) + 1 : 0)
      ).length,
      relationship: newMember.relationship,
    };

    setMembers(prev => [...prev, newTreeMember]);

    // Добавляем в контекст приложения
    if (selectedFamily) {
      addFamilyMember(selectedFamily, {
        name: newMember.name,
        birthDate: newMember.birthDate || new Date().toISOString().split('T')[0],
        relationship: newMember.relationship,
      });
    }

    setNewMember({ name: '', birthDate: '', relationship: '', parentId: '' });
    setShowAddModal(false);
    Alert.alert('Успех', 'Новый член семьи добавлен!');
  };

  const resetModal = () => {
    setNewMember({ name: '', birthDate: '', relationship: '', parentId: '' });
    setShowAddModal(false);
  };

  const renderFamilyMember = (member: TreeMember) => {
    const left = member.position * (MEMBER_WIDTH + 20);
    const top = member.level * LEVEL_HEIGHT;

    return (
      <TouchableOpacity
        key={member.id}
        style={[styles.memberCard, { left, top }]}
        onPress={() => {
          // TODO: Navigate to member details
        }}
      >
        <View style={styles.photoContainer}>
          {member.photo ? (
            <Image
              source={{ uri: member.photo }}
              style={styles.photo}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderText}>
                {member.name[0].toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.memberName} numberOfLines={2}>
          {member.name}
        </Text>
        <Text style={styles.relationship}>{member.relationship}</Text>
        <Text style={styles.birthDate}>{member.birthDate.split('-')[0]} ж.</Text>
      </TouchableOpacity>
    );
  };

  const renderConnections = () => {
    return members.map((member) => {
      if (member.parentIds.length === 0) return null;

      const parents = members.filter((m) => member.parentIds.includes(m.id));
      if (parents.length === 0) return null;

      const startX = member.position * (MEMBER_WIDTH + 20) + MEMBER_WIDTH / 2;
      const startY = member.level * LEVEL_HEIGHT;
      const endX = parents[0].position * (MEMBER_WIDTH + 20) + MEMBER_WIDTH / 2;
      const endY = (parents[0].level * LEVEL_HEIGHT) + MEMBER_HEIGHT;

      return (
        <View
          key={`connection-${member.id}`}
          style={[
            styles.connection,
            {
              left: Math.min(startX, endX),
              top: endY,
              width: Math.abs(endX - startX),
              height: startY - endY,
            },
          ]}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.title}>Семейное дерево</Text>
          <Text style={styles.subtitle}>
            {members.length} членов семьи
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="person-add-outline" size={24} color={theme.colors.primary[500]} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.treeContainer}
        contentContainerStyle={[
          styles.treeContent,
          {
            width: (MEMBER_WIDTH + 20) * (Math.max(...members.map((m) => m.position)) + 1),
            height: LEVEL_HEIGHT * (Math.max(...members.map((m) => m.level)) + 1),
          },
        ]}
        horizontal
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {renderConnections()}
        {members.map(renderFamilyMember)}
      </ScrollView>

      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={resetModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Добавить члена семьи</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Имя и фамилия"
              value={newMember.name}
              onChangeText={(text) => setNewMember({...newMember, name: text})}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Дата рождения (YYYY-MM-DD)"
              value={newMember.birthDate}
              onChangeText={(text) => setNewMember({...newMember, birthDate: text})}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Родственная связь (например: Сын, Дочь, Внук)"
              value={newMember.relationship}
              onChangeText={(text) => setNewMember({...newMember, relationship: text})}
            />

            <Text style={styles.familyLabel}>Ата-ана таңдаңыз (міндетті емес):</Text>
            <ScrollView style={styles.parentSelector} horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[
                  styles.parentOption,
                  !newMember.parentId && styles.parentOptionSelected
                ]}
                onPress={() => setNewMember({...newMember, parentId: ''})}
              >
                <Text style={[
                  styles.parentOptionText,
                  !newMember.parentId && styles.parentOptionTextSelected
                ]}>
                  Ата-ана жоқ
                </Text>
              </TouchableOpacity>
              {members.map((member) => (
                <TouchableOpacity
                  key={member.id}
                  style={[
                    styles.parentOption,
                    newMember.parentId === member.id && styles.parentOptionSelected
                  ]}
                  onPress={() => setNewMember({...newMember, parentId: member.id})}
                >
                  <Text style={[
                    styles.parentOptionText,
                    newMember.parentId === member.id && styles.parentOptionTextSelected
                  ]}>
                    {member.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={resetModal}
              >
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={handleAddMember}
              >
                <Text style={styles.addButtonText}>Добавить</Text>
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
  headerContent: {
    flex: 1,
  },
  title: {
    ...theme.typography.styles.h3,
    color: theme.colors.text.primary,
  },
  subtitle: {
    ...theme.typography.styles.caption,
    color: theme.colors.text.secondary,
  },
  addButton: {
    padding: theme.spacing.xs,
  },
  treeContainer: {
    flex: 1,
  },
  treeContent: {
    padding: 20,
  },
  memberCard: {
    position: 'absolute',
    width: MEMBER_WIDTH,
    height: MEMBER_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#90EE90',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  photoContainer: {
    width: 60,
    height: 60,
    marginBottom: 6,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    backgroundColor: '#228B22', // Лесной зеленый
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  memberName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D5016', // Темно-зеленый
    textAlign: 'center',
    marginBottom: 2,
  },
  relationship: {
    fontSize: 10,
    color: '#6B8E23', // Оливково-зеленый
    textAlign: 'center',
    marginBottom: 2,
  },
  birthDate: {
    fontSize: 10,
    color: '#6B8E23',
    textAlign: 'center',
  },
  connection: {
    position: 'absolute',
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderColor: '#90EE90',
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
    width: '90%',
    maxHeight: '80%',
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
    marginBottom: 15,
    color: '#2D5016',
  },
  familyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D5016',
    marginBottom: 10,
  },
  parentSelector: {
    maxHeight: 50,
    marginBottom: 20,
  },
  parentOption: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  parentOptionSelected: {
    backgroundColor: '#228B22',
  },
  parentOptionText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 12,
  },
  parentOptionTextSelected: {
    color: '#fff',
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

export default FamilyTreeScreen; 