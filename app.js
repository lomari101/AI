const messagesEl = document.getElementById('messages');
const userInputEl = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const avatarEl = document.getElementById('avatar');

// إضافة رسالة للدردشة
function addMessage(text, sender = 'bot') {
    const div = document.createElement('div');
    div.classList.add('msg', sender);
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

// عند الضغط على إرسال
async function handleSend() {
    const text = userInputEl.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    userInputEl.value = '';
    sendBtn.disabled = true;

    try {
        const reply = await callAI(text);
        addMessage(reply, 'bot');
        speakText(reply);
    } catch (err) {
        console.error(err);
        addMessage("حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.", "bot");
    } finally {
        sendBtn.disabled = false;
    }
}

sendBtn.addEventListener('click', handleSend);
userInputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleSend();
});


// 🔥 ذكاء اصطناعي عبر OpenRouter (أفضل حل لـ GitHub Pages)
async function callAI(userText) {
    const response = await fetch("https://ai-proxy-ilf3.vercel.app/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText })
    });

    const data = await response.json();
    return data.choices[0].message.content;
}



// 🔊 الصوت + تحريك الصورة
function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";

    utterance.onstart = () => avatarEl.classList.add("talking");
    utterance.onend = () => avatarEl.classList.remove("talking");

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
}
