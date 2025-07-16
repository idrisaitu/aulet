import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../navigation/types';
import { useApp } from '../context/AppContext';

type Props = NativeStackScreenProps<MainTabParamList, 'Settings'>;

const FamilyCreateScreen: React.FC<Props> = ({ navigation }) => {
  const { addFamily, generateFamilyCode, user } = useApp();
  const [familyName, setFamilyName] = useState('');
  const [familyDescription, setFamilyDescription] = useState('');
  const [familyPhoto, setFamilyPhoto] = useState<string | null>(null);
  const [familyCode, setFamilyCode] = useState('');
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateCode = () => {
    const newCode = generateFamilyCode();
    setFamilyCode(newCode);
  };

  const handlePickImage = async () => {
    try {
      // Временная заглушка - в реальном приложении здесь будет ImagePicker
      Alert.alert('Информация', 'Функция выбора фото в разработке');
      // Демо сурет
      setFamilyPhoto('https://via.placeholder.com/120x120/228B22/FFFFFF?text=Family');
    } catch (error) {
      Alert.alert('Ошибка', 'Ошибка при выборе фото');
    }
  };

  const handleTakePhoto = async () => {
    try {
      // Временная заглушка - в реальном приложении здесь будет ImagePicker
      Alert.alert('Ақпарат', 'Камера функциясы әзірлеу кезеңінде');
      // Демо сурет
      setFamilyPhoto('https://via.placeholder.com/120x120/228B22/FFFFFF?text=Photo');
    } catch (error) {
      Alert.alert('Қате', 'Сурет түсіру кезінде қате орын алды');
    }
  };

  const handleCreateFamily = async () => {
    if (!familyName.trim()) {
      Alert.alert('Қате', 'Отбасы атын енгізіңіз');
      return;
    }

    if (!familyCode.trim()) {
      Alert.alert('Қате', 'Отбасы кодын генерациялаңыз');
      return;
    }

    if (!user) {
      Alert.alert('Қате', 'Пайдаланушы табылмады');
      return;
    }

    setIsLoading(true);
    try {
      addFamily({
        name: familyName.trim(),
        code: familyCode,
        description: familyDescription.trim(),
        avatar: familyPhoto || undefined,
        members: [{
          id: user.id,
          name: user.name,
          birthDate: '1985-03-15', // This should come from user profile
          relationship: 'Өзім',
          avatar: user.avatar,
        }],
      });

      setShowCodeModal(true);
    } catch (error) {
      Alert.alert('Қате', 'Отбасы құру кезінде қате орын алды');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowCodeModal(false);
    // Reset form
    setFamilyName('');
    setFamilyDescription('');
    setFamilyPhoto(null);
    setFamilyCode('');
    // Navigate back or to family list
    navigation.goBack();
  };

  const copyCodeToClipboard = () => {
    // In a real app, you would use Clipboard API
    Alert.alert('Көшірілді', `Отбасы коды көшірілді: ${familyCode}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Создать новую семью</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.form}>
        <View style={styles.photoSection}>
          <Text style={styles.sectionTitle}>Отбасылық сурет</Text>
          <TouchableOpacity style={styles.photoContainer} onPress={() => {
            Alert.alert(
              'Сурет таңдау',
              'Суретті қайдан таңдайсыз?',
              [
                { text: 'Галереядан', onPress: handlePickImage },
                { text: 'Камерадан', onPress: handleTakePhoto },
                { text: 'Болдырмау', style: 'cancel' },
              ]
            );
          }}>
            {familyPhoto ? (
              <Image source={{ uri: familyPhoto }} style={styles.familyPhoto} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons name="camera-outline" size={32} color="#999" />
                <Text style={styles.photoPlaceholderText}>Сурет қосу</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Отбасы ақпараты</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Отбасы аты *</Text>
            <TextInput
              style={styles.textInput}
              value={familyName}
              onChangeText={setFamilyName}
              placeholder="мысалы: Қасымовтар отбасысы"
              placeholderTextColor="#999"
              maxLength={50}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Сипаттама</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={familyDescription}
              onChangeText={setFamilyDescription}
              placeholder="Отбасы туралы қысқаша ақпарат..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              maxLength={200}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Отбасы коды</Text>
            <View style={styles.codeContainer}>
              <TextInput
                style={[styles.textInput, styles.codeInput]}
                value={familyCode}
                onChangeText={setFamilyCode}
                placeholder="Код генерациялаңыз"
                placeholderTextColor="#999"
                maxLength={10}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={styles.generateButton}
                onPress={handleGenerateCode}
              >
                <Ionicons name="refresh" size={20} color="#228B22" />
                <Text style={styles.generateButtonText}>Генерация</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.codeHint}>
              Бұл код арқылы басқа адамдар сіздің отбасыңызға қосыла алады
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.createButton, isLoading && styles.createButtonDisabled]}
          onPress={handleCreateFamily}
          disabled={isLoading}
        >
          <Text style={styles.createButtonText}>
            {isLoading ? 'Құрылуда...' : 'Отбасы құру'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showCodeModal}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="checkmark-circle" size={48} color="#228B22" />
              <Text style={styles.modalTitle}>Отбасы сәтті құрылды!</Text>
            </View>

            <View style={styles.codeDisplay}>
              <Text style={styles.codeDisplayLabel}>Отбасы коды:</Text>
              <View style={styles.codeDisplayContainer}>
                <Text style={styles.codeDisplayText}>{familyCode}</Text>
                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={copyCodeToClipboard}
                >
                  <Ionicons name="copy-outline" size={20} color="#228B22" />
                </TouchableOpacity>
              </View>
              <Text style={styles.codeDisplayHint}>
                Бұл кодты отбасы мүшелерімен бөлісіңіз
              </Text>
            </View>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.modalButtonText}>Жабу</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    paddingBottom: 32,
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
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  form: {
    padding: 16,
  },
  photoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  photoContainer: {
    alignSelf: 'center',
  },
  familyPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  photoPlaceholderText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  inputSection: {
    marginBottom: 24,
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
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeInput: {
    flex: 1,
    marginRight: 12,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f0f8f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#228B22',
  },
  generateButtonText: {
    fontSize: 14,
    color: '#228B22',
    marginLeft: 4,
    fontWeight: '500',
  },
  codeHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  createButton: {
    backgroundColor: '#228B22',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: '#ccc',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 320,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
    textAlign: 'center',
  },
  codeDisplay: {
    marginBottom: 24,
  },
  codeDisplayLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  codeDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  codeDisplayText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#228B22',
    letterSpacing: 2,
  },
  copyButton: {
    marginLeft: 12,
    padding: 4,
  },
  codeDisplayHint: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalButton: {
    backgroundColor: '#228B22',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default FamilyCreateScreen;