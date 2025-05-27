const startBtn = document.getElementById('start-btn');
const welcomePage = document.getElementById('welcome-page');
const dashboardPage = document.getElementById('dashboard-page');

startBtn.addEventListener('click', () => {
  welcomePage.classList.remove('active');
  dashboardPage.classList.add('active');
});

let synth = window.speechSynthesis;

async function sendMessage() {
  const input = document.getElementById('userInput').value;
  const responseDiv = document.getElementById('response');
  if (!input) {
    responseDiv.innerHTML = 'Please enter a message.';
    return;
  }
  responseDiv.innerHTML = 'Loading...';

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer YOUR API KEY',
        'HTTP-Referer': 'https://www.todchat.com',
        'X-Title': 'TodChat',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1:free',
        messages: [{ role: 'user', content: input }],
      }),
    });
    const data = await response.json();
    const markdownText = data.choices?.[0]?.message?.content || 'No response received.';
    const html = window.marked ? marked.parse(markdownText) : markdownText;
    responseDiv.innerHTML = html;
  } catch (error) {
    responseDiv.innerHTML = 'Error: ' + error.message;
  }
}

function startVoiceInput() {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    alert('Voice input not supported on this browser/device.');
    return;
  }

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    document.getElementById('userInput').value = transcript;
  };

  recognition.onerror = function(event) {
    alert('Voice input error: ' + event.error + '. Try typing instead.');
  };

  recognition.start();
}

function startReading() {
  stopReading();
  const responseText = document.getElementById('response').innerText;
  if (!responseText) return;
  const utterance = new SpeechSynthesisUtterance(responseText);
  utterance.lang = 'en-US';
  utterance.rate = 1;
  synth.speak(utterance);
}

function stopReading() {
  if (synth.speaking) synth.cancel();
}
