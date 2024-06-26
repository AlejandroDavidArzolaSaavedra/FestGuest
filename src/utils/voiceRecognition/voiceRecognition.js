function startVoiceRecognition() {
    const recognition = new (window.webkitSpeechRecognition || SpeechRecognition)();
    
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    let finalTranscript = '';
    let timeoutID = null; 
    
    recognition.onresult = function(event) {
        let interimTranscript = ''; 
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }

        const resultWithoutLastChar = finalTranscript.slice(0, -1); 
        document.getElementById('voice-search').value = resultWithoutLastChar.trim();
        
        clearTimeout(timeoutID);
        timeoutID = setTimeout(function() {
            recognition.stop();
        }, 2000);
    };

    recognition.onerror = function(event) {
        console.error('Recognition error:', event.error);
    };

    recognition.onend = function() {
        console.log('Recognition ended');
    };
    recognition.start();
}
