let currentRow = 0;
let currentTile = 0;
let answer = 'GOOSE'
let gameOver = false;

function addLetter(letter) {
    if (currentTile >= 5) {
        return
    }
    if (letter == 'Delete' || letter == 'Enter') {
        return
    }
    if (gameOver) {
        return
    }
    let rows = document.querySelectorAll('.row')
    let tiles = rows[currentRow].querySelectorAll('.tile')
    tiles[currentTile].textContent = letter
    currentTile++
}

document.querySelectorAll('.key').forEach(function(button) {
    button.addEventListener('click', function() {
        addLetter(button.textContent.trim())
    })
})

function deleteLetter() {
    if (currentTile <= 0) {
        return
    }
    if (gameOver) {
        return
    }
    let rows = document.querySelectorAll('.row')
    let tiles = rows[currentRow].querySelectorAll('.tile')
    currentTile--
    tiles[currentTile].textContent = ''
}

document.querySelector('#del').addEventListener('click', deleteLetter)

async function submitGuess() {
    if (gameOver) {
        return
    }
    document.querySelector('#message').textContent = ''
    if (currentTile < 5 && gameOver == false) {
        document.querySelector('#message').textContent = 'Not enough letters'
        let rows = document.querySelectorAll('.row')
        rows[currentRow].classList.add('shake')
        setTimeout(function() {
            rows[currentRow].classList.remove('shake')
        }, 500)
        return
    }
let letters = []
let rows = document.querySelectorAll('.row')
let tiles = rows[currentRow].querySelectorAll('.tile')
for(let i = 0; i < 5; i++) {
    letters.push(tiles[i].textContent)
}
let guess = letters.join('')
let valid = await isValidWord(guess)
if (!valid) {
    document.querySelector('#message').textContent = 'Not a valid word'
    rows = document.querySelectorAll('.row')
    rows[currentRow].classList.add('shake')
    setTimeout(function() {
        rows[currentRow].classList.remove('shake')
    }, 500)
    return
}
if (guess === answer) {
    checkGuess(guess, tiles)
    document.querySelector('#message').textContent = 'Goos job! 🪿'
    gameOver = true
} else {
    checkGuess(guess, tiles)
    currentRow++
    currentTile = 0
    if (currentRow === 6) {
        document.querySelector('#message').textContent = 'Game over! The answer was GOOSE'
        gameOver = true
    }
}}

document.querySelector('#enter').addEventListener('click', submitGuess)

function checkGuess(guess, tiles) {
    let answerLetters = answer.split('')
    for (let i=0; i < 5; i++) {
        if (guess[i] === answer[i]) {
            tiles[i].style.backgroundColor = '#90EE90'
            getKey(guess[i]).style.backgroundColor = '#90EE90'
            answerLetters[i] = null
        }
    }
    for (let i=0; i < 5; i++) {
        if (guess[i] === answer[i]) {
            continue
        }
        if (answerLetters.includes(guess[i])) {
            answerLetters[answerLetters.indexOf(guess[i])] = null
            tiles[i].style.backgroundColor = '#FFFFC5'
            if (getKey(guess[i]).style.backgroundColor != 'rgb(144, 238, 144)') {
            getKey(guess[i]).style.backgroundColor = '#FFFFC5'
        }
        } else {
            tiles[i].style.backgroundColor = '#D3D3D3'
            if (getKey(guess[i]).style.backgroundColor != 'rgb(144, 238, 144)' && getKey(guess[i]).style.backgroundColor != 'rgb(255, 255, 197)') {
            getKey(guess[i]).style.backgroundColor = '#D3D3D3'
        }
    }
}}

function getKey(letter) {
    let keys = document.querySelectorAll('.key')
    for (let i = 0; i<keys.length; i++) {
        if (keys[i].textContent.trim()==letter) {
            return keys[i]
        }
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        submitGuess()
    } else if (event.key === 'Backspace') {
        deleteLetter()
    } else if (/^[a-zA-Z]$/.test(event.key)) {
        addLetter(event.key.toUpperCase())
    }
})

async function isValidWord(word) {
    let response = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + word)
    if (response.ok) {
        return true
    } else {
        return false
    }
}