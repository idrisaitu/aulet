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
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { theme } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;

const ModernAuthScreen: React.FC<Props> = ({ navigation }) => {
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
      Alert.alert('Ошибка', 'Заполните все обязательные поля');
      return false;
    }

    if (!isLogin) {
      if (!name.trim()) {
        Alert.alert('Ошибка', 'Введите ваше имя');
        return false;
      }
      if (password !== confirmPassword) {
        Alert.alert('Ошибка', 'Пароли не совпадают');
        return false;
      }
      if (password.length < 6) {
        Alert.alert('Ошибка', 'Пароль должен содержать минимум 6 символов');
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Ошибка', 'Введите корректный email адрес');
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary[500]} />
        <Text style={styles.loadingText}>Жүктелуде...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../logo.jpg')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.appName}>Aulet</Text>
            <Text style={styles.tagline}>
              Оставайтесь на связи с семьей
            </Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.formHeader}>
            <Text style={styles.title}>
              {isLogin ? 'Добро пожаловать' : 'Создать новый аккаунт'}
            </Text>
            <Text style={styles.subtitle}>
              {isLogin
                ? 'Войдите в свой аккаунт'
                : 'Присоединяйтесь к семейному чату'
              }
            </Text>
          </View>

          <View style={styles.form}>
            {!isLogin && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Толық атыңыз</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={20} color={theme.colors.text.tertiary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Атыңызды енгізіңіз"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    placeholderTextColor={theme.colors.text.tertiary}
                  />
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email мекенжайы</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color={theme.colors.text.tertiary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="example@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor={theme.colors.text.tertiary}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Құпия сөз</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color={theme.colors.text.tertiary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={isLogin ? "Құпия сөзіңіз" : "Кемінде 6 таңба"}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  placeholderTextColor={theme.colors.text.tertiary}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color={theme.colors.text.tertiary} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {!isLogin && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Құпия сөзді растау</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color={theme.colors.text.tertiary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Құпия сөзді қайталаңыз"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    placeholderTextColor={theme.colors.text.tertiary}
                  />
                </View>
              </View>
            )}

            <Button
              title={loading ? 'Күте тұрыңыз...' : (isLogin ? 'Кіру' : 'Тіркелу')}
              onPress={handleAuth}
              disabled={loading}
              loading={loading}
              style={styles.authButton}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>немесе</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.switchButton}
              onPress={toggleAuthMode}
            >
              <Text style={styles.switchText}>
                {isLogin 
                  ? 'Аккаунтыңыз жоқ па? ' 
                  : 'Аккаунтыңыз бар ма? '
                }
                <Text style={styles.switchTextBold}>
                  {isLogin ? 'Тіркелу' : 'Кіру'}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
  },
  loadingText: {
    ...theme.typography.styles.body,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: theme.spacing['6xl'],
    paddingBottom: theme.spacing['4xl'],
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  appName: {
    ...theme.typography.styles.h1,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  tagline: {
    ...theme.typography.styles.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    borderTopLeftRadius: theme.spacing.radius['3xl'],
    borderTopRightRadius: theme.spacing.radius['3xl'],
    paddingHorizontal: theme.spacing['2xl'],
    paddingTop: theme.spacing['3xl'],
    ...theme.shadows.lg,
  },
  formHeader: {
    marginBottom: theme.spacing['3xl'],
  },
  title: {
    ...theme.typography.styles.h2,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.styles.body,
    color: theme.colors.text.secondary,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    ...theme.typography.styles.label,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.spacing.radius.md,
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.spacing.md,
    height: theme.spacing.input.md,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    ...theme.typography.styles.body,
    color: theme.colors.text.primary,
  },
  eyeButton: {
    padding: theme.spacing.xs,
  },
  authButton: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing['2xl'],
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border.light,
  },
  dividerText: {
    ...theme.typography.styles.caption,
    color: theme.colors.text.tertiary,
    marginHorizontal: theme.spacing.md,
  },
  switchButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  switchText: {
    ...theme.typography.styles.body,
    color: theme.colors.text.secondary,
  },
  switchTextBold: {
    color: theme.colors.primary[600],
    fontWeight: '600',
  },
});

export default ModernAuthScreen;
