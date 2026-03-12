// Game state
let gameState = {
    players: [],
    activePlayerIndex: null,
    history: [],
    currentRound: 1,
    exchangesUsed: 0,
    maxExchanges: 3
};

// DOM elements
const setupScreen = document.getElementById('setupScreen');
const gameScreen = document.getElementById('gameScreen');
const winnerScreen = document.getElementById('winnerScreen');
const playerCountBtns = document.querySelectorAll('.player-count-btn');
const playerNamesDiv = document.getElementById('playerNames');
const nameInputsDiv = document.getElementById('nameInputs');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const playersContainer = document.getElementById('playersContainer');
const scoreBtns = document.querySelectorAll('.score-btn');
const undoBtn = document.getElementById('undoBtn');
const winnerName = document.getElementById('winnerName');
const newGameBtn = document.getElementById('newGameBtn');
const historyBtn = document.getElementById('historyBtn');
const historyModal = document.getElementById('historyModal');
const closeHistoryBtn = document.getElementById('closeHistoryBtn');
const historyMatrix = document.getElementById('historyMatrix');

// Initialize
function init() {
    setupEventListeners();
}

function setupEventListeners() {
    // Player count selection
    playerCountBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            playerCountBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            const count = parseInt(btn.dataset.players);
            showPlayerNameInputs(count, e);
        });
    });

    // Start game
    startBtn.addEventListener('click', startGame);

    // Reset game
    resetBtn.addEventListener('click', () => {
        if (confirm('Är du säker på att du vill starta om?')) {
            resetGame();
        }
    });

    // Score buttons
    scoreBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const score = parseInt(btn.dataset.score);
            addScore(score);
        });
    });

    // Undo button
    undoBtn.addEventListener('click', undoLastAction);

    // New game button
    newGameBtn.addEventListener('click', resetGame);

    // History button
    if (historyBtn) {
        historyBtn.addEventListener('click', showHistoryModal);
    }

    // Close history modal
    if (closeHistoryBtn) {
        closeHistoryBtn.addEventListener('click', hideHistoryModal);
    }

    // Close modal when clicking outside
    if (historyModal) {
        historyModal.addEventListener('click', (e) => {
            if (e.target === historyModal) {
                hideHistoryModal();
            }
        });
    }

    // Exchange and round button listeners
    const exchangeBtn = document.getElementById('exchangeBtn');
    const nextRoundBtn = document.getElementById('nextRoundBtn');
    
    if (exchangeBtn) {
        exchangeBtn.addEventListener('click', incrementExchange);
    }
    
    if (nextRoundBtn) {
        nextRoundBtn.addEventListener('click', () => {
            if (confirm('Gå till nästa giv?')) {
                nextRound();
            }
        });
    }
}

