document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chatBox');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const saveApiKeyBtn = document.getElementById('saveApiKey');
    const providerSelect = document.getElementById('providerSelect');
    const themeToggle = document.getElementById('themeToggle');
    const historyToggle = document.getElementById('historyToggle');
    const historyPanel = document.getElementById('historyPanel');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistory');

    let PROVIDER = localStorage.getItem('PROVIDER') || 'deepseek';
    let OPENAI_API_KEY = localStorage.getItem('OPENAI_API_KEY') || "";
    let DEEPSEEK_API_KEY = localStorage.getItem('DEEPSEEK_API_KEY') || "";
    let queryHistory = JSON.parse(localStorage.getItem('queryHistory')) || [];

    providerSelect.value = PROVIDER;
    apiKeyInput.value = PROVIDER === 'openai' ? OPENAI_API_KEY : DEEPSEEK_API_KEY;

    function initTheme() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            document.body.classList.add('dark-theme');
        }
        themeToggle.innerHTML = document.body.classList.contains('dark-theme') 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        themeToggle.innerHTML = document.body.classList.contains('dark-theme') 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
    });

    providerSelect.addEventListener('change', () => {
        PROVIDER = providerSelect.value;
        localStorage.setItem('PROVIDER', PROVIDER);
        apiKeyInput.value = PROVIDER === 'openai' ? OPENAI_API_KEY : DEEPSEEK_API_KEY;
    });

    saveApiKeyBtn.addEventListener('click', () => {
        const key = apiKeyInput.value.trim();
        if (PROVIDER === 'openai') {
            OPENAI_API_KEY = key;
            localStorage.setItem('OPENAI_API_KEY', key);
        } else {
            DEEPSEEK_API_KEY = key;
            localStorage.setItem('DEEPSEEK_API_KEY', key);
        }
        addMessage('bot', PROVIDER === 'openai' 
            ? "🔐 API Key de OpenAI configurada correctamente" 
            : "🔐 API Key de DeepSeek configurada correctamente");
    });

    function updateHistoryList() {
        historyList.innerHTML = '';
        queryHistory.slice().reverse().forEach((query) => {
            const li = document.createElement('li');
            li.textContent = query.length > 50 ? `${query.substring(0, 47)}...` : query;
            li.title = query;
            li.addEventListener('click', () => {
                userInput.value = query;
                historyPanel.classList.remove('active');
                userInput.focus();
            });
            historyList.appendChild(li);
        });
    }

    historyToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        historyPanel.classList.toggle('active');
        if (historyPanel.classList.contains('active')) {
            updateHistoryList();
        }
    });

    clearHistoryBtn.addEventListener('click', () => {
        queryHistory = [];
        localStorage.setItem('queryHistory', JSON.stringify(queryHistory));
        updateHistoryList();
    });

    document.addEventListener('click', () => {
        historyPanel.classList.remove('active');
    });

    function createCopyButton(codeElement) {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '<i class="far fa-copy"></i>';
        copyButton.title = 'Copiar código';

        copyButton.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(codeElement.textContent);
                copyButton.innerHTML = '<i class="fas fa-check"></i>';
                copyButton.title = '¡Copiado!';
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="far fa-copy"></i>';
                    copyButton.title = 'Copiar código';
                }, 2000);
            } catch (err) {
                console.error('Error al copiar:', err);
                copyButton.innerHTML = '<i class="fas fa-times"></i>';
                copyButton.title = 'Error al copiar';
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="far fa-copy"></i>';
                    copyButton.title = 'Copiar código';
                }, 2000);
                const range = document.createRange();
                range.selectNode(codeElement);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
                document.execCommand('copy');
                window.getSelection().removeAllRanges();
            }
        });

        return copyButton;
    }

    function addMessage(sender, message) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);

        const senderLabel = document.createElement('strong');
        senderLabel.textContent = `${sender}: `;
        messageDiv.appendChild(senderLabel);

        if (message.includes('```')) {
            const parts = message.split('```');
            parts.forEach((part, index) => {
                if (index % 2 === 0) {
                    const text = document.createElement('span');
                    text.innerHTML = part.replace(/\n/g, '<br>');
                    messageDiv.appendChild(text);
                } else {
                    const codeContainer = document.createElement('div');
                    codeContainer.className = 'code-container';

                    const codeBlock = document.createElement('pre');
                    const codeElement = document.createElement('code');

                    const firstLineBreak = part.indexOf('\n');
                    const code = firstLineBreak !== -1 ? part.substring(firstLineBreak + 1) : part;
                    codeElement.textContent = code;

                    codeBlock.appendChild(codeElement);
                    codeContainer.appendChild(codeBlock);
                    codeContainer.appendChild(createCopyButton(codeElement));

                    messageDiv.appendChild(codeContainer);
                }
            });
        } else {
            const plainText = document.createElement('span');
            plainText.innerHTML = message.replace(/\n/g, '<br>');
            messageDiv.appendChild(plainText);
        }

        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;

        document.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));

        if (sender === 'user') {
            queryHistory.push(message);
            if (queryHistory.length > 50) {
                queryHistory = queryHistory.slice(-50);
            }
            localStorage.setItem('queryHistory', JSON.stringify(queryHistory));
        }
    }

    async function queryTechnicalSources(question) {
        const apiKey = PROVIDER === 'openai' ? OPENAI_API_KEY : DEEPSEEK_API_KEY;
        const url = PROVIDER === 'openai'
            ? 'https://api.openai.com/v1/chat/completions'
            : 'https://api.deepseek.com/v1/chat/completions';

        if (!apiKey) return "🔒 Por favor, configura tu API Key primero";
        addMessage('bot', "🧠 Procesando tu consulta técnica...");

        const strictPrompt =  `Eres un experto asistente en ingeniería hidráulica y ambiental, especializado en normativa uruguaya, licencias ambientales y evaluaciones de impacto. Responde de forma técnica y clara, citando leyes y decretos cuando sea pertinente. Usa texto plano para formatear tus respuestas, sin usar markdown. Consulta: "${question}"`;

try {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: PROVIDER === 'openai' ? "gpt-5" : "deepseek-chat",
                    messages: [
                        {
                            role: "system",
                            content:  "Eres un asistente especializado en ingeniería hidráulica y ambiental. Proporciona respuestas técnicas sobre normativa, licencias y estudios de impacto ambiental en Uruguay, citando legislación cuando sea posible. Usa texto plano para formatear, sin usar markdown."
                        },
                        {
                            role: "user",
                            content: strictPrompt
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 1500,
                    top_p: 0.9
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP ${response.status}: ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            return data.choices?.[0]?.message?.content || "No pude generar una respuesta válida.";
        } catch (error) {
            console.error("Error en la consulta:", error);
            return `⚠️ Error técnico: ${error.message}`;
        }
    }

    sendButton.addEventListener("click", async () => {
        const question = userInput.value.trim();
        if (!question) return;

        addMessage("user", question);
        userInput.value = "";
        userInput.focus();

        const response = await queryTechnicalSources(question);
        addMessage("bot", response);
    });

    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendButton.click();
    });

    initTheme();
});
