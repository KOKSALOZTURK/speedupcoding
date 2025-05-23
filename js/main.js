class TypingTest {
    constructor() {
        this.currentChallenge = null;
        this.currentChallengeIndex = 0;
        this.startTime = null;
        this.timer = null;
        this.isTimedMode = true;
        this.realtimeFeedbackEnabled = true;
        this.initializeElements();
        this.initializeEventListeners();
        this.feedbackManager = new FeedbackManager();
        
        // Debug: Check if challenges are loaded
        console.log('Challenges object:', window.challenges);
        
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.updateChallenge());
        } else {
            this.updateChallenge();
        }
    }

    initializeElements() {
        this.challengeText = document.getElementById('challenge-text');
        this.userInput = document.getElementById('user-input');
        this.timerDisplay = document.getElementById('timer');
        this.wpmDisplay = document.getElementById('wpm');
        this.accuracyDisplay = document.getElementById('accuracy');
        this.startButton = document.getElementById('start-button');
        this.challengeSelect = document.getElementById('challenge-select');
        this.prevButton = document.getElementById('prev-challenge');
        this.nextButton = document.getElementById('next-challenge');
        this.timingToggle = document.getElementById('timing-toggle');
        this.statsDisplay = document.querySelector('.stats-display');
        this.realtimeFeedbackToggle = document.getElementById('realtime-feedback-toggle');
        this.modeSelect = document.getElementById('mode-select');
        this.durationSelect = document.getElementById('duration-select');
        this.wordCountSelect = document.getElementById('word-count-select');

        // Debug: Check if elements are found
        console.log('Challenge text element:', this.challengeText);
        console.log('Challenge select:', this.challengeSelect);
    }

    initializeEventListeners() {
        this.startButton.addEventListener('click', () => this.startTest());
        this.userInput.addEventListener('input', () => this.checkInput());
        this.userInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.challengeSelect.addEventListener('change', () => this.updateChallenge());
        this.prevButton.addEventListener('click', () => this.previousChallenge());
        this.nextButton.addEventListener('click', () => this.nextChallenge());
        this.timingToggle.addEventListener('change', () => this.toggleTimingMode());
        this.realtimeFeedbackToggle.addEventListener('change', () => this.toggleRealtimeFeedback());
        this.modeSelect.addEventListener('change', () => this.toggleMode());
        this.wordCountSelect.addEventListener('change', () => this.updateChallenge());
    }

    toggleMode() {
        const isTimeBased = this.modeSelect.value === 'time';
        this.durationSelect.style.display = isTimeBased ? 'inline-block' : 'none';
        this.wordCountSelect.style.display = isTimeBased ? 'none' : 'inline-block';
        this.isTimedMode = isTimeBased;
        
        // Disable timing toggle for word-based mode
        this.timingToggle.disabled = !isTimeBased;
        if (!isTimeBased) {
            this.timingToggle.checked = false;
            this.toggleTimingMode();
        }
        
        this.updateChallenge();
    }

    toggleRealtimeFeedback() {
        const enabled = this.realtimeFeedbackToggle.checked;
        this.feedbackManager.toggleRealtimeFeedback(enabled);
        this.checkInput();
    }

    // Helper to get value from contenteditable with newlines and spaces
    getUserInputValue() {
        let value = '';
        function traverse(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                // Replace non-breaking spaces with regular spaces
                value += node.textContent.replace(/\u00A0/g, ' ');
            } else if (node.nodeName === 'BR') {
                value += '\n';
            } else if (node.nodeName === 'DIV') {
                // Newline before each div except the first
                if (value.length > 0) value += '\n';
                node.childNodes.forEach(traverse);
            } else if (node.nodeName === 'SPAN' || node.nodeName === 'B' || node.nodeName === 'I') {
                // Traverse inline elements
                node.childNodes.forEach(traverse);
            } else {
                node.childNodes.forEach(traverse);
            }
        }
        this.userInput.childNodes.forEach(traverse);
        return value;
    }

    // Utility to visualize invisible characters for debugging
    visualizeInvisible(str) {
        return str
            .replace(/ /g, '·')         // space
            .replace(/\t/g, '→')        // tab
            .replace(/\n/g, '¶\n');    // newline
    }

    checkInput() {
        // Use improved helper to get value with newlines and spaces
        const input = this.getUserInputValue();
        const text = this.currentChallenge.code;

        // Normalize tabs to 4 spaces for both input and challenge code
        const tabAsSpaces = '    ';
        const normInput = input.replace(/\t/g, tabAsSpaces).replace(/\u00A0/g, ' ');
        const normText = text.replace(/\t/g, tabAsSpaces).replace(/\u00A0/g, ' ');
        console.log('Normalized input:', JSON.stringify(normInput));
        console.log('Normalized challenge code:', JSON.stringify(normText));
        // Visualize invisible characters
        console.log('Input (visualized):', this.visualizeInvisible(normInput));
        console.log('Challenge (visualized):', this.visualizeInvisible(normText));

        const { firstErrorIndex, accuracy } = this.feedbackManager.generateHighlightedText(normInput, normText);
        const suggestion = this.feedbackManager.generateSuggestion(normInput, normText, firstErrorIndex);

        const accuracyPercentage = Math.round((accuracy / normInput.length) * 100) || 0;
        this.accuracyDisplay.textContent = `${accuracyPercentage}%`;

        if (this.isTimedMode) {
            this.updateWPM();
            // If the user finished early and 100% correct, end the test
            if (
                normInput.length === normText.length &&
                normInput === normText &&
                accuracy === normInput.length &&
                this.timer // only if timer is running
            ) {
                this.endTest();
            }
        } else {
            // Word-based mode
            this.updateWPM();
            const wordsTyped = normInput.split(/\s+/).filter(word => word.length > 0).length;
            const targetWords = parseInt(this.wordCountSelect.value);
            
            if (wordsTyped >= targetWords) {
                this.endTest();
            }
        }

        this.feedbackManager.updateSuggestion(suggestion);
    }

    startTest() {
        if (!this.currentChallenge) {
            this.updateChallenge();
        }

        this.startTime = Date.now();
        this.userInput.textContent = '';
        this.userInput.contentEditable = 'true';
        this.userInput.focus();
        this.startButton.disabled = true;

        if (this.isTimedMode) {
            const timeLimit = parseInt(this.durationSelect.value);
            this.timerDisplay.textContent = timeLimit;

            this.timer = setInterval(() => {
                const timeLeft = parseInt(this.timerDisplay.textContent);
                this.timerDisplay.textContent = timeLeft - 1;
                this.updateWPM();

                if (timeLeft <= 1) {
                    this.endTest();
                }
            }, 1000);
        } else {
            // Word-based mode
            const targetWords = parseInt(this.wordCountSelect.value);
            this.timerDisplay.textContent = '0';
            this.startTime = Date.now();
        }
    }

    toggleTimingMode() {
        this.isTimedMode = this.timingToggle.checked;
        if (this.isTimedMode) {
            this.statsDisplay.classList.remove('timing-disabled');
            this.userInput.contentEditable = 'false';
            this.startButton.disabled = false;
        } else {
            this.statsDisplay.classList.add('timing-disabled');
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
            this.userInput.contentEditable = 'true';
            this.startButton.disabled = true;
            this.startTime = Date.now(); // Start timing for WPM calculation
        }
    }

    updateChallenge(index = 0) {
        // Debug: Log the current state
        console.log('Updating challenge...');
        console.log('Difficulty:', this.challengeSelect.value);
        console.log('Mode:', this.modeSelect.value);

        const difficulty = this.challengeSelect.value;
        const mode = this.modeSelect.value;
        
        let challenges;
        if (mode === 'time') {
            if (!window.challenges || !window.challenges.javascript || !window.challenges.javascript[difficulty]) {
                console.error('Challenges not properly loaded:', window.challenges);
                this.challengeText.innerHTML = '<p>Error: Challenges not loaded. Please refresh the page.</p>';
                return;
            }
            challenges = window.challenges.javascript[difficulty];
        } else {
            const wordCount = this.wordCountSelect.value;
            if (!window.challenges || !window.challenges.wordBased || !window.challenges.wordBased[wordCount]) {
                console.error('Word-based challenges not properly loaded:', window.challenges);
                this.challengeText.innerHTML = '<p>Error: Challenges not loaded. Please refresh the page.</p>';
                return;
            }
            challenges = window.challenges.wordBased[wordCount];
        }

        this.currentChallengeIndex = index;
        this.currentChallenge = challenges[this.currentChallengeIndex];
        
        // Update navigation buttons
        this.prevButton.disabled = this.currentChallengeIndex === 0;
        this.nextButton.disabled = this.currentChallengeIndex === challenges.length - 1;
        
        // Debug: Log the selected challenge
        console.log('Selected challenge:', this.currentChallenge);
        
        // Update the display
        this.challengeText.innerHTML = `
            <h3>${this.currentChallenge.title}</h3>
            <p>${this.currentChallenge.description}</p>
            <pre>${this.currentChallenge.code}</pre>
        `;
        
        // Reset the input and stats
        this.userInput.textContent = '';
        this.wpmDisplay.textContent = '0';
        this.accuracyDisplay.textContent = '0%';
        this.timerDisplay.textContent = this.isTimedMode ? this.durationSelect.value : '0';
        
        // Enable input if in untimed mode
        if (!this.isTimedMode) {
            this.userInput.contentEditable = 'true';
            this.startButton.disabled = true;
            this.startTime = Date.now();
        } else {
            this.userInput.contentEditable = 'false';
            this.startButton.disabled = false;
        }
    }

    previousChallenge() {
        if (this.currentChallengeIndex > 0) {
            this.updateChallenge(this.currentChallengeIndex - 1);
        }
    }

    nextChallenge() {
        const difficulty = this.challengeSelect.value;
        const challenges = window.challenges.javascript[difficulty];
        
        if (this.currentChallengeIndex < challenges.length - 1) {
            this.updateChallenge(this.currentChallengeIndex + 1);
        }
    }

    handleKeyDown(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            // Insert 4 spaces instead of a tab character
            const spacesNode = document.createTextNode('    ');
            range.insertNode(spacesNode);
            range.setStartAfter(spacesNode);
            range.setEndAfter(spacesNode);
            selection.removeAllRanges();
            selection.addRange(range);
            this.checkInput();
        }
        // Let browser handle Enter for new lines.
    }

    updateWPM() {
        if (!this.startTime) return;
        
        const timeElapsed = (Date.now() - this.startTime) / 1000 / 60; // in minutes
        const wordsTyped = this.userInput.textContent.split(/\s+/).filter(word => word.length > 0).length;
        const wpm = Math.round(wordsTyped / timeElapsed) || 0;
        this.wpmDisplay.textContent = wpm;
    }

    endTest() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        const timeElapsed = (Date.now() - this.startTime) / 1000;
        const wordsTyped = this.userInput.textContent.split(/\s+/).filter(word => word.length > 0).length;
        const wpm = Math.round(wordsTyped / (timeElapsed / 60)) || 0;

        // Normalize tabs to 4 spaces for both input and challenge code
        const tabAsSpaces = '    ';
        const inputRaw = this.getUserInputValue();
        const textRaw = this.currentChallenge.code;
        const input = inputRaw.replace(/\t/g, tabAsSpaces).replace(/\u00A0/g, ' ');
        const text = textRaw.replace(/\t/g, tabAsSpaces).replace(/\u00A0/g, ' ');
        console.log('Normalized input (final):', JSON.stringify(input));
        console.log('Normalized challenge code (final):', JSON.stringify(text));
        // Visualize invisible characters
        console.log('Input (visualized, final):', this.visualizeInvisible(input));
        console.log('Challenge (visualized, final):', this.visualizeInvisible(text));

        // Calculate accuracy based on normalized strings
        let correct = 0;
        const minLen = Math.min(input.length, text.length);
        for (let i = 0; i < minLen; i++) {
            if (input[i] === text[i]) correct++;
        }
        const accuracy = Math.round((correct / text.length) * 100) || 0;

        const result = {
            wpm,
            accuracy,
            timeElapsed,
            challenge: this.currentChallenge.title,
            difficulty: this.challengeSelect.value,
            mode: this.modeSelect.value,
            target: this.isTimedMode ? this.durationSelect.value : this.wordCountSelect.value
        };

        this.feedbackManager.showExerciseFeedback(result);
        this.feedbackManager.updateCharts(result);

        // Show a floating overlay message box as an extra
        let overlay = document.getElementById('exercise-finished-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'exercise-finished-overlay';
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100vw';
            overlay.style.height = '100vh';
            overlay.style.background = 'rgba(44, 62, 80, 0.45)';
            overlay.style.display = 'flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.zIndex = '2000';
            document.body.appendChild(overlay);
        }
        let floatingBox = document.createElement('div');
        floatingBox.style.background = 'white';
        floatingBox.style.border = '2px solid #3498db';
        floatingBox.style.borderRadius = '12px';
        floatingBox.style.boxShadow = '0 8px 32px rgba(0,0,0,0.25)';
        floatingBox.style.padding = '36px 48px';
        floatingBox.style.textAlign = 'center';
        floatingBox.style.maxWidth = '90vw';
        floatingBox.style.minWidth = '320px';
        floatingBox.innerHTML = `
            <h2 style="color: #e67e22; margin-bottom: 18px;">Exercise Finished!</h2>
            <div style="margin-bottom: 18px;">${this.isTimedMode ? 'Time is up' : 'Target words reached'}. Here are your results:</div>
            <div style="font-size: 1.2em; margin-bottom: 10px;"><strong>WPM:</strong> ${result.wpm}</div>
            <div style="font-size: 1.2em; margin-bottom: 10px;"><strong>Accuracy:</strong> ${result.accuracy}%</div>
            <div style="font-size: 1.2em; margin-bottom: 20px;"><strong>Time:</strong> ${Math.round(result.timeElapsed)}s</div>
            <button id="close-exercise-finished-overlay" style="margin-top: 10px; padding: 10px 28px; background: #3498db; color: white; border: none; border-radius: 7px; font-size: 1em; cursor: pointer;">Close</button>
        `;
        overlay.innerHTML = '';
        overlay.appendChild(floatingBox);
        overlay.style.display = 'flex';

        document.getElementById('close-exercise-finished-overlay').addEventListener('click', () => {
            overlay.style.display = 'none';
        });
    }
}

// Initialize the typing test
const typingTest = new TypingTest(); 