# Typing Speed Test for Coders

## Overview
This project is a web-based typing speed game designed for coders. It helps users improve their typing speed and accuracy by providing real code challenges in both timed and word-based modes. The game features real-time feedback, session statistics, and smooth progression through different difficulty levels.

---

## How to Use
1. **Select Difficulty:** Choose Beginner, Intermediate, or Advanced from the dropdown.
2. **Select Mode:** Choose between Time Mode (type for a set time) or Words Mode (type a set number of words).
3. **Set Duration/Word Count:** Choose the time limit or word count for your session.
4. **Start Challenge:** Click the Start button to begin typing the displayed code challenge.
5. **Type the Code:** Type the code as accurately as possible in the input area. Real-time feedback will highlight errors.
6. **View Stats:** After each challenge, view your WPM (Words Per Minute), Accuracy, and other stats in the overlay.
7. **Continue or Start New:** Use the overlay buttons to continue to the next challenge or start a new session.

---

## File Structure
- `index.html` — Main HTML file for the game interface.
- `style.css` — Stylesheet for layout, colors, and responsive design.
- `js/main.js` — Main game logic and UI interactions.
- `js/challenges.js` — Contains the code challenges for each difficulty and mode.
- `js/feedback.js` — Handles real-time feedback and suggestions.
- `typing_speed_logo.png` — Logo image for branding.

---

## Main Functions and Their Roles

### 1. TypingTest Class (`js/main.js`)
This is the core class that manages the game state, user interactions, and session statistics.

#### Constructor
- Initializes all UI elements and event listeners.
- Sets up the first challenge and feedback manager.
```js
class TypingTest {
    constructor() {
        // ...initialization code...
    }
}
```

#### initializeElements()
- Finds and stores references to all important HTML elements (buttons, toggles, displays, etc.).
- Logs errors if any required element is missing.
```js
initializeElements() {
    this.challengeText = document.getElementById('challenge-text');
    this.userInput = document.getElementById('user-input');
    // ...other elements...
}
```

#### initializeEventListeners()
- Sets up all button and toggle event listeners.
- Handles user actions like starting a test, changing modes, navigating challenges, and toggling feedback.
```js
initializeEventListeners() {
    if (this.startButton) {
        this.startButton.addEventListener('click', (e) => {
            this.startTest();
        });
    }
    // ...other listeners...
}
```

#### initializeChallenge()
- Loads the first challenge based on the selected mode and difficulty.
- Disables the input area until the test starts.
```js
initializeChallenge() {
    if (!window.challenges) {
        setTimeout(() => this.initializeChallenge(), 100);
        return;
    }
    this.updateChallenge();
    this.userInput.contentEditable = 'false';
}
```

#### toggleMode()
- Switches between Time Mode and Words Mode.
- Updates the UI to show the correct controls for each mode.
```js
toggleMode() {
    const isTimeBased = this.modeSelect.value === 'time';
    this.durationSelect.style.display = isTimeBased ? 'inline-block' : 'none';
    this.wordCountSelect.style.display = isTimeBased ? 'none' : 'inline-block';
    this.isTimedMode = isTimeBased;
    // ...
}
```

#### toggleRealtimeFeedback()
- Enables or disables real-time feedback for typing errors.
- Calls the feedback manager to update the display.
```js
toggleRealtimeFeedback() {
    const enabled = this.realtimeFeedbackToggle.checked;
    this.feedbackManager.toggleRealtimeFeedback(enabled);
    this.checkInput();
}
```

#### getUserInputValue()
- Reads the user's input from the contenteditable area, preserving spaces and newlines.
- Used for accurate comparison with the challenge code.
```js
getUserInputValue() {
    let value = '';
    function traverse(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            value += node.textContent.replace(/\u00A0/g, ' ');
        } else if (node.nodeName === 'BR') {
            value += '\n';
        } else if (node.nodeName === 'DIV') {
            if (value.length > 0) value += '\n';
            node.childNodes.forEach(traverse);
        } else {
            node.childNodes.forEach(traverse);
        }
    }
    this.userInput.childNodes.forEach(traverse);
    return value;
}
```

#### visualizeInvisible(str)
- (Debugging) Shows invisible characters like spaces and newlines for troubleshooting.
```js
visualizeInvisible(str) {
    return str
        .replace(/ /g, '·')
        .replace(/\t/g, '→')
        .replace(/\n/g, '¶\n');
}
```

#### checkInput()
- Compares the user's input to the challenge code.
- Updates accuracy and WPM stats in real time.
- Ends the test if the challenge is completed or the word/time limit is reached.
- Provides suggestions for corrections.
```js
checkInput() {
    const input = this.getUserInputValue();
    const text = this.currentChallenge.code;
    // ...compare and update stats...
    if (this.isTimedMode) {
        this.updateWPM();
        if (input.length === text.length && input === text && this.timer) {
            this.endTest();
        }
    } else {
        this.updateWPM();
        // ...word mode logic...
    }
    this.feedbackManager.updateSuggestion(suggestion);
}
```

#### startTest(remainingTime = null)
- Starts a new typing test session.
- Initializes timers and stats.
- Enables the input area and disables the Start button.
- Handles both timed and word-based modes.
```js
startTest(remainingTime = null) {
    if (!this.sessionStartTime) {
        this.sessionStartTime = Date.now();
        this.totalWordsTyped = 0;
        this.totalCorrectChars = 0;
        this.totalCharsTyped = 0;
    }
    this.startTime = Date.now();
    this.userInput.textContent = '';
    this.userInput.contentEditable = 'true';
    this.userInput.focus();
    this.startButton.disabled = true;
    // ...timer setup...
}
```

