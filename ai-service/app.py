import gradio as gr
from transformers import pipeline

# Modeli Hugging Face'den yükle
model_path = "cardiffnlp/twitter-roberta-base-sentiment-latest"
sentiment_task = pipeline("sentiment-analysis", model=model_path, tokenizer=model_path)

def analyze_sentiment(text):
    """
    Metni analiz eder ve en yüksek skorlu duyguyu döndürür
    """
    if not text or len(text.strip()) == 0:
        return {
            "sentiment": "neutral",
            "score": 0.0
        }
    
    try:
        results = sentiment_task(text[:512])  # Max 512 karakter
        
        # En yüksek skorlu sonucu al
        top_result = results[0]
        label = top_result['label'].lower()
        score = top_result['score']
        
        return {
            "sentiment": label,
            "score": round(score, 3),
            "text": text[:100] + "..." if len(text) > 100 else text
        }
    
    except Exception as e:
        return {
            "sentiment": "neutral",
            "score": 0.0,
            "error": str(e)
        }

# Gradio arayüzünü oluştur
iface = gr.Interface(
    fn=analyze_sentiment,
    inputs=gr.Textbox(lines=2, placeholder="Metin giriniz..."),
    outputs=gr.JSON(label="Sonuç"),
    title="💬 Twitter RoBERTa Duygu Analizi",
    description="cardiffnlp/twitter-roberta-base-sentiment-latest modelini kullanarak metnin duygu analizini yapın (positive/neutral/negative).",
    examples=[
        ["I love the new design of your website!"],
        ["This is terrible and disappointing."],
        ["It's okay, nothing special."],
        ["I drank coffee, then went to work"]
    ]
)

# Arayüzü başlat
iface.launch()