import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../navigation/types';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';

type Props = NativeStackScreenProps<MainTabParamList, 'Profile'>;

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, logout, families } = useApp();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleLogout = () => {
    Alert.alert(
      'Шығу',
      'Шынымен шығуды қалайсыз ба?',
      [
        { text: 'Болдырмау', style: 'cancel' },
        { 
          text: 'Шығу', 
          style: 'destructive',
          onPress: logout 
        },
      ]
    );
  };

  const handleSaveProfile = () => {
    // TODO: Implement profile update
    setShowEditModal(false);
    Alert.alert('Сәттілік', 'Профиль жаңартылды');
  };

  const menuItems = [
    {
      icon: 'people-outline' as const,
      title: 'Отбасыларым',
      subtitle: `${families.length} отбасы`,
      onPress: () => navigation.navigate('Chats'),
    },
    {
      icon: 'settings-outline' as const,
      title: 'Баптаулар',
      subtitle: 'Қолданба параметрлері',
      onPress: () => (navigation as any).navigate('Settings'),
    },
    {
      icon: 'notifications-outline' as const,
      title: 'Хабарландырулар',
      subtitle: 'Хабарландыру параметрлері',
      onPress: () => Alert.alert('Хабарландырулар', 'Жақында қосылады'),
    },
    {
      icon: 'shield-checkmark-outline' as const,
      title: 'Қауіпсіздік',
      subtitle: 'Құпиялылық пен қауіпсіздік',
      onPress: () => Alert.alert('Қауіпсіздік', 'Жақында қосылады'),
    },
    {
      icon: 'help-circle-outline' as const,
      title: 'Көмек',
      subtitle: 'Жиі қойылатын сұрақтар',
      onPress: () => Alert.alert('Көмек', 'Жақында қосылады'),
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Профиль</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setShowEditModal(true)}
          >
            <Ionicons name="create-outline" size={24} color="#228B22" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: user?.avatar || 'https://via.placeholder.com/80' }}
                style={styles.avatar}
                defaultSource={{ uri: 'https://via.placeholder.com/80' }}
              />
              <TouchableOpacity style={styles.avatarEditButton}>
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <View style={styles.statsContainer}>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>{families.length}</Text>
                  <Text style={styles.statLabel}>Отбасы</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>
                    {families.reduce((acc, family) => acc + family.members.length, 0)}
                  </Text>
                  <Text style={styles.statLabel}>Мүше</Text>
                </View>
              </View>
            </View>
          </View>
        </Card>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <Card key={index} style={styles.menuItem}>
              <TouchableOpacity
                style={styles.menuItemContent}
                onPress={item.onPress}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIcon}>
                    <Ionicons name={item.icon} size={24} color="#228B22" />
                  </View>
                  <View>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6B8E23" />
              </TouchableOpacity>
            </Card>
          ))}
        </View>

        {/* Logout Button */}
        <Card style={styles.logoutCard}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#DC3545" />
            <Text style={styles.logoutText}>Шығу</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Профильді өңдеу</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Аты-жөні"
              value={editedUser.name}
              onChangeText={(text) => setEditedUser({...editedUser, name: text})}
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Электрондық пошта"
              value={editedUser.email}
              onChangeText={(text) => setEditedUser({...editedUser, email: text})}
              keyboardType="email-address"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelButtonText}>Болдырмау</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Сақтау</Text>
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
    backgroundColor: '#FFF8F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D5016',
  },
  editButton: {
    padding: 8,
  },
  profileCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#90EE90',
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#228B22',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6B8E23',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
  },
  stat: {
    alignItems: 'center',
    marginRight: 24,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#228B22',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B8E23',
    marginTop: 2,
  },
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  menuItem: {
    marginBottom: 12,
    padding: 0,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FFF0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D5016',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#6B8E23',
  },
  logoutCard: {
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 0,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC3545',
    marginLeft: 8,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D5016',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalInput: {
    borderWidth: 2,
    borderColor: '#90EE90',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    color: '#2D5016',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#228B22',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
