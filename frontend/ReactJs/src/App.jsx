import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, Paper, Box } from '@mui/material';
import Header from './components/Header';
import UserModal from './components/UserModal';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';


const API_URL = "https://fullstack-ai-projesi.onrender.com/api"

function App() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('chatUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      loadMessages();
    } else {
      setShowModal(true);
    }
  }, []);

  const handleRegister = async (nickname) => {
    try {
      setLoading(true);

      const response = await axios.post(`${API_URL}/users/register`, {
        nickname: nickname
      });

      const userData = response.data;
      setUser(userData);
      localStorage.setItem('chatUser', JSON.stringify(userData));
      setShowModal(false);
      loadMessages();
      toast.success(`Hoş geldin ${userData.nickname}! 🎉`);
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error('Bu rumuz zaten kullanılıyor');
      } else {
        toast.error('Kayıt başarısız. Lütfen tekrar deneyin : ', err);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const response = await axios.get(`${API_URL}/messages?limit=50`);
      setMessages(response.data);
    } catch (err) {
      console.error('Mesajlar yüklenemedi:', err);
      toast.error('Mesajlar yüklenirken hata oluştu');
    }
  };

  const handleSendMessage = async (content) => {
    if (!user) return;

    try {
      setLoading(true);

      const response = await axios.post(`${API_URL}/messages`, {
        userId: user.id,
        content: content
      });

      setMessages([...messages, response.data]);
      toast.success('Mesaj gönderildi! 📤');
    } catch (err) {
      toast.error('Mesaj gönderilemedi');
      console.error('Mesaj hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('chatUser');
    setUser(null);
    setMessages([]);
    setShowModal(true);
    toast.info('Çıkış yapıldı');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <UserModal
        open={showModal}
        onRegister={handleRegister}
        loading={loading}
      />


      {user && (
        <Header user={user} onLogout={handleLogout} />
      )}


      {user && (
        <Container maxWidth="md" sx={{ mt: 3, mb: 3 }}>
          <Paper elevation={3} sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              <MessageList
                messages={messages}
                currentUserId={user.id}
              />
            </Box>
            <MessageInput
              onSendMessage={handleSendMessage}
              loading={loading}
            />
          </Paper>
        </Container>
      )}
    </Box>
  );
}

export default App;