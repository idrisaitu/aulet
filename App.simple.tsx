import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Простая версия приложения для тестирования
export default function App() {
  const [count, setCount] = useState(0);

  const handlePress = () => {
    setCount(count + 1);
    Alert.alert('Успех!', `Кнопка нажата ${count + 1} раз`);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <Text style={styles.title}>Aulet Family Chat</Text>
      <Text style={styles.subtitle}>Тестовая версия</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Приложение работает!</Text>
        <Text style={styles.cardText}>
          Это простая версия для проверки работоспособности на Android.
        </Text>
        
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Нажми меня ({count})</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.features}>
        <Text style={styles.featuresTitle}>Функции приложения:</Text>
        <Text style={styles.feature}>✅ Семейные чаты</Text>
        <Text style={styles.feature}>✅ Календарь событий</Text>
        <Text style={styles.feature}>✅ Семейное древо</Text>
        <Text style={styles.feature}>✅ ИИ помощник</Text>
        <Text style={styles.feature}>✅ Timeline историй</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2D5016',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B8E23',
    marginBottom: 40,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    maxWidth: 300,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#228B22',
    marginBottom: 12,
    textAlign: 'center',
  },
  cardText: {
    fontSize: 14,
    color: '#2D5016',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#228B22',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  features: {
    width: '100%',
    maxWidth: 300,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D5016',
    marginBottom: 12,
    textAlign: 'center',
  },
  feature: {
    fontSize: 14,
    color: '#6B8E23',
    marginBottom: 6,
    textAlign: 'center',
  },
});
