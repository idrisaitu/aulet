import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useApp, TimeCapsule } from '../context/AppContext';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { theme } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'TimeCapsule'>;

const TimeCapsuleScreen: React.FC<Props> = ({ navigation }) => {
  const { timeCapsules, families, deleteTimeCapsule, deliverTimeCapsule } = useApp();
  const [selectedCapsule, setSelectedCapsule] = useState<TimeCapsule | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'delivered'>('all');

  const filteredCapsules = timeCapsules.filter(capsule => {
    if (filter === 'pending') return !capsule.isDelivered;
    if (filter === 'delivered') return capsule.isDelivered;
    return true;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeUntilDelivery = (deliveryDate: Date) => {
    const now = new Date();
    const diff = deliveryDate.getTime() - now.getTime();
    
    if (diff <= 0) return 'Готово к доставке';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `Через ${days} дн. ${hours} ч.`;
    } else {
      return `Через ${hours} ч.`;
    }
  };

  const handleDeleteCapsule = (capsule: TimeCapsule) => {
    Alert.alert(
      'Удалить капсулу времени',
      `Вы уверены, что хотите удалить "${capsule.title}"?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => deleteTimeCapsule(capsule.id)
        },
      ]
    );
  };

  const handleDeliverNow = (capsule: TimeCapsule) => {
    Alert.alert(
      'Доставить сейчас',
      `Доставить капсулу "${capsule.title}" прямо сейчас?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Доставить',
          onPress: () => {
            deliverTimeCapsule(capsule.id);
            setShowDetailsModal(false);
          }
        },
      ]
    );
  };

  const openDetails = (capsule: TimeCapsule) => {
    setSelectedCapsule(capsule);
    setShowDetailsModal(true);
  };

  const renderCapsule = ({ item }: { item: TimeCapsule }) => {
    const isOverdue = new Date() >= item.deliveryDate && !item.isDelivered;
    
    return (
      <TouchableOpacity
        style={[
          styles.capsuleCard,
          item.isDelivered && styles.deliveredCard,
          isOverdue && styles.overdueCard,
        ]}
        onPress={() => openDetails(item)}
      >
        <View style={styles.capsuleHeader}>
          <View style={styles.capsuleInfo}>
            <Text style={[styles.capsuleTitle, item.isDelivered && styles.deliveredText]}>
              {item.title}
            </Text>
            <Text style={styles.familyName}>{item.familyName}</Text>
          </View>
          
          <View style={styles.capsuleStatus}>
            {item.isDelivered ? (
              <View style={styles.statusBadge}>
                <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
                <Text style={styles.statusText}>Доставлено</Text>
              </View>
            ) : isOverdue ? (
              <View style={[styles.statusBadge, styles.overdueBadge]}>
                <Ionicons name="time" size={16} color={theme.colors.error} />
                <Text style={[styles.statusText, styles.overdueText]}>Готово</Text>
              </View>
            ) : (
              <View style={[styles.statusBadge, styles.pendingBadge]}>
                <Ionicons name="hourglass" size={16} color={theme.colors.warning} />
                <Text style={[styles.statusText, styles.pendingText]}>
                  {getTimeUntilDelivery(item.deliveryDate)}
                </Text>
              </View>
            )}
          </View>
        </View>

        <Text style={styles.capsuleMessage} numberOfLines={2}>
          {item.message}
        </Text>

        <View style={styles.capsuleFooter}>
          <View style={styles.creatorInfo}>
            <Avatar name={item.createdByName} size="xs" />
            <Text style={styles.creatorName}>{item.createdByName}</Text>
          </View>
          
          <Text style={styles.deliveryDate}>
            {formatDate(item.deliveryDate)}
          </Text>
        </View>

        {item.mediaUrl && (
          <View style={styles.mediaIndicator}>
            <Ionicons 
              name={item.mediaType === 'video' ? 'videocam' : 'image'} 
              size={16} 
              color={theme.colors.primary[500]} 
            />
            <Text style={styles.mediaText}>
              {item.mediaType === 'video' ? 'Видео' : 'Фото'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
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
          <Text style={styles.title}>Капсула времени</Text>
          <Text style={styles.subtitle}>
            {filteredCapsules.length} капсул
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateTimeCapsule', {})}
        >
          <Ionicons name="add-circle-outline" size={24} color={theme.colors.primary[500]} />
        </TouchableOpacity>
      </View>

      <View style={styles.filters}>
        {[
          { key: 'all', label: 'Все' },
          { key: 'pending', label: 'Ожидают' },
          { key: 'delivered', label: 'Доставлены' },
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
      </View>

      <FlatList
        data={filteredCapsules}
        renderItem={renderCapsule}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.capsulesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={64} color={theme.colors.text.tertiary} />
            <Text style={styles.emptyTitle}>Нет капсул времени</Text>
            <Text style={styles.emptySubtitle}>
              Создайте первую капсулу времени для своей семьи
            </Text>
            <Button
              title="Создать капсулу"
              onPress={() => navigation.navigate('CreateTimeCapsule', {})}
              style={styles.emptyButton}
            />
          </View>
        }
      />

      {/* Details Modal */}
      <Modal
        visible={showDetailsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedCapsule && (
              <ScrollView>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedCapsule.title}</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowDetailsModal(false)}
                  >
                    <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  <Text style={styles.messageLabel}>Сообщение:</Text>
                  <Text style={styles.messageText}>{selectedCapsule.message}</Text>

                  <View style={styles.detailsGrid}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Семья:</Text>
                      <Text style={styles.detailValue}>{selectedCapsule.familyName}</Text>
                    </View>
                    
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Создал:</Text>
                      <Text style={styles.detailValue}>{selectedCapsule.createdByName}</Text>
                    </View>
                    
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Дата доставки:</Text>
                      <Text style={styles.detailValue}>
                        {formatDate(selectedCapsule.deliveryDate)}
                      </Text>
                    </View>
                    
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Статус:</Text>
                      <Text style={[
                        styles.detailValue,
                        selectedCapsule.isDelivered ? styles.deliveredText : styles.pendingText
                      ]}>
                        {selectedCapsule.isDelivered ? 'Доставлено' : 'Ожидает'}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.modalActions}>
                  {!selectedCapsule.isDelivered && (
                    <Button
                      title="Доставить сейчас"
                      onPress={() => handleDeliverNow(selectedCapsule)}
                      variant="secondary"
                      style={styles.actionButton}
                    />
                  )}
                  
                  <Button
                    title="Удалить"
                    onPress={() => {
                      setShowDetailsModal(false);
                      handleDeleteCapsule(selectedCapsule);
                    }}
                    variant="outline"
                    style={styles.actionButton}
                  />
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
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
  filters: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  filterButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.spacing.radius.lg,
    backgroundColor: theme.colors.background.tertiary,
    marginRight: theme.spacing.sm,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary[500],
  },
  filterButtonText: {
    ...theme.typography.styles.bodySmall,
    color: theme.colors.text.secondary,
  },
  filterButtonTextActive: {
    color: theme.colors.text.inverse,
    fontWeight: '600',
  },
  capsulesList: {
    padding: theme.spacing.lg,
  },
  capsuleCard: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.spacing.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    ...theme.shadows.sm,
  },
  deliveredCard: {
    backgroundColor: theme.colors.background.tertiary,
    opacity: 0.8,
  },
  overdueCard: {
    borderColor: theme.colors.error,
    borderWidth: 2,
  },
  capsuleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  capsuleInfo: {
    flex: 1,
  },
  capsuleTitle: {
    ...theme.typography.styles.h4,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  familyName: {
    ...theme.typography.styles.caption,
    color: theme.colors.text.secondary,
  },
  capsuleStatus: {
    marginLeft: theme.spacing.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.spacing.radius.md,
    backgroundColor: theme.colors.background.tertiary,
  },
  pendingBadge: {
    backgroundColor: theme.colors.warning + '20',
  },
  overdueBadge: {
    backgroundColor: theme.colors.error + '20',
  },
  statusText: {
    ...theme.typography.styles.caption,
    marginLeft: theme.spacing.xs,
    color: theme.colors.text.secondary,
  },
  pendingText: {
    color: theme.colors.warning,
  },
  overdueText: {
    color: theme.colors.error,
  },
  deliveredText: {
    color: theme.colors.text.tertiary,
    textDecorationLine: 'line-through',
  },
  capsuleMessage: {
    ...theme.typography.styles.body,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
    lineHeight: 22,
  },
  capsuleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorName: {
    ...theme.typography.styles.caption,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
  },
  deliveryDate: {
    ...theme.typography.styles.caption,
    color: theme.colors.text.tertiary,
  },
  mediaIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  mediaText: {
    ...theme.typography.styles.caption,
    color: theme.colors.primary[500],
    marginLeft: theme.spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing['6xl'],
  },
  emptyTitle: {
    ...theme.typography.styles.h3,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    ...theme.typography.styles.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing['2xl'],
  },
  emptyButton: {
    marginTop: theme.spacing.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.spacing.radius.xl,
    width: '100%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  modalTitle: {
    ...theme.typography.styles.h3,
    color: theme.colors.text.primary,
    flex: 1,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  modalBody: {
    padding: theme.spacing.lg,
  },
  messageLabel: {
    ...theme.typography.styles.label,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  messageText: {
    ...theme.typography.styles.body,
    color: theme.colors.text.secondary,
    lineHeight: 24,
    marginBottom: theme.spacing.lg,
  },
  detailsGrid: {
    gap: theme.spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    ...theme.typography.styles.bodySmall,
    color: theme.colors.text.secondary,
  },
  detailValue: {
    ...theme.typography.styles.bodySmall,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    gap: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});

export default TimeCapsuleScreen;
