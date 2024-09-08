document.addEventListener("DOMContentLoaded", () => {
    const fromText = document.getElementById('from-text');
    const toText = document.getElementById('to-text');
    
    // Set default languages
    let fromLang = 'en'; // Default: English as the source language
    let toLang = 'fr'; // Default: French as the target language
    
    const charCounter = document.getElementById('char-count')
    const translateBtn = document.getElementById('translate-btn');
    const swapBtn = document.getElementById('swap-btn');
    const fromCopyBtn = document.getElementById('from-copy');
    const toCopyBtn = document.getElementById('to-copy');
    const fromListenBtn = document.getElementById('from-record');
    const toListenBtn = document.getElementById('to-record');

        // Function to update character count
    const updateCharCount = () => {
        const charCount = fromText.value.length;
        charCounter.textContent = charCount; // Update the count on the page

        if (charCount >= maxChars) {
            fromText.value = fromText.value.substring(0, maxChars); // Restrict to max characters
        }
    };

    // Add event listener to update the character count on input
    fromText.addEventListener('input', updateCharCount);

    // Translate text using MyMemory API
    const translateText = () => {
        const text = fromText.value;

        if (!text.trim()) {
            toText.value = '';
            return;
        }

        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`;
        console.log('Fetching translation from:', url);

        fetch(url)
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            console.log('Translation response:', data);
            if (data.responseData && data.responseData.translatedText) {
                toText.value = data.responseData.translatedText;
            } else {
                toText.value = "Translation not available.";
            }
        })
        .catch(err => {
            console.error('Error:', err);
            toText.value = "Error in translation.";
        });
    };

    // Translate button click
    translateBtn.addEventListener('click', translateText);

    // Swap languages
    swapBtn.addEventListener('click', () => {
        const temp = fromLang;
        fromLang = toLang;
        toLang = temp;

        updateActiveButton(fromLang, '.lang-btn');  // Update from language
        updateActiveButton(toLang, '.lang-btn-to');  // Update to language

        translateText();
    });

    // Handle "from" language button click
    document.querySelectorAll('.lang-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            fromLang = e.target.getAttribute('data-lang');
            updateActiveButton(fromLang, '.lang-btn');  // Update active button
        });
    });

    // Handle "to" language button click
    document.querySelectorAll('.lang-btn-to').forEach(button => {
        button.addEventListener('click', (e) => {
            toLang = e.target.getAttribute('data-lang');
            updateActiveButton(toLang, '.lang-btn-to');  // Update active button
        });
    });

    // Helper function to update active button
    const updateActiveButton = (selectedLang, btnClass) => {
        document.querySelectorAll(btnClass).forEach(btn => {
            if (btn.getAttribute('data-lang') === selectedLang) {
                btn.classList.add('active-lang');
            } else {
                btn.classList.remove('active-lang');
            }
        });
    };

    // Copy text to clipboard
    const copyText = (textElement) => {
        navigator.clipboard.writeText(textElement.value)
            .then(() => alert('Text copied!'))
            .catch(err => console.error('Failed to copy: ', err));
    };

    fromCopyBtn.addEventListener('click', () => copyText(fromText));
    toCopyBtn.addEventListener('click', () => copyText(toText));

    // Text-to-Speech (listen to the text)
    const textToSpeech = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
    };

    fromListenBtn.addEventListener('click', () => textToSpeech(fromText.value));
    toListenBtn.addEventListener('click', () => textToSpeech(toText.value));

    // Set default translation (translates 'Hello, how are you' to French)
    fromText.value = "Hello, how are you?";
    translateText();

    // Initialize with default active language buttons
    updateActiveButton(fromLang, '.lang-btn');
    updateActiveButton(toLang, '.lang-btn-to');
});
