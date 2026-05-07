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
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": "Bearer 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",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "google/gemma-2-9b-it",
            messages: [
                { role: "system", content: "كن صديقًا ودودًا يتحدث باللهجة العربية." },
                { role: "user", content: userText }
            ]
        })
    });

    const data = await response.json();

    try {
        return data.choices[0].message.content;
    } catch {
        return "لم أفهم رسالتك يا صديقي 😅";
    }
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
