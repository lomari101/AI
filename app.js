const messagesEl = document.getElementById('messages');
const userInputEl = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const avatarEl = document.getElementById('avatar');

function addMessage(text, sender = 'bot') {
    const div = document.createElement('div');
    div.classList.add('msg', sender);
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

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


// 🔥 ذكاء اصطناعي بدون تسجيل
async function callAI(userText) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                inputs: userText
            })
        }
    );

    const data = await response.json();

    try {
        return data[0].generated_text;
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
