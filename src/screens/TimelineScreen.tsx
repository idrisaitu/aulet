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
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../navigation/types';
import { useApp } from '../context/AppContext';

type Props = NativeStackScreenProps<MainTabParamList, 'Timeline'>;

interface Story {
  id: string;
  familyId: string;
  familyName: string;
  authorName: string;
  content: string;
  media: string[];
  timestamp: number;
  expiresAt: number;
}

const mockStories: Story[] = [
  {
    id: '1',
    familyId: '1',
    familyName: 'Қасымовтар отбасысы',
    authorName: 'Айгүл',
    content: 'Біздің алғашқы отбасылық саяхатымыз теңізге!',
    media: ['https://example.com/beach.jpg'],
    timestamp: Date.now() - 3600000, // 1 hour ago
    expiresAt: Date.now() + 86400000, // 24 hours from now
  },
  {
    id: '2',
    familyId: '2',
    familyName: 'Ұлы отбасы',
    authorName: 'Қасым ата',
    content: 'Саябақта кешкі серуен',
    media: ['https://example.com/park.jpg'],
    timestamp: Date.now() - 7200000, // 2 hours ago
    expiresAt: Date.now() + 86400000, // 24 hours from now
  },
  {
    id: '3',
    familyId: '1',
    familyName: 'Қасымовтар отбасысы',
    authorName: 'Нұрлан',
    content: 'Арман мен Амина мектепте жақсы оқып жатыр!',
    media: [],
    timestamp: Date.now() - 10800000, // 3 hours ago
    expiresAt: Date.now() + 86400000, // 24 hours from now
  },
];

const { width } = Dimensions.get('window');
const STORY_WIDTH = width - 32;

const TimelineScreen: React.FC<Props> = ({ navigation }) => {
  const { families, user } = useApp();
  const [stories, setStories] = useState<Story[]>(mockStories);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStory, setNewStory] = useState({
    content: '',
    familyId: '',
  });

  const formatTimestamp = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);

    if (hours > 0) {
      return `${hours} сағат бұрын`;
    }
    return `${minutes} минут бұрын`;
  };

  const handleAddStory = () => {
    if (!newStory.content.trim() || !newStory.familyId) {
      Alert.alert('Қате', 'Мазмұнды енгізіп, отбасыны таңдаңыз');
      return;
    }

    const selectedFamily = families.find(f => f.id === newStory.familyId);
    if (!selectedFamily || !user) {
      Alert.alert('Қате', 'Отбасы немесе пайдаланушы табылмады');
      return;
    }

    const newStoryItem: Story = {
      id: Date.now().toString(),
      familyId: newStory.familyId,
      familyName: selectedFamily.name,
      authorName: user.name,
      content: newStory.content,
      media: [],
      timestamp: Date.now(),
      expiresAt: Date.now() + 86400000, // 24 hours from now
    };

    setStories(prev => [newStoryItem, ...prev]);
    setNewStory({ content: '', familyId: '' });
    setShowAddModal(false);
    Alert.alert('Сәттілік', 'Жаңа тарих қосылды!');
  };

  const resetModal = () => {
    setNewStory({ content: '', familyId: '' });
    setShowAddModal(false);
  };

  const renderStory = (story: Story) => (
    <TouchableOpacity
      key={story.id}
      style={styles.storyCard}
      onPress={() => {
        // TODO: Navigate to story details
      }}
    >
      <View style={styles.storyHeader}>
        <View style={styles.storyAuthor}>
          <View style={styles.authorAvatar}>
            <Text style={styles.authorInitial}>
              {story.authorName[0].toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.authorName}>{story.authorName}</Text>
            <Text style={styles.familyName}>{story.familyName}</Text>
          </View>
        </View>
        <Text style={styles.timestamp}>{formatTimestamp(story.timestamp)}</Text>
      </View>

      {story.media.length > 0 && (
        <Image
          source={{ uri: story.media[0] }}
          style={styles.storyImage}
          resizeMode="cover"
        />
      )}

      <Text style={styles.storyContent}>{story.content}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Отбасылық тарихтар</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add-circle-outline" size={24} color="#228B22" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.storiesContainer}
        contentContainerStyle={styles.storiesList}
        showsVerticalScrollIndicator={false}
      >
        {stories.map(renderStory)}
      </ScrollView>

      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={resetModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Жаңа тарих қосу</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Не болып жатыр? Отбасымен бөлісіңіз..."
              value={newStory.content}
              onChangeText={(text) => setNewStory({...newStory, content: text})}
              multiline
              numberOfLines={4}
            />

            <Text style={styles.familyLabel}>Отбасы таңдаңыз:</Text>
            <ScrollView style={styles.familySelector} horizontal showsHorizontalScrollIndicator={false}>
              {families.map((family) => (
                <TouchableOpacity
                  key={family.id}
                  style={[
                    styles.familyOption,
                    newStory.familyId === family.id && styles.familyOptionSelected
                  ]}
                  onPress={() => setNewStory({...newStory, familyId: family.id})}
                >
                  <Text style={[
                    styles.familyOptionText,
                    newStory.familyId === family.id && styles.familyOptionTextSelected
                  ]}>
                    {family.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={resetModal}
              >
                <Text style={styles.cancelButtonText}>Болдырмау</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={handleAddStory}
              >
                <Text style={styles.addButtonText}>Жариялау</Text>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#90EE90',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D5016', // Темно-зеленый
  },
  addButton: {
    padding: 8,
  },
  storiesContainer: {
    flex: 1,
  },
  storiesList: {
    padding: 16,
  },
  storyCard: {
    width: STORY_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#90EE90',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  storyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  storyAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#228B22', // Лесной зеленый
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  authorInitial: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D5016', // Темно-зеленый
  },
  familyName: {
    fontSize: 14,
    color: '#6B8E23', // Оливково-зеленый
  },
  timestamp: {
    fontSize: 14,
    color: '#6B8E23',
  },
  storyImage: {
    width: STORY_WIDTH,
    height: STORY_WIDTH,
  },
  storyContent: {
    padding: 16,
    fontSize: 16,
    color: '#2D5016',
    lineHeight: 24,
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
    textAlignVertical: 'top',
    minHeight: 100,
  },
  familyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D5016',
    marginBottom: 10,
  },
  familySelector: {
    maxHeight: 50,
    marginBottom: 20,
  },
  familyOption: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  familyOptionSelected: {
    backgroundColor: '#228B22',
  },
  familyOptionText: {
    color: '#666',
    fontWeight: '500',
  },
  familyOptionTextSelected: {
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

export default TimelineScreen; 