#### toggleTimingMode()
- Enables or disables timed mode.
- Updates the UI and resets the timer as needed.
```js
toggleTimingMode() {
    this.isTimedMode = this.timingToggle.checked;
    if (this.isTimedMode) {
        this.statsDisplay.classList.remove('timing-disabled');
        this.userInput.contentEditable = 'false';
        this.startButton.disabled = false;
        this.timerDisplay.textContent = this.durationSelect.value;
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
```

#### updateChallenge(index = 0)
- Loads a new challenge based on the current mode, difficulty, and index.
- Updates the display and navigation buttons.
```js
updateChallenge(index = 0) {
    // ...get challenge data...
    this.currentChallengeIndex = index;
    this.currentChallenge = challenges[this.currentChallengeIndex];
    // ...update display...
}
```

#### escapeHtml(unsafe)
- Escapes HTML characters to prevent code injection in the challenge display.
```js
escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
```

#### previousChallenge() / nextChallenge()
- Navigates to the previous or next challenge in the current set.
```js
previousChallenge() {
    if (this.currentChallengeIndex > 0) {
        this.updateChallenge(this.currentChallengeIndex - 1);
    }
}
nextChallenge() {
    const challenges = window.challenges.javascript[difficulty];
    if (this.currentChallengeIndex < challenges.length - 1) {
        this.updateChallenge(this.currentChallengeIndex + 1);
    }
}
```

#### handleKeyDown(e)
- Handles special key events (like Tab for spaces) in the input area.
```js
handleKeyDown(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        // ...insert spaces...
    }
}
```

#### updateWPM()
- Calculates and updates the Words Per Minute stat based on correct characters typed and elapsed time.
```js
updateWPM() {
    if (!this.startTime) return;
    const timeElapsed = (Date.now() - this.startTime) / 1000 / 60;
    // ...calculate WPM...
    this.wpmDisplay.textContent = cappedWPM;
}
```

#### endTest()
- Ends the current test session.
- Calculates final stats (WPM, accuracy, time, challenges completed).
- Shows an overlay with results and options to continue or start a new session.
- Disables the input area after the test.
```js
endTest() {
    if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
    }
    // ...calculate stats and show overlay...
    this.userInput.contentEditable = 'false';
    this.startButton.disabled = false;
}
```

#### moveToNextChallenge(remainingTime)
- Advances to the next challenge or difficulty group.
- Resets the test and starts the next challenge automatically.
```js
moveToNextChallenge(remainingTime) {
    // ...logic to move to next challenge or group...
    this.updateChallenge(this.currentChallengeIndex);
    setTimeout(() => this.startTest(remainingTime), 100);
}
```

#### resetTest()
- Resets all stats and UI elements to their initial state.
- Prepares the game for a new session.
```js
resetTest() {
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
    // ...reset stats and update challenge...
}
```

### 2. FeedbackManager Class (`js/feedback.js`)
- Handles real-time feedback, highlighting errors, and generating suggestions.
- Updates performance and accuracy history for charts.
```js
// Example method in FeedbackManager
updateSuggestion(suggestion) {
    // ...update the suggestion area with feedback...
}
```

### 3. Challenge Data (`js/challenges.js`)
- Stores all code challenges for each difficulty and mode.
- Provides the challenge text and description for the game.
```js
// Example challenge data structure
window.challenges = {
    javascript: {
        beginner: [
            { title: 'Print Hello', description: 'Print Hello World', code: 'console.log("Hello World");' },
            // ...more challenges...
        ],
        // ...other difficulties...
    },
    wordBased: {
        '25': [ /* ... */ ],
        // ...
    }
};
```

---

## Accessibility & UI Features
- Keyboard navigation and focus-visible outlines for accessibility.
- Tooltips and ARIA labels for better usability.
- Responsive layout for different screen sizes.
- Real-time feedback and error highlighting.

---

## Customization
- You can add or edit code challenges in `js/challenges.js`.
- Adjust colors and layout in `style.css`.
- Change logo by replacing `typing_speed_logo.png`.

---

## Presentation Tips
- Demonstrate switching between modes and difficulties.
- Show real-time feedback and stats updates.
- Highlight the overlay with session results.
- Explain how the game helps improve coding speed and accuracy.

---

## Credits
Developed as a coding speed improvement tool for programmers and learners.

---

## End-of-Test Overlay Close Button ("X")

A close ("×") button is now available at the top right of the end-of-test overlay. This allows users to dismiss the overlay at any time, improving usability and matching modern UI expectations.

**How it works:**
- The button appears in the top right corner of the overlay.
- Clicking it closes the overlay and removes any timer warning state.

**Code Snippet:**
```js
// Add close (X) button to overlay
const closeBtn = document.createElement('button');
closeBtn.innerHTML = '&times;';
closeBtn.setAttribute('aria-label', 'Close');
closeBtn.style.cssText = `
    position: absolute;
    top: 12px;
    right: 16px;
    background: transparent;
    border: none;
    color: var(--sub-color);
    font-size: 2em;
    font-weight: bold;
    cursor: pointer;
    z-index: 10;
    transition: color 0.2s;
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
overlay.appendChild(closeBtn);
```

This code is added to the overlay creation logic in `endTest()` in `js/main.js`.

---