import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../navigation/types';
import { useApp, Event } from '../context/AppContext';

type Props = NativeStackScreenProps<MainTabParamList, 'Calendar'>;

const CalendarScreen: React.FC<Props> = ({ navigation }) => {
  const { events, families, addEvent, user } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    time: '',
    familyId: '',
  });

  const filteredEvents = events.filter(
    (event) => event.date === selectedDate.toISOString().split('T')[0]
  );

  const handleAddEvent = () => {
    if (!newEvent.title.trim() || !newEvent.time.trim() || !newEvent.familyId) {
      Alert.alert('Қате', 'Барлық міндетті өрістерді толтырыңыз');
      return;
    }

    const selectedFamily = families.find(f => f.id === newEvent.familyId);
    if (!selectedFamily) {
      Alert.alert('Қате', 'Отбасы таңдалмаған');
      return;
    }

    addEvent({
      title: newEvent.title,
      description: newEvent.description,
      date: selectedDate.toISOString().split('T')[0],
      time: newEvent.time,
      familyId: newEvent.familyId,
      familyName: selectedFamily.name,
      createdBy: user?.id || '',
    });

    setNewEvent({ title: '', description: '', time: '', familyId: '' });
    setShowAddModal(false);
    Alert.alert('Сәттілік', 'Жаңа оқиға қосылды!');
  };

  const resetModal = () => {
    setNewEvent({ title: '', description: '', time: '', familyId: '' });
    setShowAddModal(false);
  };

  // Generate dates for the current week
  const generateWeekDates = () => {
    const dates = [];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = generateWeekDates();

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isSelectedDate = (date: Date) => {
    return formatDate(date) === formatDate(selectedDate);
  };

  const renderEventItem = ({ item }: { item: Event }) => (
    <TouchableOpacity
      style={styles.eventItem}
      onPress={() => {
        // TODO: Navigate to event details
      }}
    >
      <View style={styles.eventTime}>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
      
      <View style={styles.eventContent}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventFamily}>{item.familyName}</Text>
        <Text style={styles.eventDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Күнтізбе</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add-circle-outline" size={24} color="#228B22" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.calendar}
        contentContainerStyle={styles.calendarContent}
      >
        {weekDates.map((date, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dateItem,
              isSelectedDate(date) && styles.selectedDateItem
            ]}
            onPress={() => setSelectedDate(date)}
          >
            <Text style={[
              styles.dayName,
              isSelectedDate(date) && styles.selectedDayName
            ]}>
              {date.toLocaleDateString('ru-RU', { weekday: 'short' })}
            </Text>
            <Text style={[
              styles.dateNumber,
              isSelectedDate(date) && styles.selectedDateNumber
            ]}>
              {date.getDate()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.eventsContainer}>
        <Text style={styles.eventsTitle}>Оқиғалар</Text>
        {filteredEvents.length > 0 ? (
          <FlatList
            data={filteredEvents}
            renderItem={renderEventItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.eventsList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.noEvents}>
            <Text style={styles.noEventsText}>
              Таңдалған күнге оқиғалар жоқ
            </Text>
          </View>
        )}
      </View>

      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={resetModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Жаңа оқиға қосу</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Оқиға атауы"
              value={newEvent.title}
              onChangeText={(text) => setNewEvent({...newEvent, title: text})}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Сипаттама"
              value={newEvent.description}
              onChangeText={(text) => setNewEvent({...newEvent, description: text})}
              multiline
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Уақыт (мысалы: 18:00)"
              value={newEvent.time}
              onChangeText={(text) => setNewEvent({...newEvent, time: text})}
            />

            <Text style={styles.familyLabel}>Отбасы таңдаңыз:</Text>
            <ScrollView style={styles.familySelector} horizontal showsHorizontalScrollIndicator={false}>
              {families.map((family) => (
                <TouchableOpacity
                  key={family.id}
                  style={[
                    styles.familyOption,
                    newEvent.familyId === family.id && styles.familyOptionSelected
                  ]}
                  onPress={() => setNewEvent({...newEvent, familyId: family.id})}
                >
                  <Text style={[
                    styles.familyOptionText,
                    newEvent.familyId === family.id && styles.familyOptionTextSelected
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
                onPress={handleAddEvent}
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
  calendar: {
    height: 100,
    paddingVertical: 10,
  },
  calendarContent: {
    paddingHorizontal: 16,
  },
  dateItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    minWidth: 50,
  },
  selectedDateItem: {
    backgroundColor: '#007AFF',
  },
  dayName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  selectedDayName: {
    color: '#fff',
  },
  dateNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  selectedDateNumber: {
    color: '#fff',
  },
  eventsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginVertical: 16,
  },
  eventsList: {
    paddingBottom: 16,
  },
  eventItem: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  eventTime: {
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  eventFamily: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: '#999',
  },
  noEvents: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noEventsText: {
    fontSize: 16,
    color: '#6B8E23',
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

export default CalendarScreen; 