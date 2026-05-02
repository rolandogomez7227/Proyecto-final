const app = {
    moodData: {
        feliz: {
            label: 'Feliz y alegre',
            desc: '¡Vibra positiva! Estas canciones potenciarán tu alegría actual.',
            spotify: 'https://open.spotify.com/search/' 
        },
        melancolico: {
            label: 'Melancólico',
            desc: 'La nostalgia tiene su belleza. Aquí tienes música para acompañar tus pensamientos.',
            spotify: 'https://open.spotify.com/search/'
        }
    },

    answers: { mood: null, energy: 5, context: null, genre: null },

    selectOption(button, key, value) {
        this.answers[key] = value;
        
        const grid = button.closest('.options-grid');
        grid.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');

        // Flujo automático
        if (key === 'mood') setTimeout(() => this.nextQuestion(2), 300);
        if (key === 'context') setTimeout(() => this.nextQuestion(4), 300);
        if (key === 'genre') setTimeout(() => this.submitSurvey(), 300);
    },

    updateEnergy() {
        const slider = document.getElementById('energy-slider');
        this.answers.energy = slider.value;
        document.getElementById('energy-value').textContent = `${slider.value} / 10`;
    },

    nextQuestion(step) {
        document.querySelectorAll('.question-screen').forEach(s => s.classList.remove('active'));
        const nextScreen = document.getElementById('q' + step);
        if (nextScreen) nextScreen.classList.add('active');
        document.getElementById('progress-fill').style.width = (step / 4 * 100) + '%';
    },

    async submitSurvey() {
        document.getElementById('loading-overlay').classList.add('show');
        await new Promise(r => setTimeout(r, 1800));
        document.getElementById('loading-overlay').classList.remove('show');
        this.showResults();
    },

    showResults() {
        document.querySelectorAll('.question-screen').forEach(s => s.classList.remove('active'));
        const rs = document.getElementById('result-screen');
        const rc = document.getElementById('result-content');
        rs.style.display = 'block';

        // Fallback para evitar errores si no se seleccionó mood
        const moodKey = this.answers.mood || 'feliz';
        const info = this.moodData[moodKey];

        // Crear búsqueda dinámica real en Spotify
        const query = encodeURIComponent(`playlist ${info.label} ${this.answers.genre || ''}`);
        const spotifyLink = `https://open.spotify.com/search/${query}`;

        rc.innerHTML = `
            <div style="margin-bottom: 20px;">
                <p style="color: #a7a7a7;">Basado en tu estado <b>${info.label}</b>, encontramos tu match ideal.</p>
                <p style="font-size: 0.9rem; margin: 15px 0;">${info.desc}</p>
            </div>
            
            <button class="btn-primary" style="width: 100%;" onclick="window.open('${spotifyLink}', '_blank')">
                ABRIR EN SPOTIFY ➔
            </button>

            <p onclick="location.reload()" style="margin-top: 25px; cursor: pointer; color: #6b9980; font-size: 0.8rem; text-decoration: underline;">
                Reiniciar encuesta
            </p>
        `;
    },

    scrollTo(id) {
        const el = document.getElementById(id);
        if(el) el.scrollIntoView({ behavior: 'smooth' });
    }
};