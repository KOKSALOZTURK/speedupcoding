class TypingTest {
    constructor() {
        console.log('TypingTest constructor called');
        this.currentChallenge = null;
        this.currentChallengeIndex = 0;
        this.startTime = null;
        this.timer = null;
        this.isTimedMode = true;
        this.realtimeFeedbackEnabled = true;
        // Add tracking for total stats
        this.totalWordsTyped = 0;
        this.totalCorrectChars = 0;
        this.totalCharsTyped = 0;
        this.sessionStartTime = null;
		this.totalCompletedChallenges = 0;
        this.initializeElements();
        this.initializeEventListeners();
        this.feedbackManager = new FeedbackManager();
        
        // Initialize the challenge display
        this.initializeChallenge();
    }

    initializeElements() {
        console.log('Initializing elements...');
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
        this.submitProgressBtn = document.getElementById('submit-progress');

        // Debug: Check if elements are found
        const elements = {
            challengeText: this.challengeText,
            userInput: this.userInput,
            timerDisplay: this.timerDisplay,
            wpmDisplay: this.wpmDisplay,
            accuracyDisplay: this.accuracyDisplay,
            startButton: this.startButton,
            challengeSelect: this.challengeSelect,
            prevButton: this.prevButton,
            nextButton: this.nextButton,
            timingToggle: this.timingToggle,
            statsDisplay: this.statsDisplay,
            realtimeFeedbackToggle: this.realtimeFeedbackToggle,
            modeSelect: this.modeSelect,
            durationSelect: this.durationSelect,
            wordCountSelect: this.wordCountSelect,
            submitProgressBtn: this.submitProgressBtn
        };

        console.log('Elements found:', elements);
        
        // Check for any missing elements
        Object.entries(elements).forEach(([name, element]) => {
            if (!element) {
                console.error(`Missing element: ${name}`);
            }
        });
    }

    initializeEventListeners() {
        console.log('Setting up event listeners...');
        
        // Start button
        if (this.startButton) {
            this.startButton.addEventListener('click', (e) => {
                console.log('Start button clicked');
                e.preventDefault();
                this.startTest();
            });
        } else {
            console.error('Start button not found');
        }

        // Input events
        if (this.userInput) {
            this.userInput.addEventListener('input', (e) => {
                console.log('Input event fired');
                this.checkInput();
            });
            this.userInput.addEventListener('keydown', (e) => {
                console.log('Keydown event:', e.key);
                this.handleKeyDown(e);
            });
        } else {
            console.error('User input element not found');
        }

        // Challenge selection
        if (this.challengeSelect) {
            this.challengeSelect.addEventListener('change', () => {
                console.log('Challenge selection changed');
                this.updateChallenge();
            });
        }

        // Navigation buttons
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => {
                console.log('Previous button clicked');
                this.previousChallenge();
            });
        }
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => {
                console.log('Next button clicked');
                this.nextChallenge();
            });
        }

        // Mode selection
        if (this.modeSelect) {
            this.modeSelect.addEventListener('change', () => {
                const isWordsMode = this.modeSelect.value === 'words';
                this.durationSelect.style.display = isWordsMode ? 'none' : 'inline-block';
                this.wordCountSelect.style.display = isWordsMode ? 'inline-block' : 'none';
                document.querySelector('.container').classList.toggle('words-mode', isWordsMode);
                // Automatically turn off and disable Timed Mode toggle in Words Mode
                if (isWordsMode) {
                    this.timingToggle.checked = false;
                    this.timingToggle.disabled = true;
                    this.isTimedMode = false;
                } else {
                    this.timingToggle.checked = true;
                    this.timingToggle.disabled = false;
                    this.isTimedMode = true;
                }
                this.resetTest();
            });
        }

        // Word count selection
        if (this.wordCountSelect) {
            this.wordCountSelect.addEventListener('change', () => {
                console.log('Word count changed to:', this.wordCountSelect.value);
                this.updateChallenge();
            });
        }

        // Real-time feedback toggle
        if (this.realtimeFeedbackToggle) {
            this.realtimeFeedbackToggle.addEventListener('change', () => {
                console.log('Real-time feedback toggled:', this.realtimeFeedbackToggle.checked);
                this.toggleRealtimeFeedback();
            });
        } else {
            console.error('Real-time feedback toggle not found');
        }

        // Timing toggle
        if (this.timingToggle) {
            this.timingToggle.addEventListener('change', () => {
                console.log('Timing mode toggled:', this.timingToggle.checked);
                this.toggleTimingMode();
            });
        } else {
            console.error('Timing toggle not found');
        }

        // Duration selection
        if (this.durationSelect) {
            this.durationSelect.addEventListener('change', () => {
                console.log('Duration changed to:', this.durationSelect.value);
                // Update timer display if we're in timed mode
                if (this.isTimedMode && !this.timer) {
                    this.timerDisplay.textContent = this.durationSelect.value;
                }
            });
        }

        // Submit Progress button (word mode)
        if (this.submitProgressBtn) {
            this.submitProgressBtn.addEventListener('click', () => {
                this.isWordModeSubmit = true; // Set flag before ending test
                this.endTest();
            });
        }

        console.log('Event listeners setup complete');
    }

    initializeChallenge() {
        // Wait for challenges to be loaded
        if (!window.challenges) {
            console.error('Challenges not loaded yet');
            setTimeout(() => this.initializeChallenge(), 100);
            return;
        }

        // Update the challenge display
        this.updateChallenge();
        
        // Disable the input area for preview
        this.userInput.contentEditable = 'false';
    }

    toggleMode() {
        const isTimeBased = this.modeSelect.value === 'time';
        this.durationSelect.style.display = isTimeBased ? 'inline-block' : 'none';
        this.wordCountSelect.style.display = isTimeBased ? 'none' : 'inline-block';
        this.isTimedMode = isTimeBased;
        
        // Update timer display when switching modes
        if (isTimeBased) {
            this.timerDisplay.textContent = this.durationSelect.value;
        } else {
            this.timerDisplay.textContent = '0';
        }
        
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

        // Calculate accuracy based on typed characters only
        let correctChars = 0;
        const typedLength = normInput.length;
        
        for (let i = 0; i < typedLength; i++) {
            if (normInput[i] === normText[i]) {
                correctChars++;
            }
        }
        
        // Update total stats (only count new correct characters)
        if (this.totalCharsTyped < typedLength) {
            this.totalCorrectChars += (correctChars - (this.totalCorrectChars || 0));
            this.totalCharsTyped = typedLength;
        }
        
        // Calculate accuracy as percentage of correct characters out of typed characters
        const accuracyPercentage = typedLength > 0 ? Math.round((correctChars / typedLength) * 100) : 0;
        this.accuracyDisplay.textContent = `${accuracyPercentage}%`;

        const { firstErrorIndex } = this.feedbackManager.generateHighlightedText(normInput, normText);
        const suggestion = this.feedbackManager.generateSuggestion(normInput, normText, firstErrorIndex);

        if (this.isTimedMode) {
            this.updateWPM();
            // Debug logs for timed mode completion
            console.log('Timed Mode Check:', {
                inputLength: normInput.length,
                textLength: normText.length,
                isEqual: normInput === normText,
                hasTimer: !!this.timer,
                timerValue: this.timerDisplay.textContent,
                accuracy: accuracyPercentage
            });

            // If the user finished early and 100% correct, end the test
            if (
                normInput.length === normText.length &&
                normInput === normText &&
                this.timer // only if timer is running
            ) {
                console.log('Challenge completed successfully in timed mode!');
                this.endTest();
            }
        } else {
            // Word-based mode
            this.updateWPM();
            const wordsTyped = normInput.split(/\s+/).filter(word => word.length > 0).length;
            const targetWords = parseInt(this.wordCountSelect.value);
            
            // Debug logs for word-based mode
            console.log('Word-based Mode Check:', {
                wordsTyped,
                targetWords,
                hasReachedTarget: wordsTyped >= targetWords,
                accuracy: accuracyPercentage
            });
            
            // --- NEW: If the user typed the challenge exactly, show overlay and allow continue ---
            if (
                normInput.length === normText.length &&
                normInput === normText
            ) {
                console.log('Challenge completed successfully in word-based mode!');
                this.endTest();
                return;
            }
            // --- END NEW ---
            
            if (wordsTyped >= targetWords) {
                console.log('Target word count reached in word-based mode!');
                this.endTest();
            }
        }

        this.feedbackManager.updateSuggestion(suggestion);
    }

    startTest(remainingTime = null) {
        console.log('startTest called', {
            hasChallenge: !!this.currentChallenge,
            isTimedMode: this.isTimedMode,
            mode: this.modeSelect?.value,
            timeLimit: this.durationSelect?.value,
            wordCount: this.wordCountSelect?.value,
            remainingTime
        });

        if (!this.currentChallenge) {
            console.log('No current challenge, updating...');
            this.updateChallenge();
        }

        if (!this.startButton) {
            console.error('Start button not found');
            return;
        }

        if (!this.userInput) {
            console.error('User input element not found');
            return;
        }

        // Initialize session start time if this is the first challenge
        if (!this.sessionStartTime) {
            this.sessionStartTime = Date.now();
            // Reset total stats at the start of a new session
            this.totalWordsTyped = 0;
            this.totalCorrectChars = 0;
            this.totalCharsTyped = 0;
        }

        this.startTime = Date.now();
        this.userInput.textContent = '';
        this.userInput.contentEditable = 'true';
        this.userInput.focus();
        this.startButton.disabled = true;

        console.log('Test started, setting up timer...');

        if (this.isTimedMode) {
            // Use remaining time if provided, otherwise use the selected duration
            const timeLimit = remainingTime !== null ? remainingTime : parseInt(this.durationSelect.value);
            console.log('Setting up timed mode with limit:', timeLimit);
            this.timerDisplay.textContent = timeLimit;
            
            // Remove warning state if it exists
            const timerStat = document.getElementById('timer-stat');
            timerStat.classList.remove('warning');

            this.timer = setInterval(() => {
                const timeLeft = parseInt(this.timerDisplay.textContent);
                this.timerDisplay.textContent = timeLeft - 1;
                this.updateWPM();

                // Add warning state for last 3 seconds
                if (timeLeft <= 3) {
                    timerStat.classList.add('warning');
                }

                console.log('Timer tick:', { timeLeft });

                if (timeLeft <= 1) {
                    console.log('Timer reached zero, ending test...');
                    this.endTest();
                }
            }, 1000);
        } else {
            console.log('Setting up word-based mode');
            const targetWords = parseInt(this.wordCountSelect.value);
            this.timerDisplay.textContent = '0';
            this.startTime = Date.now();
        }

        // Show submit button in word mode
        if (!this.isTimedMode && this.submitProgressBtn) {
            this.submitProgressBtn.classList.add('active');
            console.log('Submit Progress button shown (word mode, test started)');
        } else if (this.submitProgressBtn) {
            this.submitProgressBtn.classList.remove('active');
            console.log('Submit Progress button hidden (not word mode or test not started)');
        }
    }

    toggleTimingMode() {
        this.isTimedMode = this.timingToggle.checked;
        if (this.isTimedMode) {
            this.statsDisplay.classList.remove('timing-disabled');
			this.totalCompletedChallenges++;
            this.userInput.contentEditable = 'false';
            this.startButton.disabled = false;
            // Update timer display when enabling timed mode
            this.timerDisplay.textContent = this.durationSelect.value;
            // Remove warning state when toggling timing mode
            const timerStat = document.getElementById('timer-stat');
            timerStat.classList.remove('warning');
        } else {
            this.statsDisplay.classList.add('timing-disabled');
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
            this.userInput.contentEditable = 'true';
            this.startButton.disabled = true;
            this.startTime = Date.now();
            this.timerDisplay.textContent = '0';
        }
    }

    updateChallenge(index = 0) {
        if (!window.challenges) {
            console.error('Challenges not loaded');
            return;
        }

        const difficulty = this.challengeSelect.value;
        const mode = this.modeSelect.value;
        
        let challenges;
        if (mode === 'time') {
            if (!window.challenges.javascript || !window.challenges.javascript[difficulty]) {
                console.error('Time-based challenges not found for difficulty:', difficulty);
                return;
            }
            challenges = window.challenges.javascript[difficulty];
        } else {
            const wordCount = this.wordCountSelect.value;
            if (!window.challenges.wordBased || !window.challenges.wordBased[wordCount]) {
                console.error('Word-based challenges not found for word count:', wordCount);
                return;
            }
            challenges = window.challenges.wordBased[wordCount];
        }

        this.currentChallengeIndex = index;
        this.currentChallenge = challenges[this.currentChallengeIndex];
        
        // Update navigation buttons
        this.prevButton.disabled = this.currentChallengeIndex === 0;
        this.nextButton.disabled = this.currentChallengeIndex === challenges.length - 1;
        
        // Update the display with proper formatting
        this.challengeText.innerHTML = `
            <h3>${this.currentChallenge.title}</h3>
            <p>${this.currentChallenge.description}</p>
            <pre><code>${this.escapeHtml(this.currentChallenge.code)}</code></pre>
        `;
        
        // Reset the input and stats
        this.userInput.textContent = '';
        this.wpmDisplay.textContent = '0';
        this.accuracyDisplay.textContent = '0';
        this.timerDisplay.textContent = this.isTimedMode ? this.durationSelect.value : '0';
        // Do NOT set contentEditable here!
        this.startButton.disabled = false;
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
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

    // Fixed WPM calculation method
    updateWPM() {
        if (!this.startTime) return;
        
        const timeElapsed = (Date.now() - this.startTime) / 1000 / 60; // in minutes
        
        // Prevent division by very small numbers that cause astronomical WPM
        if (timeElapsed < 0.01) { // Less than 0.6 seconds
            this.wpmDisplay.textContent = '0';
            return;
        }
        
        // Get normalized input and challenge text
        const input = this.getUserInputValue();
        const challengeText = this.currentChallenge.code;
        
        // Normalize both texts (handle tabs and special characters)
        const tabAsSpaces = '    ';
        const normInput = input.replace(/\t/g, tabAsSpaces).replace(/\u00A0/g, ' ');
        const normChallenge = challengeText.replace(/\t/g, tabAsSpaces).replace(/\u00A0/g, ' ');
        
        // Count correctly typed characters by comparing position by position
        let correctChars = 0;
        const typedLength = Math.min(normInput.length, normChallenge.length);
        
        for (let i = 0; i < typedLength; i++) {
            if (normInput[i] === normChallenge[i]) {
                correctChars++;
            }
        }
        
        // Calculate WPM based on correct characters only
        // Standard: 1 word = 5 characters (including spaces and punctuation)
        const correctWords = correctChars / 5;
        const wpm = Math.round(correctWords / timeElapsed) || 0;
        
        // Cap WPM at reasonable maximum to prevent display issues
        const cappedWPM = Math.min(wpm, 300);
        
        this.wpmDisplay.textContent = cappedWPM;
        
        // Debug logging for WPM calculation
        console.log('WPM Calculation:', {
            timeElapsed: timeElapsed.toFixed(3),
            correctChars,
            typedLength,
            challengeLength: normChallenge.length,
            correctWords: correctWords.toFixed(2),
            calculatedWPM: wpm,
            displayedWPM: cappedWPM
        });
    }

    endTest() {
        // Store the remaining time before clearing the timer
        const remainingTime = this.timer ? parseInt(this.timerDisplay.textContent) : 0;
        const isTimerExpired = remainingTime === 0;
        
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        // Disable input for time mode only
        if (this.isTimedMode) {
            this.userInput.contentEditable = 'false';
            this.startButton.disabled = false;
        }

        // Calculate final stats using the same logic as updateWPM
        const totalTimeElapsed = (Date.now() - this.sessionStartTime) / 1000;
        
        // Get all typed content for final calculation
        const input = this.getUserInputValue();
        const challengeText = this.currentChallenge.code;
        
        // Normalize both texts
        const tabAsSpaces = '    ';
        const normInput = input.replace(/\t/g, tabAsSpaces).replace(/\u00A0/g, ' ');
        const normChallenge = challengeText.replace(/\t/g, tabAsSpaces).replace(/\u00A0/g, ' ');
        
        // Calculate final correct characters and accuracy
        let finalCorrectChars = 0;
        const typedLength = Math.min(normInput.length, normChallenge.length);
        
        for (let i = 0; i < typedLength; i++) {
            if (normInput[i] === normChallenge[i]) {
                finalCorrectChars++;
            }
        }
        
        // Calculate final WPM and accuracy for this challenge
        const timeInMinutes = Math.max(totalTimeElapsed / 60, 0.01); // Prevent division by zero
        const finalCorrectWords = finalCorrectChars / 5;
        const totalWPM = Math.round(finalCorrectWords / timeInMinutes) || 0;
        const totalAccuracy = normInput.length > 0 
            ? Math.round((finalCorrectChars / normInput.length) * 100) 
            : 0;

        // --- NEW: Calculate overall stats for timed mode or word-based submit only ---
        let overallWPM = null;
        let overallAccuracy = null;
        let showOverall = false;
        // Only show overall stats if: (timed mode and timer expired) OR (word mode and submit button was used)
        if ((this.isTimedMode && isTimerExpired) || (!this.isTimedMode && this.isWordModeSubmit)) {
            // Use cumulative stats for all challenges in this session
            const totalSessionTime = (Date.now() - this.sessionStartTime) / 1000; // seconds
            const totalSessionMinutes = Math.max(totalSessionTime / 60, 0.01);
            overallWPM = Math.round((this.totalCorrectChars / 5) / totalSessionMinutes) || 0;
            overallAccuracy = this.totalCharsTyped > 0 ? Math.round((this.totalCorrectChars / this.totalCharsTyped) * 100) : 0;
            showOverall = true;
        }
        // --- END NEW ---

        const result = {
            wpm: Math.min(totalWPM, 300), // Cap at reasonable maximum
            accuracy: totalAccuracy,
            timeElapsed: totalTimeElapsed,
            challenge: this.currentChallenge.title,
            difficulty: this.challengeSelect.value,
            mode: this.modeSelect.value,
            target: this.isTimedMode ? this.durationSelect.value : this.wordCountSelect.value
        };

        // Update charts silently
        this.feedbackManager.updateCharts(result);

        // Hide submit button after test ends
        if (this.submitProgressBtn) {
            this.submitProgressBtn.classList.remove('active');
            console.log('Submit Progress button hidden (test ended)');
        }

        // --- Word Mode: Always show overlay on submit, but check for completion ---
        let isWordModeComplete = false;
        if (!this.isTimedMode) {
            // Compare input and challenge text, ignoring leading whitespace per line
            const tabAsSpaces = '    ';
            function normalize(str) {
                return str.replace(/\t/g, tabAsSpaces).replace(/\u00A0/g, ' ');
            }
            const inputLines = normalize(this.getUserInputValue()).split('\n');
            const challengeLines = normalize(this.currentChallenge.code).split('\n');
            if (inputLines.length === challengeLines.length && inputLines.every((line, idx) => {
                const inputContent = (line || '').replace(/^\s+/, '');
                const challengeContent = (challengeLines[idx] || '').replace(/^\s+/, '');
                return inputContent === challengeContent;
            })) {
                this.totalCompletedChallenges++;
                isWordModeComplete = true;
            }
            console.log("✔️ Word mode completed?", isWordModeComplete);
        }

        // --- Timed Mode: Check if completed early ---
        let isTimedModeComplete = false;
        let timedModeRemainingTime = 0;
        if (this.isTimedMode) {
            // If user finished early (input matches challenge exactly)
            if (normInput.length === normChallenge.length && normInput === normChallenge) {
                isTimedModeComplete = true;
                timedModeRemainingTime = remainingTime;
                this.totalCompletedChallenges++;
            }
        }

        // Always show overlay after test ends
        // Create completion overlay with corrected stats
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            font-family: 'Roboto Mono', monospace;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: var(--secondary-color);
            padding: 30px;
            border-radius: 8px;
            border: 1px solid var(--accent-color);
            text-align: center;
            max-width: 400px;
            width: 90%;
            animation: fadeIn 0.3s ease-out;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }
        `;
        document.head.appendChild(style);

        // Create message based on total accuracy or completion
        let message = '';
        if (!this.isTimedMode && !isWordModeComplete) {
            message = '<span style="color: var(--error-color); font-weight: bold;">You haven\'t finished the challenge yet! You can continue typing or start a new session.</span>';
        } else if (totalAccuracy >= 90) {
            message = '<span style="color: var(--success-color); font-weight: bold;">Excellent! Ready for the next challenge?</span>';
        } else if (totalAccuracy >= 70) {
            message = '<span style="color: var(--accent-color); font-weight: bold;">Good job! Keep practicing to improve.</span>';
        } else {
            message = '<span style="color: var(--error-color); font-weight: bold;">Keep practicing! Focus on accuracy.</span>';
        }

        // Always show Continue Playing button in both modes
        const showContinue = true;
        // Button label depends on mode
        const continueLabel = this.isTimedMode ? 'Continue (use remaining time)' : 'Continue Playing';

        // --- NEW: Add overall stats to overlay if session ended by timer ---
        let overallStatsHtml = '';
        if (showOverall) {
            overallStatsHtml = `
                <div style=\"margin-bottom: 20px; background: #232325; border-radius: 6px; padding: 12px;\">
                    <p style=\"color: var(--accent-color); margin: 10px 0; font-weight: bold;\">Overall WPM: <span style=\"color: var(--success-color); font-size: 1.1em;\">${overallWPM}</span></p>
                    <p style=\"color: var(--accent-color); margin: 10px 0; font-weight: bold;\">Overall Accuracy: <span style=\"color: var(--success-color); font-size: 1.1em;\">${overallAccuracy}%</span></p>
                </div>
            `;
        }
        // --- END NEW ---

        content.innerHTML = `
            <h3 style=\"color: var(--text-color); margin-bottom: 20px; font-size: 1.2em;\">Session Complete!</h3>
            <div style=\"margin-bottom: 20px;\">
                <p style=\"color: var(--text-color); margin: 10px 0;\">Total WPM: <span style=\"color: var(--accent-color);\">${totalWPM}</span></p>
                <p style=\"color: var(--text-color); margin: 10px 0;\">Total Accuracy: <span style=\"color: var(--accent-color);\">${totalAccuracy}%</span></p>
                <p style=\"color: var(--text-color); margin: 10px 0;\">Total Time: <span style=\"color: var(--accent-color);\">${Math.round(totalTimeElapsed)}s</span></p>
                <p style=\"color: var(--text-color); margin: 10px 0;\">Challenges Completed: <span style=\"color: var(--accent-color);\">${this.totalCompletedChallenges}</span></p>
            </div>
            ${overallStatsHtml}
            <div style=\"margin: 20px 0;\">${message}</div>
            <div style=\"display: flex; gap: 10px; justify-content: center;\">
                ${showContinue ? `<button id=\"continue-btn\" style=\"
                    padding: 8px 20px;
                    border: 1px solid var(--sub-color);
                    border-radius: 4px;
                    background: var(--secondary-color);
                    color: var(--text-color);
                    cursor: pointer;
                    transition: all 0.2s ease;
                \">${continueLabel}</button>` : ''}
                <button id=\"new-session-btn\" style=\"
                    padding: 8px 20px;
                    border: 1px solid var(--accent-color);
                    border-radius: 4px;
                    background: var(--secondary-color);
                    color: var(--accent-color);
                    cursor: pointer;
                    transition: all 0.2s ease;
                \">Start New Session</button>
            </div>
        `;

        // Add close (X) button to the message box (content div)
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', 'Close');
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 14px;
            background: transparent;
            border: none;
            color: var(--sub-color);
            font-size: 2em;
            font-weight: bold;
            cursor: pointer;
            z-index: 10;
            transition: color 0.2s;
            line-height: 1;
        `;
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.color = 'var(--error-color)';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.color = 'var(--sub-color)';
        });
        closeBtn.addEventListener('click', () => {
            overlay.remove();
            const timerStat = document.getElementById('timer-stat');
            if (timerStat) timerStat.classList.remove('warning');
        });
        content.style.position = 'relative';
        content.appendChild(closeBtn);
        overlay.appendChild(content);
        document.body.appendChild(overlay);

        // Add hover effects
        const continueBtn = content.querySelector('#continue-btn');
        const newSessionBtn = content.querySelector('#new-session-btn');
        if (continueBtn) {
            continueBtn.addEventListener('mouseover', () => {
                continueBtn.style.borderColor = 'var(--accent-color)';
                continueBtn.style.color = 'var(--accent-color)';
            });
            continueBtn.addEventListener('mouseout', () => {
                continueBtn.style.borderColor = 'var(--sub-color)';
                continueBtn.style.color = 'var(--text-color)';
            });
            // Continue Playing: move to next challenge
            continueBtn.addEventListener('click', () => {
                overlay.remove();
                const timerStat = document.getElementById('timer-stat');
                if (timerStat) timerStat.classList.remove('warning');
                // Timed mode: only allow continue if completed early
                if (this.isTimedMode) {
                    if (isTimedModeComplete && timedModeRemainingTime > 0) {
                        this.moveToNextChallenge(timedModeRemainingTime);
                    } else {
                        // If not completed early, just reset
                        this.resetTest();
                    }
                } else {
                    // Word-based mode: only allow continue if completed
                    if (isWordModeComplete) {
                        this.moveToNextChallenge(null);
                    } else {
                        // If not completed, just close overlay
                        // (user can keep typing)
                    }
                }
            });
        }
        newSessionBtn.addEventListener('mouseover', () => {
            newSessionBtn.style.borderColor = 'var(--success-color)';
            newSessionBtn.style.color = 'var(--success-color)';
        });
        newSessionBtn.addEventListener('mouseout', () => {
            newSessionBtn.style.borderColor = 'var(--accent-color)';
            newSessionBtn.style.color = 'var(--accent-color)';
        });
        // Start New Session: reset everything
        newSessionBtn.addEventListener('click', () => {
            overlay.remove();
            // Remove timer warning state
            const timerStat = document.getElementById('timer-stat');
            if (timerStat) timerStat.classList.remove('warning');
            this.sessionStartTime = null;
            this.totalWordsTyped = 0;
            this.totalCorrectChars = 0;
            this.totalCharsTyped = 0;
            this.resetTest();
        });

        // Always disable input after test ends
        this.userInput.contentEditable = 'false';
        this.startButton.disabled = false;
    }

	   moveToNextChallenge(remainingTime) {
        console.log('Moving to next challenge with remaining time:', remainingTime);

        const difficulty = this.challengeSelect.value;
        const mode = this.modeSelect.value;

        if (mode === 'time') {
            // --- Enhanced: Move to next difficulty if at end of current set ---
            const difficulties = ['beginner', 'intermediate', 'advanced'];
            const currentDiffIndex = difficulties.indexOf(difficulty);
            const challenges = window.challenges.javascript[difficulty];
            if (this.currentChallengeIndex < challenges.length - 1) {
                this.currentChallengeIndex++;
            } else {
                // If not last difficulty, move to next difficulty and reset index
                if (currentDiffIndex < difficulties.length - 1) {
                    const nextDiff = difficulties[currentDiffIndex + 1];
                    this.challengeSelect.value = nextDiff;
                    this.currentChallengeIndex = 0;
                } else {
                    // If at last difficulty, loop back to beginner
                    this.challengeSelect.value = difficulties[0];
                    this.currentChallengeIndex = 0;
                }
            }
            this.updateChallenge(this.currentChallengeIndex);
            setTimeout(() => this.startTest(remainingTime), 100);
            return;
        }

        // --- Word Mode için özel geçiş yap ---
        const wordCounts = Object.keys(window.challenges.wordBased).sort((a, b) => parseInt(a) - parseInt(b));
        const currentWordCount = this.wordCountSelect.value;
        const currentIndex = wordCounts.indexOf(currentWordCount);

        // Grubu bitirdiysen bir sonrakine geç
        let nextWordCount = currentWordCount;
        const currentChallenges = window.challenges.wordBased[currentWordCount];
        if (this.currentChallengeIndex < currentChallenges.length - 1) {
            this.currentChallengeIndex++;
        } else {
            // Grup bitti → sonraki kelime grubuna geç
            const nextGroupIndex = (currentIndex + 1) % wordCounts.length;
            nextWordCount = wordCounts[nextGroupIndex];
            this.wordCountSelect.value = nextWordCount;
            this.currentChallengeIndex = 0;
        }

        this.updateChallenge(this.currentChallengeIndex);
        setTimeout(() => this.startTest(remainingTime), 100);
    }
    resetTest() {
        // Reset the test state
        this.currentChallenge = null;
        this.currentChallengeIndex = 0;
        this.startTime = null;
        this.timer = null;
        this.userInput.textContent = '';
        this.wpmDisplay.textContent = '0';
        this.accuracyDisplay.textContent = '0';
        this.timerDisplay.textContent = this.isTimedMode ? this.durationSelect.value : '0';
        this.startButton.disabled = false;
        this.userInput.contentEditable = 'false';
        this.userInput.focus();

        // Reset total stats
        this.totalWordsTyped = 0;
        this.totalCorrectChars = 0;
        this.totalCharsTyped = 0;
        this.sessionStartTime = null;

        // Update the challenge display
        this.updateChallenge();

        // Hide submit button on reset
        if (this.submitProgressBtn) {
            this.submitProgressBtn.classList.remove('active');
            console.log('Submit Progress button hidden (reset)');
        }
    }
}

// Initialize the typing test
const typingTest = new TypingTest();