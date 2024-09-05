const gameBoard = document.getElementById('game-board');
const wordLengthSelect = document.getElementById('word-length');
const newGameButton = document.getElementById('new-game');
const keyboard = document.getElementById('keyboard');
const backspaceButton = document.getElementById('backspace');
const enterButton = document.getElementById('enter');

const winModal = document.getElementById('win-modal');
const loseModal = document.getElementById('lose-modal');
const newGameFromWinButton = document.getElementById('new-game-from-win');
const newGameFromLoseButton = document.getElementById('new-game-from-lose');

let currentWord = '';
let guesses = [];
let currentGuess = '';
let letterStates = {};
let winLose ;

function selectWord(wordLength){
    if(wordLength === 3){
        currentWord = threeLetterArr[Math.floor(Math.random() * threeLetterArr.length)];
    }else if (wordLength === 4){
        currentWord = fourLetterArr[Math.floor(Math.random() * fourLetterArr.length)];
    }else if (wordLength === 5){
        currentWord = fiveLetterArr[Math.floor(Math.random() * fiveLetterArr.length)];
    }else if (wordLength === 6){
        currentWord = sixLetterArr[Math.floor(Math.random() * sixLetterArr.length)];
    }
    currentWord = currentWord.toUpperCase();
    console.log(currentWord);
}

function createGameBoard(wordLength) {
    gameBoard.innerHTML = ''; // Var olan tahtayı temizle
    gameBoard.style.gridTemplateRows = `repeat(6, 1fr)`;
    
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        row.style.gridTemplateColumns = `repeat(${wordLength}, 1fr)`;
        
        for (let j = 0; j < wordLength; j++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            row.appendChild(tile);
        }
        
        gameBoard.appendChild(row);
    }
}

function startNewGame() {
    const wordLength = parseInt(wordLengthSelect.value);
    createGameBoard(wordLength);
    selectWord(wordLength); 
    guesses = [];
    currentGuess = '';
    resetKeyboard();
    letterStates = {};
    updateKeyboard();
    hideModals();
}

function checkGuess(guess) {
    const wordLength = parseInt(wordLengthSelect.value);
    
    if (guess.length !== wordLength) {
        alert('Tahmininiz uygun uzunlukta değil!');
        return;
    }

    const guessUpper = guess.toUpperCase();

    const row = document.querySelectorAll('.row')[guesses.length];
    const tiles = row.querySelectorAll('.tile');
    const guessLetters = guessUpper.split('');
    const correctLetters = new Array(wordLength).fill(false);
    
    for (let i = 0; i < wordLength; i++) {
        const tile = tiles[i];
        const letter = guessLetters[i];
        
        if (currentWord[i] === letter) {
            tile.classList.add('correct');
            tile.textContent = letter;
            correctLetters[i] = true; 
            letterStates[letter] = 'correct'; 
        }
    }
    
    for (let i = 0; i < wordLength; i++) {
        const tile = tiles[i];
        const letter = guessLetters[i];
        
        if (!correctLetters[i] && currentWord.includes(letter)) {
            tile.classList.add('present');
            letterStates[letter] = letterStates[letter] === 'correct' ? 'correct' : 'present'; 
        } else if (!correctLetters[i]) {
            tile.classList.add('absent');
            letterStates[letter] = letterStates[letter] === 'correct' ? 'correct' : 'absent'; 
        }
        
        if (!tile.classList.contains('correct')) {
            tile.textContent = letter;
        }
    }
    
    guesses.push(guessUpper);
    updateKeyboard();
    

    if (guessUpper === currentWord) {
        showModal(winModal);
        return; 
    }
    

    if (guesses.length >= 6) {
        showModal(loseModal);
    }
}

function handleKeyPress(event) {
    const key = event.key.toUpperCase();

    if (key === 'BACKSPACE') {
        currentGuess = currentGuess.slice(0, -1);
        updateDisplay(); 
    } else if (key === 'ENTER') {
        checkGuess(currentGuess);
        currentGuess = ''; 
        updateDisplay(); 
    } else if (key.length === 1 && /[A-Z]/.test(key)) {
        if (currentGuess.length < parseInt(wordLengthSelect.value)) {
            currentGuess += key;
            updateDisplay();
        }
    }
}

function handleKeyboardClick(event) {
    const key = event.target.textContent;
    
    if (key === '⌫') {
        currentGuess = currentGuess.slice(0, -1);
        updateDisplay(); 
    } else if (key === 'Enter') {
        checkGuess(currentGuess);
        currentGuess = ''; 
        updateDisplay(); 
    } else if (key.length === 1 && /[A-Z]/.test(key)) {
        if (currentGuess.length < parseInt(wordLengthSelect.value)) {
            currentGuess += key;
            updateDisplay();
        }
    }
}

function updateDisplay() {
    const currentRow = document.querySelectorAll('.row')[guesses.length];
    const tiles = currentRow.querySelectorAll('.tile');
    
    for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        
        if (i < currentGuess.length) {
            tile.textContent = currentGuess[i];
        } else {
            tile.textContent = '';
        }
    }
}

function updateKeyboard() {
    const keys = keyboard.querySelectorAll('.key');
    keys.forEach(key => {
        const keyValue = key.textContent;
        if (letterStates[keyValue]) {
            key.classList.remove('correct', 'present', 'absent'); 
            key.classList.add(letterStates[keyValue]);
            console.log(letterStates[keyValue]);
        }
    });
}

function resetKeyboard() {
    const keys = keyboard.querySelectorAll('.key');
    keys.forEach(key => {
        key.classList.remove('correct', 'present', 'absent');
    });
}

function showModal(modal) {
    modal.style.display = 'block';
}

function hideModals() {
    winModal.style.display = 'none';
    loseModal.style.display = 'none';
}




newGameButton.addEventListener('click', startNewGame);
newGameFromWinButton.addEventListener('click', startNewGame);
newGameFromLoseButton.addEventListener('click', startNewGame);


document.addEventListener('keydown', handleKeyPress);
keyboard.addEventListener('click', handleKeyboardClick);


startNewGame();