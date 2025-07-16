import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { theme } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateTimeCapsule'>;

const CreateTimeCapsuleScreen: React.FC<Props> = ({ navigation, route }) => {
  const { familyId } = route.params;
  const { families, addTimeCapsule, user } = useApp();
  
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [selectedFamilyId, setSelectedFamilyId] = useState(familyId || '');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'photo' | 'video' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectedFamily = families.find(f => f.id === selectedFamilyId);

  const handleAddMedia = () => {
    Alert.alert(
      'Добавить медиа',
      'Выберите тип медиа для капсулы времени',
      [
        {
          text: 'Фото',
          onPress: () => {
            // В реальном приложении здесь будет ImagePicker
            setMediaUrl('https://via.placeholder.com/300x200/4ade80/ffffff?text=Family+Photo');
            setMediaType('photo');
          }
        },
        {
          text: 'Видео',
          onPress: () => {
            // В реальном приложении здесь будет ImagePicker для видео
            setMediaUrl('https://via.placeholder.com/300x200/3b82f6/ffffff?text=Family+Video');
            setMediaType('video');
          }
        },
        { text: 'Отмена', style: 'cancel' },
      ]
    );
  };

  const removeMedia = () => {
    setMediaUrl(null);
    setMediaType(null);
  };

  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert('Ошибка', 'Введите название капсулы');
      return false;
    }
    
    if (!message.trim()) {
      Alert.alert('Ошибка', 'Введите сообщение');
      return false;
    }
    
    if (!selectedFamilyId) {
      Alert.alert('Ошибка', 'Выберите семью');
      return false;
    }
    
    if (!deliveryDate) {
      Alert.alert('Ошибка', 'Выберите дату доставки');
      return false;
    }
    
    if (!deliveryTime) {
      Alert.alert('Ошибка', 'Выберите время доставки');
      return false;
    }

    // Проверяем, что дата в будущем
    const deliveryDateTime = new Date(`${deliveryDate}T${deliveryTime}`);
    if (deliveryDateTime <= new Date()) {
      Alert.alert('Ошибка', 'Дата доставки должна быть в будущем');
      return false;
    }

    return true;
  };

  const handleCreateCapsule = async () => {
    if (!validateForm() || !user) return;

    setIsLoading(true);
    try {
      const deliveryDateTime = new Date(`${deliveryDate}T${deliveryTime}`);
      
      await addTimeCapsule({
        title: title.trim(),
        message: message.trim(),
        mediaUrl: mediaUrl || undefined,
        mediaType: mediaType || undefined,
        familyId: selectedFamilyId,
        familyName: selectedFamily?.name || '',
        createdBy: user.id,
        createdByName: user.name,
        deliveryDate: deliveryDateTime,
      });

      Alert.alert(
        'Успех!',
        'Капсула времени создана и будет доставлена в указанное время.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось создать капсулу времени');
    } finally {
      setIsLoading(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMinTime = () => {
    const now = new Date();
    const isToday = deliveryDate === now.toISOString().split('T')[0];
    if (isToday) {
      now.setHours(now.getHours() + 1);
      return now.toTimeString().slice(0, 5);
    }
    return '00:00';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Создать капсулу времени</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Название капсулы *</Text>
          <TextInput
            style={styles.textInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Например: День рождения сына"
            placeholderTextColor={theme.colors.text.tertiary}
            maxLength={100}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Сообщение *</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={message}
            onChangeText={setMessage}
            placeholder="Напишите сообщение, которое будет доставлено в будущем..."
            placeholderTextColor={theme.colors.text.tertiary}
            multiline
            numberOfLines={4}
            maxLength={1000}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Семья *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.familySelector}>
            {families.map((family) => (
              <TouchableOpacity
                key={family.id}
                style={[
                  styles.familyOption,
                  selectedFamilyId === family.id && styles.familyOptionSelected
                ]}
                onPress={() => setSelectedFamilyId(family.id)}
              >
                <Text style={[
                  styles.familyOptionText,
                  selectedFamilyId === family.id && styles.familyOptionTextSelected
                ]}>
                  {family.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.dateTimeContainer}>
          <View style={styles.dateTimeGroup}>
            <Text style={styles.inputLabel}>Дата доставки *</Text>
            <TextInput
              style={styles.textInput}
              value={deliveryDate}
              onChangeText={setDeliveryDate}
              placeholder="ГГГГ-ММ-ДД"
              placeholderTextColor={theme.colors.text.tertiary}
            />
            <Text style={styles.hint}>Минимум: {getMinDate()}</Text>
          </View>

          <View style={styles.dateTimeGroup}>
            <Text style={styles.inputLabel}>Время доставки *</Text>
            <TextInput
              style={styles.textInput}
              value={deliveryTime}
              onChangeText={setDeliveryTime}
              placeholder="ЧЧ:ММ"
              placeholderTextColor={theme.colors.text.tertiary}
            />
            <Text style={styles.hint}>Формат: 24 часа</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Медиа (необязательно)</Text>
          {mediaUrl ? (
            <View style={styles.mediaPreview}>
              <Image source={{ uri: mediaUrl }} style={styles.mediaImage} />
              <View style={styles.mediaOverlay}>
                <View style={styles.mediaInfo}>
                  <Ionicons 
                    name={mediaType === 'video' ? 'videocam' : 'image'} 
                    size={24} 
                    color={theme.colors.text.inverse} 
                  />
                  <Text style={styles.mediaTypeText}>
                    {mediaType === 'video' ? 'Видео' : 'Фото'}
                  </Text>
                </View>
                <TouchableOpacity style={styles.removeMediaButton} onPress={removeMedia}>
                  <Ionicons name="close-circle" size={24} color={theme.colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.addMediaButton} onPress={handleAddMedia}>
              <Ionicons name="add-circle-outline" size={32} color={theme.colors.primary[500]} />
              <Text style={styles.addMediaText}>Добавить фото или видео</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color={theme.colors.info} />
          <Text style={styles.infoText}>
            Капсула времени будет автоматически доставлена в указанную дату и время как сообщение в семейный чат.
          </Text>
        </View>

        <Button
          title={isLoading ? 'Создание...' : 'Создать капсулу времени'}
          onPress={handleCreateCapsule}
          disabled={isLoading}
          loading={isLoading}
          style={styles.createButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  contentContainer: {
    paddingBottom: theme.spacing['3xl'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    ...theme.shadows.sm,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  title: {
    ...theme.typography.styles.h3,
    color: theme.colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  form: {
    padding: theme.spacing.lg,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    ...theme.typography.styles.label,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.spacing.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: 16,
    backgroundColor: theme.colors.background.primary,
    color: theme.colors.text.primary,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  familySelector: {
    maxHeight: 50,
  },
  familyOption: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.spacing.radius.lg,
    backgroundColor: theme.colors.background.tertiary,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  familyOptionSelected: {
    backgroundColor: theme.colors.primary[500],
    borderColor: theme.colors.primary[500],
  },
  familyOptionText: {
    ...theme.typography.styles.bodySmall,
    color: theme.colors.text.secondary,
  },
  familyOptionTextSelected: {
    color: theme.colors.text.inverse,
    fontWeight: '600',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  dateTimeGroup: {
    flex: 1,
  },
  hint: {
    ...theme.typography.styles.caption,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
  },
  mediaPreview: {
    position: 'relative',
    borderRadius: theme.spacing.radius.md,
    overflow: 'hidden',
  },
  mediaImage: {
    width: '100%',
    height: 200,
    backgroundColor: theme.colors.background.tertiary,
  },
  mediaOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: theme.spacing.md,
  },
  mediaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.spacing.radius.md,
  },
  mediaTypeText: {
    ...theme.typography.styles.caption,
    color: theme.colors.text.inverse,
    marginLeft: theme.spacing.xs,
  },
  removeMediaButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
  },
  addMediaButton: {
    borderWidth: 2,
    borderColor: theme.colors.primary[500],
    borderStyle: 'dashed',
    borderRadius: theme.spacing.radius.md,
    paddingVertical: theme.spacing['3xl'],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary[50],
  },
  addMediaText: {
    ...theme.typography.styles.body,
    color: theme.colors.primary[600],
    marginTop: theme.spacing.sm,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.info + '10',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.info,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.spacing.radius.sm,
    marginBottom: theme.spacing.lg,
  },
  infoText: {
    ...theme.typography.styles.bodySmall,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
    flex: 1,
    lineHeight: 20,
  },
  createButton: {
    marginTop: theme.spacing.lg,
  },
});

export default CreateTimeCapsuleScreen;
