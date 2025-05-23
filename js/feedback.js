class FeedbackManager {
    constructor() {
        this.suggestionArea = document.getElementById('suggestion-area');
        this.realtimeFeedbackEnabled = true;
        this.performanceChart = null;
        this.accuracyChart = null;
    }

    toggleRealtimeFeedback(enabled) {
        this.realtimeFeedbackEnabled = enabled;
        if (!enabled) {
            this.clearSuggestion();
        }
    }

    clearSuggestion() {
        this.suggestionArea.textContent = '';
    }

    generateHighlightedText(input, text) {
        
        const tabAsSpaces = '    ';
        const normInput = input.replace(/\t/g, tabAsSpaces).replace(/\u00A0/g, ' ');
        const normText = text.replace(/\t/g, tabAsSpaces).replace(/\u00A0/g, ' ');

        let highlightedText = '';
        let firstErrorIndex = -1;
        let accuracy = 0;

        for (let i = 0; i < normInput.length; i++) {
            const char = normInput[i];
            const expectedChar = normText[i];
            if (char === expectedChar) {
                accuracy++;
                highlightedText += char;
            } else {
                if (firstErrorIndex === -1) {
                    firstErrorIndex = i;
                }
                if (this.realtimeFeedbackEnabled) {
                    highlightedText += `<span class=\"incorrect-char\">${char}</span>`;
                } else {
                    highlightedText += char;
                }
            }
        }
        
        return {
            highlightedText,
            firstErrorIndex,
            accuracy,
            normInput,
            normText
        };
    }

    generateSuggestion(input, text, firstErrorIndex, normInput = null, normText = null) {
        if (!this.realtimeFeedbackEnabled) {
            return '';
        }

        
        const tabAsSpaces = '    ';
        normInput = normInput || input.replace(/\t/g, tabAsSpaces).replace(/\u00A0/g, ' ');
        normText = normText || text.replace(/\t/g, tabAsSpaces).replace(/\u00A0/g, ' ');

        if (firstErrorIndex === -1) {
            
            if (normInput.length > 0) {
                return 'Keep typing!';
            }
            return '';
        }

        const expectedChar = normText[firstErrorIndex] || '';
        const typedChar = normInput[firstErrorIndex] || '';

        if (expectedChar === ' ' && typedChar !== ' ') {
            return 'Check for missing space.';
        } else if (expectedChar === '\n') {
            return 'Check for missing line break.';
        } else if (expectedChar && typedChar) {
            return `Expected '${expectedChar}', but got '${typedChar}'.`;
        } else if (!typedChar) {
            return 'Keep going!';
        }

        return '';
    }

    updateSuggestion(suggestion) {
        if (this.realtimeFeedbackEnabled) {
            this.suggestionArea.textContent = suggestion;
        } else {
            this.clearSuggestion();
        }
    }

    showExerciseFeedback(result) {
        const feedbackDiv = document.getElementById('exercise-feedback');
        let message = '';
        if (result.accuracy < 70) {
            message = '<span style="color:#e74c3c;font-weight:bold;">Keep practicing! Focus on accuracy and try to type a bit slower for better results.</span>';
        } else if (result.accuracy < 86) {
            message = '<span style="color:#f39c12;font-weight:bold;">Good job! You are getting there. Try to improve your accuracy for even better results.</span>';
        } else {
            message = '<span style="color:#27ae60;font-weight:bold;">Excellent! Your accuracy is outstanding. Keep up the great work!</span>';
        }
        feedbackDiv.innerHTML = `
            <div class="feedback-container">
                <h3>Exercise Complete!</h3>
                <p>WPM: ${result.wpm}</p>
                <p>Accuracy: ${result.accuracy}%</p>
                <p>Time: ${Math.round(result.timeElapsed)}s</p>
                <div style="margin-top:16px;">${message}</div>
            </div>
        `;
    }

    updateCharts(result) {
        
        const results = JSON.parse(localStorage.getItem('typingResults') || '[]');
        results.push(result);
        
        const lastTenResults = results.slice(-10);
        localStorage.setItem('typingResults', JSON.stringify(lastTenResults));

        
        if (this.performanceChart) {
            this.performanceChart.destroy();
        }
        if (this.accuracyChart) {
            this.accuracyChart.destroy();
        }

        const performanceChartContainer = document.getElementById('performance-chart').parentElement;
        const accuracyChartContainer = document.getElementById('accuracy-chart').parentElement;
        performanceChartContainer.style.height = '300px';
        accuracyChartContainer.style.height = '300px';

        const performanceCtx = document.getElementById('performance-chart').getContext('2d');
        this.performanceChart = new Chart(performanceCtx, {
            type: 'line',
            data: {
                labels: lastTenResults.map((_, i) => i + 1),
                datasets: [{
                    label: 'WPM',
                    data: lastTenResults.map(r => r.wpm),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Words Per Minute'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Attempt Number'
                        }
                    }
                }
            }
        });

        const accuracyCtx = document.getElementById('accuracy-chart').getContext('2d');
        this.accuracyChart = new Chart(accuracyCtx, {
            type: 'line',
            data: {
                labels: lastTenResults.map((_, i) => i + 1),
                datasets: [{
                    label: 'Accuracy %',
                    data: lastTenResults.map(r => r.accuracy),
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Accuracy Percentage'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Attempt Number'
                        }
                    }
                }
            }
        });
    }
}

window.FeedbackManager = FeedbackManager; 