import React, { useEffect, useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
  Provider as PaperProvider,
  MD3LightTheme as DefaultTheme,
  ActivityIndicator
} from 'react-native-paper';

import Header from './src/Header';
import UserModal from './src/UserModal';
import MessageList from './src/MessageList';
import MessageInput from './src/MessageInput';

const API_URL = 'https://fullstack-ai-projesi.onrender.com/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('chatUser');
        if (saved) {
          const u = JSON.parse(saved);
          setUser(u);
          await loadMessages();
        } else {
          setShowRegister(true);
        }
      } catch {
        setShowRegister(true);
      }
    })();
  }, []);

  const loadMessages = async () => {
    try {
      const res = await axios.get(`${API_URL}/messages?limit=50`);
      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch {
      Alert.alert('Hata', 'Mesajlar alınamadı.');
    }
  };

  const handleRegister = async (nickname) => {
    if (!nickname?.trim()) return;
    try {
      setBusy(true);
      const res = await axios.post(`${API_URL}/users/register`, { nickname: nickname.trim() });
      const userData = res.data;
      setUser(userData);
      await AsyncStorage.setItem('chatUser', JSON.stringify(userData));
      setShowRegister(false);
      await loadMessages();
    } catch (err) {
      if (err?.response?.status === 409) {
        Alert.alert('Uyarı', 'Bu rumuz zaten kullanılıyor.');
      } else {
        Alert.alert('Hata', 'Kayıt başarısız.');
      }
    } finally {
      setBusy(false);
    }
  };

  const handleSendMessage = async (content) => {
    if (!user) return;
    const text = content.trim();
    if (!text) return;
    try {
      setBusy(true);
      const res = await axios.post(`${API_URL}/messages`, {
        userId: user.id,
        content: text,
      });
      setMessages((prev) => [...prev, res.data]);
    } catch {
      Alert.alert('Hata', 'Mesaj gönderilemedi.');
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('chatUser');
    setUser(null);
    setMessages([]);
    setShowRegister(true);
  };

  return (
    <PaperProvider theme={DefaultTheme}>
      <View style={styles.root}>
        {user ? <Header user={user} onLogout={handleLogout} /> : null}

        {user ? (
          <>
            <MessageList messages={messages} currentUserId={user.id} />
            <MessageInput onSendMessage={handleSendMessage} loading={busy} />
          </>
        ) : null}

        <UserModal open={showRegister} onRegister={handleRegister} loading={busy} />

        {busy && messages.length === 0 ? (
          <ActivityIndicator style={{ marginTop: 24 }} />
        ) : null}
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F6F7F9' },
});
