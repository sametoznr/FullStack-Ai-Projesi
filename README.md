# FullStack + AI Stajyer Projesi – Chat Duygu Analizi (Web + Mobil)

Bu repo; kullanıcı mesajlarını kaydeden bir **.NET Core** backend, mesajların duygu analizini yapan bir **Python (Gradio) AI servisi**, web için **React**, mobil için **React Native CLI** istemcilerinden oluşur. Mesaj gönderildiğinde backend, AI servisine istek atar ve (pozitif / nötr / negatif) sonucu anlık olarak arayüzde gösterir.

## Canlı Demo Linkleri

- **Web (Vercel)**: `https://full-stack-ai-projesi.vercel.app/`
- **Backend API (Render)**: `https://fullstack-ai-projesi.onrender.com`
- **AI Servisi (Hugging Face Spaces)**: `https://samet214-chat-sentiment-ai.hf.space/`
- **Mobil (React Native CLI)**: **APK yerine** YouTube/Drive **build videosu**: `https://drive.google.com/file/d/1r5Rx_t2ehHGUb1I86ETzn7fNHPBbTfdT/view?usp=sharing`

---

## Dizin Yapısı

```
repo-root/
├─ frontend/           # React (web) - Vercel'e deploy
├─ mobile/             # React Native CLI (Android/iOS)
├─ backend/            # .NET Core + SQLite - Render'a deploy
└─ ai-service/         # Python + Gradio (Hugging Face Spaces)
```

---

## Teknoloji Yığını ve Barındırma

- **Frontend (Web)**: React → **Vercel**
- **Mobil**: React Native **CLI**
- **Backend**: .NET Core + **SQLite** → **Render**
- **AI Servisi**: Python + **Gradio API** → **Hugging Face Spaces**

---

## AI Servisi (Hugging Face Spaces)

- Kullanılan model: **`cardiffnlp/twitter-roberta-base-sentiment-latest`**
  - Çıkış etiketleri: `negative`, `neutral`, `positive`  
- Seçim gerekçesi: Türkçe 3 sınıflı bir model bulunmadığı için İngilizce 3 sınıflı model seçilmiştir.

### Çalıştırma (lokal)

```bash
cd ai-service
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

---

## Backend (.NET Core + SQLite)

- Kullanıcı kaydı (sadece **rumuz**) ve mesaj kaydı
- AI servisine istek atar, duygu skorunu döndürür
- API uç noktaları:
  - `POST /api/users/register`
  - `POST /api/messages`
  - `GET /api/messages`

### Lokal Çalıştırma

```bash
cd backend
dotnet restore
dotnet run
```

---

## Web Frontend (React – Vercel)

- Mesaj yazma, listeleme, anlık duygu sonucu

### Lokal Çalıştırma

```bash
cd frontend
npm install
npm start
```

---

## Mobil (React Native CLI)

- Chat ekranı React Native CLI ile oluşturuldu
- APK yerine **build videosu** paylaşılacaktır

### Lokal Çalıştırma

```bash
cd mobile
npm install
npm run android
```

---

## Veri Akışı

1. Kullanıcı mesaj yazar → backend’e gönderilir
2. Backend → AI servisine gönderir → sentiment sonucu döner
3. Backend sonucu kaydeder → frontend/mobil arayüze gönderir

---

## Kod Hakimiyeti Kanıtı (Gerçek Durum Açıklaması)

> Bu proje, **Konuşarak Öğren Full Stack + AI Stajyerlik** yönergesi doğrultusunda hazırlanmıştır.  
> Uygulama sürecinde **React Native ve .NET ortamlarında çok sayıda kurulum ve build hatası** yaşandığından,  
> zamanın yetişmesi amacıyla **tüm kodlar yapay zekâ (ChatGPT, Claude, Gemini)** yardımıyla oluşturulmuştur.  
>
> Kodun tamamı yapay zekâ desteğiyle üretilmiş olsa da, geliştirici olarak:
> - Kodların işleyişini adım adım inceledim,  
> - Parçaları birleştirdim, düzenledim ve hataları giderdim,  
> - API bağlantıları, deploy işlemleri, environment değişkenleri ve model entegrasyonlarını bizzat yaptım.  
>
> Dolayısıyla **elle yazılmış bir kod parçası bulunmamakla birlikte**,  
> projenin genel işleyişi, veri akışı ve entegrasyon mantığı tamamen anlaşılmış ve kontrol edilmiştir.  
> Bu durum, projenin amacına uygun olarak “tamamlanabilir bir ürün ortaya koyma” hedefini sağlamıştır.

---