function showPlayerNameInputs(count, userEvent) {
    nameInputsDiv.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Spelare ${i + 1}`;
        input.value = '';  // Start with empty value so user can type immediately
        input.maxLength = 20;
        input.setAttribute('inputmode', 'text');
        input.setAttribute('autocomplete', 'off');
        
        // Autofocus on first input
        if (i === 0) {
            input.setAttribute('autofocus', 'autofocus');
        }
        
        // Store default name as data attribute
        input.dataset.defaultName = `Spelare ${i + 1}`;
        
        nameInputsDiv.appendChild(input);
    }
    playerNamesDiv.classList.remove('hidden');
}

function startGame() {
    const inputs = nameInputsDiv.querySelectorAll('input');
    const names = Array.from(inputs).map(input => input.value.trim() || input.placeholder);
    
    // Initialize players
    gameState.players = names.map(name => ({
        name: name,
        score: 0,
        koepstopp: false,
        chicagoBlocked: false
    }));
    
    gameState.activePlayerIndex = 0;
    gameState.history = [];
    gameState.currentRound = 1;
    gameState.exchangesUsed = 0;
    
    // Show game screen
    setupScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    // Show history button
    if (historyBtn) {
        historyBtn.classList.remove('hidden');
    }
    
    renderPlayers();
    updateScoreButtons();
    updateRoundInfo();
}

function renderPlayers() {
    playersContainer.innerHTML = '';
    
    gameState.players.forEach((player, index) => {
        const card = document.createElement('div');
        card.className = 'player-card';
        
        if (index === gameState.activePlayerIndex) {
            card.classList.add('active');
        }
        
        if (player.koepstopp) {
            card.classList.add('koepstopp');
        }
        
        if (player.chicagoBlocked) {
            card.classList.add('chicago-blocked');
        }
        
        card.innerHTML = `
            <div class="player-name">${player.name}</div>
            <div class="player-score">${player.score}</div>
        `;
        
        card.addEventListener('click', () => {
            setActivePlayer(index);
        });
        
        playersContainer.appendChild(card);
    });
}

function setActivePlayer(index) {
    gameState.activePlayerIndex = index;
    renderPlayers();
    updateScoreButtons();
}

function addScore(points) {
    const player = gameState.players[gameState.activePlayerIndex];
    
    // Save to history
    gameState.history.push({
        playerIndex: gameState.activePlayerIndex,
        points: points,
        previousScore: player.score,
        wasKoepstopp: player.koepstopp,
        wasChicagoBlocked: player.chicagoBlocked,
        round: gameState.currentRound,
        exchanges: gameState.exchangesUsed
    });
    
    // Add points
    player.score += points;
    
    // Check for chicago blocked (>= 32 points)
    if (player.score >= 32) {
        player.chicagoBlocked = true;
    } else {
        player.chicagoBlocked = false;
    }
    
    // Check for köpstopp
    if (player.score >= 47) {
        player.koepstopp = true;
    } else {
        // Remove köpstopp if score drops below 47
        player.koepstopp = false;
    }
    
    // Check for winner (52 points = Chicago win)
    if (player.score >= 52) {
        showWinner(player);
        return;
    }
    
    // Update UI (keep focus on current player)
    renderPlayers();
    updateScoreButtons();
    updateUndoButton();
}

function showHistoryModal() {
    renderHistoryMatrix();
    historyModal.classList.remove('hidden');
}

function hideHistoryModal() {
    historyModal.classList.add('hidden');
}

function renderHistoryMatrix() {
    if (!historyMatrix) return;
    
    // Build matrix data structure
    const matrixData = {};
    
    gameState.history.forEach(entry => {
        const round = entry.round;
        const playerIndex = entry.playerIndex;
        const points = entry.points;
        
        if (!matrixData[round]) {
            matrixData[round] = {};
        }
        
        if (!matrixData[round][playerIndex]) {
            matrixData[round][playerIndex] = [];
        }
        
        matrixData[round][playerIndex].push(points);
    });
    
    // Get all rounds
    const rounds = Object.keys(matrixData).sort((a, b) => parseInt(a) - parseInt(b));
    
    if (rounds.length === 0) {
        historyMatrix.innerHTML = '<p class="no-history">Ingen historik ännu. Börja spela för att se poängmatrisen!</p>';
        return;
    }
    
    // Build HTML table
    let html = '<table class="matrix-table">';
    
    // Header row
    html += '<thead><tr><th>Giv</th>';
    gameState.players.forEach(player => {
        html += `<th>${player.name}</th>`;
    });
    html += '</tr></thead><tbody>';
    
    // Data rows
    rounds.forEach(round => {
        html += `<tr><td class="round-cell">Giv ${round}</td>`;
        
        gameState.players.forEach((player, playerIndex) => {
            const scores = matrixData[round][playerIndex] || [];
            
            if (scores.length > 0) {
                const total = scores.reduce((sum, s) => sum + s, 0);
                const scoresText = scores.map(s => {
                    if (s > 0) return `+${s}`;
                    return s.toString();
                }).join(', ');
                
                let cellClass = 'score-cell';
                if (total > 0) cellClass += ' positive';
                if (total < 0) cellClass += ' negative';
                if (total >= 52) cellClass += ' chicago';
                
                html += `<td class="${cellClass}" title="${scoresText}">`;
                html += `<span class="score-value">${total > 0 ? '+' : ''}${total}</span>`;
                if (scores.length > 1) {
                    html += `<span class="score-detail">${scoresText}</span>`;
                }
                html += '</td>';
            } else {
                html += '<td class="score-cell empty">-</td>';
            }
        });
        
        html += '</tr>';
    });
    
    // Total row
    html += '<tr class="total-row"><td class="round-cell">Totalt</td>';
    gameState.players.forEach(player => {
        html += `<td class="score-cell total">${player.score}</td>`;
    });
    html += '</tr>';
    
    html += '</tbody></table>';
    
    historyMatrix.innerHTML = html;
}

function moveToNextPlayer() {
    // Find next player who doesn't have köpstopp
    let attempts = 0;
    const totalPlayers = gameState.players.length;
    
    do {
        gameState.activePlayerIndex = (gameState.activePlayerIndex + 1) % totalPlayers;
        attempts++;
        
        // If all players have köpstopp, stay on current
        if (attempts >= totalPlayers) {
            break;
        }
    } while (gameState.players[gameState.activePlayerIndex].koepstopp);
}

function updateScoreButtons() {
    // All score buttons are always enabled - no restrictions
}

function updateUndoButton() {
    undoBtn.disabled = gameState.history.length === 0;
}

function undoLastAction() {
    if (gameState.history.length === 0) return;
    
    const lastAction = gameState.history.pop();
    const player = gameState.players[lastAction.playerIndex];
    
    // Restore previous state
    player.score = lastAction.previousScore;
    player.koepstopp = lastAction.wasKoepstopp;
    player.chicagoBlocked = lastAction.wasChicagoBlocked;
    gameState.currentRound = lastAction.round;
    gameState.exchangesUsed = lastAction.exchanges;
    
    // Set active player back to the one who just got points
    gameState.activePlayerIndex = lastAction.playerIndex;
    
    // Update UI
    renderPlayers();
    updateScoreButtons();
    updateUndoButton();
    updateRoundInfo();
}

function incrementExchange() {
    if (gameState.exchangesUsed < gameState.maxExchanges) {
        gameState.exchangesUsed++;
        updateRoundInfo();
    }
}

function nextRound() {
    gameState.currentRound++;
    gameState.exchangesUsed = 0;
    updateRoundInfo();
}

function updateRoundInfo() {
    const roundDisplay = document.getElementById('roundDisplay');
    const exchangeDisplay = document.getElementById('exchangeDisplay');
    const exchangeBtn = document.getElementById('exchangeBtn');
    
    if (roundDisplay) {
        roundDisplay.textContent = gameState.currentRound;
    }
    
    if (exchangeDisplay) {
        exchangeDisplay.textContent = `${gameState.exchangesUsed}/${gameState.maxExchanges}`;
        
        // Highlight if all exchanges are used
        const exchangeCounter = document.getElementById('exchangeCounter');
        if (exchangeCounter) {
            if (gameState.exchangesUsed >= gameState.maxExchanges) {
                exchangeCounter.classList.add('exchanges-full');
                if (exchangeBtn) {
                    exchangeBtn.disabled = true;
                }
            } else {
                exchangeCounter.classList.remove('exchanges-full');
                if (exchangeBtn) {
                    exchangeBtn.disabled = false;
                }
            }
        }
    }
}

function showWinner(player) {
    winnerName.textContent = `${player.name} vann med ${player.score} poäng!`;
    winnerScreen.classList.remove('hidden');
}

function resetGame() {
    gameState = {
        players: [],
        activePlayerIndex: null,
        history: [],
        currentRound: 1,
        exchangesUsed: 0,
        maxExchanges: 3
    };
    
    setupScreen.classList.remove('hidden');
    gameScreen.classList.add('hidden');
    winnerScreen.classList.add('hidden');
    
    // Hide history button and modal
    if (historyBtn) {
        historyBtn.classList.add('hidden');
    }
    if (historyModal) {
        historyModal.classList.add('hidden');
    }
    
    playerNamesDiv.classList.add('hidden');
    playerCountBtns.forEach(b => b.classList.remove('selected'));
    nameInputsDiv.innerHTML = '';
}

// Initialize app
init();

// Register service worker for PWA support with auto-update
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then((registration) => {
            console.log('Service Worker registered');
            
            // Check for updates every 30 seconds
            setInterval(() => {
                registration.update();
            }, 30000);
            
            // Listen for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'activated') {
                        // Show update notification
                        showUpdateNotification();
                    }
                });
            });
        })
        .catch((error) => console.log('Service Worker registration failed:', error));
    
    // Reload page when new service worker takes control
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
    });
}

// Show update notification
function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #27ae60;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: bold;
        text-align: center;
        animation: slideDown 0.3s ease-out;
    `;
    notification.textContent = '🔄 Ny version laddas...';
    document.body.appendChild(notification);
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}
