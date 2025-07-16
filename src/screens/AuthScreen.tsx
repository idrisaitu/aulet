import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../context/AppContext';

import { Button } from '../components/ui/Button';
import { theme } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;

const AuthScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useApp();


  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return false;
    }

    if (!isLogin) {
      if (!name.trim()) {
        Alert.alert('Қате', 'Атыңызды енгізіңіз');
        return false;
      }
      if (password !== confirmPassword) {
        Alert.alert('Қате', 'Құпия сөздер сәйкес келмейді');
        return false;
      }
      if (password.length < 6) {
        Alert.alert('Қате', 'Құпия сөз кемінде 6 таңбадан тұруы керек');
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Қате', 'Дұрыс email мекенжайын енгізіңіз');
      return false;
    }

    return true;
  };

  const handleAuth = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isLogin) {
        const success = await login(email, password);
        if (success) {
          navigation.replace('Main');
        } else {
          Alert.alert('Қате', 'Email немесе құпия сөз дұрыс емес');
        }
      } else {
        // Registration logic (mock)
        Alert.alert('Сәттілік', 'Тіркелу сәтті аяқталды! Енді кіре аласыз.', [
          { text: 'OK', onPress: () => setIsLogin(true) }
        ]);
      }
    } catch (error) {
      Alert.alert('Қате', 'Аутентификация кезінде қате орын алды');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>{isLogin ? 'Кіру' : 'Тіркелу'}</Text>
        <Text style={styles.subtitle}>Отбасылық чатқа қош келдіңіз!</Text>

        <TextInput
          style={styles.input}
          placeholder="Электрондық пошта"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Құпия сөз"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isLogin ? 'Кіру' : 'Тіркелу'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => setIsLogin(!isLogin)}
        >
          <Text style={styles.switchButtonText}>
            {isLogin
              ? 'Аккаунт жоқ па? Тіркелу'
              : 'Аккаунт бар ма? Кіру'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0', // Теплый кремовый фон
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2D5016', // Темно-зеленый
  },
  subtitle: {
    fontSize: 16,
    color: '#6B8E23', // Оливково-зеленый
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 2,
    borderColor: '#90EE90', // Светло-зеленый
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#2D5016',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#228B22', // Лесной зеленый
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#90EE90', // Светло-зеленый для отключенного состояния
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 20,
  },
  switchButtonText: {
    color: '#6B8E23',
    fontSize: 14,
  },
});

export default AuthScreen; 