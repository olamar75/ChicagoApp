// Game state
let gameState = {
    players: [],
    activePlayerIndex: null,
    history: []
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

// Initialize
function init() {
    setupEventListeners();
}

function setupEventListeners() {
    // Player count selection
    playerCountBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            playerCountBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            const count = parseInt(btn.dataset.players);
            showPlayerNameInputs(count);
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
}

function showPlayerNameInputs(count) {
    nameInputsDiv.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Spelare ${i + 1}`;
        input.value = `Spelare ${i + 1}`;
        input.maxLength = 20;
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
        koepstopp: false
    }));
    
    gameState.activePlayerIndex = 0;
    gameState.history = [];
    
    // Show game screen
    setupScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    renderPlayers();
    updateScoreButtons();
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
    
    // Check if player can receive points
    if (player.koepstopp && points !== 52 && points > 0) {
        alert(`${player.name} har köpstopp och kan inte få fler poäng (förutom Chicago)!`);
        return;
    }
    
    // Save to history
    gameState.history.push({
        playerIndex: gameState.activePlayerIndex,
        points: points,
        previousScore: player.score,
        wasKoepstopp: player.koepstopp
    });
    
    // Add points
    player.score += points;
    
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
    const activePlayer = gameState.players[gameState.activePlayerIndex];
    
    // Disable buttons based on player state
    scoreBtns.forEach(btn => {
        const score = parseInt(btn.dataset.score);
        
        if (score === 52) {
            // Royal flush - disable if player has >= 32 points
            btn.disabled = activePlayer.score >= 32;
        } else if (score < 0) {
            // Negative scores (penalties) are always enabled
            btn.disabled = false;
        } else {
            // Positive score buttons - disable if player has köpstopp
            btn.disabled = activePlayer.koepstopp;
        }
    });
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
    
    // Set active player back to the one who just got points
    gameState.activePlayerIndex = lastAction.playerIndex;
    
    // Update UI
    renderPlayers();
    updateScoreButtons();
    updateUndoButton();
}

function showWinner(player) {
    winnerName.textContent = `${player.name} vann med ${player.score} poäng!`;
    winnerScreen.classList.remove('hidden');
}

function resetGame() {
    gameState = {
        players: [],
        activePlayerIndex: null,
        history: []
    };
    
    setupScreen.classList.remove('hidden');
    gameScreen.classList.add('hidden');
    winnerScreen.classList.add('hidden');
    
    playerNamesDiv.classList.add('hidden');
    playerCountBtns.forEach(b => b.classList.remove('selected'));
    nameInputsDiv.innerHTML = '';
}

// Initialize app
init();
