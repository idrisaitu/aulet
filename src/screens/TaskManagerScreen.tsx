import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../navigation/types';
import { useApp, Task } from '../context/AppContext';

type Props = NativeStackScreenProps<MainTabParamList, 'TaskManager'>;

const TaskManagerScreen: React.FC<Props> = ({ navigation }) => {
  const { tasks, families, addTask, updateTask, deleteTask, toggleTaskComplete, user } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [selectedFamily, setSelectedFamily] = useState<string>('all');

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    familyId: '',
    familyName: '',
    assignedTo: '',
    assignedToName: '',
    dueDate: '',
  });

  const resetTaskForm = () => {
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      familyId: '',
      familyName: '',
      assignedTo: '',
      assignedToName: '',
      dueDate: '',
    });
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      Alert.alert('Ошибка', 'Введите название задачи');
      return;
    }

    if (!newTask.familyId) {
      Alert.alert('Ошибка', 'Выберите семью');
      return;
    }

    if (!user) {
      Alert.alert('Ошибка', 'Пользователь не найден');
      return;
    }

    addTask({
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      priority: newTask.priority,
      familyId: newTask.familyId,
      familyName: newTask.familyName,
      assignedTo: newTask.assignedTo || undefined,
      assignedToName: newTask.assignedToName || undefined,
      completed: false,
      createdBy: user.id,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
    });

    resetTaskForm();
    setShowAddModal(false);
    Alert.alert('Успех', 'Новая задача добавлена!');
  };

  const handleEditTask = () => {
    if (!selectedTask) return;

    if (!newTask.title.trim()) {
      Alert.alert('Қате', 'Тапсырма атын енгізіңіз');
      return;
    }

    updateTask(selectedTask.id, {
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      priority: newTask.priority,
      assignedTo: newTask.assignedTo || undefined,
      assignedToName: newTask.assignedToName || undefined,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
    });

    resetTaskForm();
    setShowEditModal(false);
    setSelectedTask(null);
    Alert.alert('Сәттілік', 'Тапсырма жаңартылды!');
  };

  const handleDeleteTask = (taskId: string) => {
    Alert.alert(
      'Тапсырманы жою',
      'Бұл тапсырманы жою керек пе?',
      [
        { text: 'Жоқ', style: 'cancel' },
        {
          text: 'Иә',
          style: 'destructive',
          onPress: () => {
            deleteTask(taskId);
            Alert.alert('Сәттілік', 'Тапсырма жойылды');
          }
        },
      ]
    );
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      familyId: task.familyId,
      familyName: task.familyName,
      assignedTo: task.assignedTo || '',
      assignedToName: task.assignedToName || '',
      dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
    });
    setShowEditModal(true);
  };

  const openAddModal = () => {
    resetTaskForm();
    setShowAddModal(true);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'pending' && !task.completed) ||
      (filter === 'completed' && task.completed);

    const matchesFamily =
      selectedFamily === 'all' ||
      task.familyId === selectedFamily;

    return matchesFilter && matchesFamily;
  });

  const formatDate = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleDateString('kk-KZ');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff4444';
      case 'medium': return '#ff8800';
      case 'low': return '#00aa00';
      default: return '#666';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Жоғары';
      case 'medium': return 'Орташа';
      case 'low': return 'Төмен';
      default: return 'Орташа';
    }
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View style={[styles.taskCard, item.completed && styles.completedTask]}>
      <View style={styles.taskHeader}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => toggleTaskComplete(item.id)}
        >
          <View style={[styles.checkbox, item.completed && styles.checkedBox]}>
            {item.completed && (
              <Ionicons name="checkmark" size={16} color="#fff" />
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.taskInfo}>
          <Text style={[styles.taskTitle, item.completed && styles.completedText]}>
            {item.title}
          </Text>
          {item.description ? (
            <Text style={[styles.taskDescription, item.completed && styles.completedText]}>
              {item.description}
            </Text>
          ) : null}
        </View>

        <View style={styles.taskActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => openEditModal(item)}
          >
            <Ionicons name="pencil" size={16} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteTask(item.id)}
          >
            <Ionicons name="trash" size={16} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.taskFooter}>
        <View style={styles.taskMeta}>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
            <Text style={styles.priorityText}>{getPriorityText(item.priority)}</Text>
          </View>

          <Text style={styles.familyName}>{item.familyName}</Text>

          {item.assignedToName && (
            <Text style={styles.assignedTo}>→ {item.assignedToName}</Text>
          )}
        </View>

        {item.dueDate && (
          <Text style={[
            styles.dueDate,
            item.dueDate < new Date() && !item.completed && styles.overdue
          ]}>
            {formatDate(item.dueDate)}
          </Text>
        )}
      </View>
    </View>
  );

  const renderTaskModal = (isEdit: boolean) => (
    <Modal
      visible={isEdit ? showEditModal : showAddModal}
      transparent
      animationType="slide"
      onRequestClose={() => {
        if (isEdit) {
          setShowEditModal(false);
          setSelectedTask(null);
        } else {
          setShowAddModal(false);
        }
        resetTaskForm();
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isEdit ? 'Тапсырманы өзгерту' : 'Жаңа тапсырма'}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                if (isEdit) {
                  setShowEditModal(false);
                  setSelectedTask(null);
                } else {
                  setShowAddModal(false);
                }
                resetTaskForm();
              }}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Тапсырма аты *</Text>
              <TextInput
                style={styles.textInput}
                value={newTask.title}
                onChangeText={(text) => setNewTask({...newTask, title: text})}
                placeholder="Тапсырма атын енгізіңіз"
                placeholderTextColor="#999"
                maxLength={100}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Сипаттама</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newTask.description}
                onChangeText={(text) => setNewTask({...newTask, description: text})}
                placeholder="Тапсырма сипаттамасы..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
                maxLength={300}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Маңыздылық деңгейі</Text>
              <View style={styles.priorityButtons}>
                {(['low', 'medium', 'high'] as const).map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityButton,
                      newTask.priority === priority && styles.priorityButtonActive,
                      { borderColor: getPriorityColor(priority) }
                    ]}
                    onPress={() => setNewTask({...newTask, priority})}
                  >
                    <Text style={[
                      styles.priorityButtonText,
                      newTask.priority === priority && { color: getPriorityColor(priority) }
                    ]}>
                      {getPriorityText(priority)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Отбасы *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.familySelector}>
                {families.map((family) => (
                  <TouchableOpacity
                    key={family.id}
                    style={[
                      styles.familyOption,
                      newTask.familyId === family.id && styles.familyOptionSelected
                    ]}
                    onPress={() => setNewTask({
                      ...newTask,
                      familyId: family.id,
                      familyName: family.name
                    })}
                  >
                    <Text style={[
                      styles.familyOptionText,
                      newTask.familyId === family.id && styles.familyOptionTextSelected
                    ]}>
                      {family.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Мерзім</Text>
              <TextInput
                style={styles.textInput}
                value={newTask.dueDate}
                onChangeText={(text) => setNewTask({...newTask, dueDate: text})}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#999"
              />
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                if (isEdit) {
                  setShowEditModal(false);
                  setSelectedTask(null);
                } else {
                  setShowAddModal(false);
                }
                resetTaskForm();
              }}
            >
              <Text style={styles.cancelButtonText}>Болдырмау</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={isEdit ? handleEditTask : handleAddTask}
            >
              <Text style={styles.saveButtonText}>
                {isEdit ? 'Сақтау' : 'Қосу'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Задачи</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={openAddModal}
        >
          <Ionicons name="add-circle-outline" size={24} color="#228B22" />
        </TouchableOpacity>
      </View>

      <View style={styles.filters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {[
            { key: 'all', label: 'Барлығы' },
            { key: 'pending', label: 'Орындалмаған' },
            { key: 'completed', label: 'Орындалған' },
          ].map((filterOption) => (
            <TouchableOpacity
              key={filterOption.key}
              style={[
                styles.filterButton,
                filter === filterOption.key && styles.filterButtonActive
              ]}
              onPress={() => setFilter(filterOption.key as any)}
            >
              <Text style={[
                styles.filterButtonText,
                filter === filterOption.key && styles.filterButtonTextActive
              ]}>
                {filterOption.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFamily === 'all' && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFamily('all')}
          >
            <Text style={[
              styles.filterButtonText,
              selectedFamily === 'all' && styles.filterButtonTextActive
            ]}>
              Барлық отбасы
            </Text>
          </TouchableOpacity>
          {families.map((family) => (
            <TouchableOpacity
              key={family.id}
              style={[
                styles.filterButton,
                selectedFamily === family.id && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFamily(family.id)}
            >
              <Text style={[
                styles.filterButtonText,
                selectedFamily === family.id && styles.filterButtonTextActive
              ]}>
                {family.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredTasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.tasksList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-done-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Тапсырмалар жоқ</Text>
            <Text style={styles.emptySubtitle}>
              Жаңа тапсырма қосу үшін "+" батырмасын басыңыз
            </Text>
          </View>
        }
      />

      {renderTaskModal(false)}
      {renderTaskModal(true)}
    </View>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    padding: 8,
  },
  filters: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterRow: {
    paddingHorizontal: 16,
    marginVertical: 4,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#228B22',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  tasksList: {
    padding: 16,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  completedTask: {
    opacity: 0.7,
    backgroundColor: '#f8f8f8',
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkboxContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#228B22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: '#228B22',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  taskFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  priorityText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  familyName: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  assignedTo: {
    fontSize: 12,
    color: '#228B22',
    fontWeight: '500',
  },
  dueDate: {
    fontSize: 12,
    color: '#666',
  },
  overdue: {
    color: '#ff4444',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalForm: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  priorityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  priorityButtonActive: {
    backgroundColor: 'rgba(34, 139, 34, 0.1)',
  },
  priorityButtonText: {
    fontSize: 14,
    color: '#666',
  },
  familySelector: {
    maxHeight: 50,
  },
  familyOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  familyOptionSelected: {
    backgroundColor: '#228B22',
  },
  familyOptionText: {
    fontSize: 14,
    color: '#666',
  },
  familyOptionTextSelected: {
    color: '#fff',
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: '#228B22',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default TaskManagerScreen;