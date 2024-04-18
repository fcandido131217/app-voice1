document.addEventListener('DOMContentLoaded', function () {
    const listeningText = document.getElementById('listeningText');
    const resultDiv = document.getElementById('result');

    const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false; // Desactivar el reconocimiento continuo al principio
    let isListening = false; // Variable para controlar si el reconocimiento está activo o no

    // Función para iniciar el reconocimiento cuando se detecta la frase "hola francisco"
    function iniciarEscucha() {
        isListening = true;
        recognition.start();
        listeningText.innerHTML = 'Escuchando...';
    }

    // Iniciar la escucha cuando se detecta la frase "hola francisco"
    recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript.toLowerCase();
        if (transcript.includes('hola francisco')) {
            iniciarEscucha();
        }
    };

    recognition.onstart = function () {
        listeningText.innerHTML = 'Escuchando...';
    };

    recognition.onend = function () {
        if (isListening) {
            // Si todavía estamos en modo de escucha activa, reiniciar el reconocimiento
            recognition.start();
        } else {
            listeningText.innerHTML = 'Fin de la escucha';
        }
    };

    recognition.onerror = function (event) {
        console.error('Error en el reconocimiento de voz:', event.error);
    };

    recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript.toLowerCase();
        const keywords = ['abrir una pestaña', 'ir a una página', 'ir a youtube', 'cerrar pestaña']; // Array de palabras clave

        resultDiv.innerHTML = `<strong>Resultado:</strong> ${transcript}`;

        for (let i = 0; i < keywords.length; i++) {
            if (transcript.includes(keywords[i])) {
                switch (keywords[i]) {
                    case 'abrir una pestaña':
                        abrirPestana();
                        console.log("Se detectó 'abrir una pestaña'.");
                        break;
                    case 'ir a una página':
                        irAPagina();
                        console.log("Se detectó 'ir a una página'.");
                        break;
                    case 'ir a youtube':
                        irAYoutube();
                        console.log("Se detectó 'ir a Youtube'.");
                        break;
                    case 'cerrar pestaña':
                        cerrarPestana();
                        console.log("Se detectó 'cerrar una Pestaña'.");
                        break;
                }
            }
        }

        enviarFraseAFirebase(transcript);
    };

    // Iniciar la escucha manualmente al cargar la página
    iniciarEscucha();

    function enviarFraseAFirebase(frase) {
        if (frase.includes('abrir una pestaña') || frase.includes('ir a una página') || frase.includes('ir a youtube') || frase.includes('cerrar pestaña')) {
            var data = {
                frase: frase
            };

            var options = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            axios.post('https://661215a995fdb62f24ee0845.mockapi.io/detector', data, options)
                .then(response => {
                    console.log('Los datos se enviaron correctamente:', response.data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }

    function abrirPestana() {
        window.open();
    }

    function irAPagina() {
        window.location.href = "https://chat.openai.com/";
    }

    function irAYoutube() {
        window.location.href = "https://youtube.com";
    }

    function cerrarPestana() {
        window.close();
    }
    //
});
