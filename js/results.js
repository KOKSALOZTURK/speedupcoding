class Results {
    constructor() {
        this.results = [];
        this.loadResults();
    }

    loadResults() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            const users = JSON.parse(localStorage.getItem('users') || '{}');
            this.results = (users[currentUser] && users[currentUser].results) ? users[currentUser].results : [];
        } else {
            this.results = [];
        }
    }

    addResult(result) {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) return;
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        if (!users[currentUser]) return;
        if (!users[currentUser].results) users[currentUser].results = [];
        users[currentUser].results.push({
            ...result,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('users', JSON.stringify(users));
        this.results = users[currentUser].results;
        this.displayResults();
    }

    displayResults() {
        if (typeof this.updateResultsDisplay === 'function') {
            this.updateResultsDisplay();
        }
    }

    getAverageWPM() {
        if (this.results.length === 0) return 0;
        const totalWPM = this.results.reduce((sum, result) => sum + result.wpm, 0);
        return Math.round(totalWPM / this.results.length);
    }

    getAverageAccuracy() {
        if (this.results.length === 0) return 0;
        const totalAccuracy = this.results.reduce((sum, result) => sum + result.accuracy, 0);
        return Math.round(totalAccuracy / this.results.length);
    }

    updateResultsDisplay() {
        const resultsContainer = document.getElementById('results-container');
        if (!resultsContainer) return;

        const averageWPM = this.getAverageWPM();
        const averageAccuracy = this.getAverageAccuracy();

        resultsContainer.innerHTML = `
            <div class="stats">
                <div class="stat">
                    <h3>Average WPM</h3>
                    <p>${averageWPM}</p>
                </div>
                <div class="stat">
                    <h3>Average Accuracy</h3>
                    <p>${averageAccuracy}%</p>
                </div>
            </div>
            <div class="recent-results">
                <h3>Recent Results</h3>
                <div class="results-list">
                    ${this.results.slice(-5).reverse().map(result => `
                        <div class="result-item">
                            <p>WPM: ${result.wpm}</p>
                            <p>Accuracy: ${result.accuracy}%</p>
                            <p>Time: ${new Date(result.timestamp).toLocaleString()}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

const results = new Results(); 