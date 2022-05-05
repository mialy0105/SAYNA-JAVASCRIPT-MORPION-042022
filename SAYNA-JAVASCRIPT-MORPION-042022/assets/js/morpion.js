const GAMES = {
    cpu: "X",
    you: "O",
    playerScore: 0,
    cpuScore: 0,
    mode: 0,
    reset: false,
    result: "",
    moveCounter: 0,
    firstStart: true,
    playagain: false,
    board: [0, 1, 2, 3, 4, 5, 6, 7, 8]
};

let turn = GAMES.firstStart; // true = you; false=cpu

const color = {
        cpu: "",
        player: ""
    }
    // Récupération des cases à clicker
const items = document.getElementsByClassName('grid-item');

document.addEventListener('load', initGame());

// Affiche ou Cahche l'overlay
function toggleOverlay() {
    document.querySelector("#overlay").classList.toggle("d-none")
};

function toggleLayer() {
    document.querySelector(".layer").classList.toggle("d-none");
};

function toggleLayer2() {
    document.querySelector(".layer2").classList.toggle("d-none");
};

function toggleLayer3() {
    document.querySelector(".layer3").classList.toggle("d-none");
}

function initGame() {
    toggleOverlay();
    toggleLayer3();
}




let btninverse = document.getElementsByClassName('btninverse');

console.log('btninverse');

for ( let i=0; i<btninverse.length; i++){
    btninverse[i].addEventListener('mouseover',()=> {
        btninverse[i].style.backgroundColor ='#b11313';
        btninverse[i].style.color ='white';
        btninverse[i].style.fontWeinght ='bold'; // text avec des traits plus épais
        btninverse[i].style.boxShadow ='5px 5px 30px white';
    })

    btninverse[i].addEventListener('mouseout',()=> {
        btninverse[i].style.backgroundColor ='white';
        btninverse[i].style.color ='#b11313';
        btninverse[i].style.boxShadow ='none'; //pour que l'effet disparaisse apres

    })
    }

/* Mode de Jeux du cpu
 * 0 EASY: niveau facile
 * 1 MEDIUM: niveau intermediaire
 * 2 HARD: niveau difficil
 */
function setLevel(id) {
    GAMES.mode = parseInt(id[5])
    toggleLayer();
    toggleLayer3();
}


function choosePawn(id) {
    if (id == "idX") {
        GAMES.player = "X";
        GAMES.cpu = "O"
        color.cpu = "color1"
        color.player = "color2"
    } else {
        GAMES.player = "O";
        GAMES.cpu = "X"
        color.cpu = "color2"
        color.player = "color1"
    }
    toggleLayer()
    toggleOverlay()
    if (GAMES.playagain) {
        playAgain();
    }
}





// pour marquer un cage
function markSquare(id, player) {
    let square = document.querySelector("#" + id)
    if (player == GAMES.cpu) {
        square.textContent = player;
        square.classList.add(color.cpu)
    } else {
        square.textContent = player;
        square.classList.add(color.player)
    }
}

// pour faire une mise a jour
function updateBoard(id, player) {
    let index = parseInt(id[4]) - 1;
    GAMES.board[index] = player;
}


// verification s'il y a un gagnant
function boardSatus(board, player) {
    let result = {
            isWinner: false,
            who: player
        },
        LINE = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8]
        ],
        COL = [
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8]
        ],
        DIAG = [
            [0, 4, 8],
            [2, 4, 6]
        ],
        i = 0,
        winPattern = player.repeat(3),
        now = "";
   
    // Verification sur les colones
    for (i = 0; i < COL.length; i++) {
        now = board[COL[i][0]] + board[COL[i][1]] + board[COL[i][2]];
        if (now === winPattern) {
            result.isWinner = true;
            return result;
        }
    }



   // Verification sur  les lignes
    for (i = 0; i < LINE.length; i++) {
        now = board[LINE[i][0]] + board[LINE[i][1]] + board[LINE[i][2]];
        if (now === winPattern) {
            result.isWinner = true;
            return result;
        }
    }



    // verification sur les diagonales
    for (i = 0; i < DIAG.length; i++) {
        now = board[DIAG[i][0]] + board[DIAG[i][1]] + board[DIAG[i][2]];
        if (now === winPattern) {
            result.isWinner = true;
            return result;
        }
    }
    return result;
}

// Alterne le marqueur de tour
function switchTurn() {
    document.querySelector(".cpu-turn").classList.toggle("turn");
    document.querySelector(".player-turn").classList.toggle("turn");
}

// Le cpu joue
function cpuMove() {
    /* Algorithme Minimax  pour trouver 
     * le meilleur emplacemnt pour le pion du cpu 
     * Plus d'info : https://fr.m.wikipedia.org/wiki/Algorithme_minimax
     */
    function miniMax(board, depth, player) {
        let emptyIndex = getEmptySquares();
        if (boardSatus(board, GAMES.player).isWinner) {
            return { score: -100 + depth };
        } else if (boardSatus(board, GAMES.cpu).isWinner) {
            return { score: 100 + depth };
        } else if (emptyIndex.length === 0) {
            return { score: 0 };
        }
        let moves = [];
        for (var i = 0; i < emptyIndex.length; i++) {
            var move = {};
            move.index = board[emptyIndex[i]];
            board[emptyIndex[i]] = player;
            if (player == GAMES.cpu) {
                let result = miniMax(board, depth + 1, GAMES.player);
                move.score = result.score;
            } else {
                let result = miniMax(board, depth + 1, GAMES.cpu);
                move.score = result.score;
            }
            board[emptyIndex[i]] = move.index;
            moves.push(move);
        }

        let bestMove;
        if (player === GAMES.cpu) {
            var bestScore = -10000;
            for (var i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 10000;
            for (var i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];
    }


    function randomMove() {
        let emptyIndex = getEmptySquares(),
            index = Math.floor(Math.random() * emptyIndex.length);
        return emptyIndex[index];
    }

    function getCpuMove() {
        switch (GAMES.mode) {
            case 0:
                return randomMove();
            case 1:
                if (Math.round(Math.random()) == 0) {
                    return randomMove();
                } else {
                    return miniMax(GAMES.board, 0, GAMES.cpu).index;
                }
            case 2:
                return miniMax(GAMES.board, 0, GAMES.cpu).index
            default:
                break;
        }
    }

    let move = getCpuMove();
    let id = "item" + (move + 1);
    markSquare(id, GAMES.cpu);
    updateBoard(id, GAMES.cpu);
    if (boardSatus(GAMES.board, GAMES.cpu).isWinner) {
        GAMES.cpuScore++;
        GAMES.result = GAMES.cpu;
        setTimeout(showResult, 1200);
    } else {
        GAMES.result = "draw";
        if (getEmptySquares().length == 0) {
            setTimeout(showResult, 1200);
        } else {
            setTimeout(switchTurn, 500);
            turn = true;
        }
    }
}

// Verifie si la case cliqué est vide
function isEmpty(id) {
    let index = parseInt(id[4]) - 1;
    return (typeof GAMES.board[index] === "number") ? true : false;
}

/* Marque la case choisie par l'utilisateur s'il est vide
 * et alterne le tour.
 */
function choiseCase(id) {
    if (isEmpty(id)) {
        if (turn) {
            markSquare(id, GAMES.player);
            updateBoard(id, GAMES.player);
            turn = false;
            if (boardSatus(GAMES.board, GAMES.player).isWinner) {
                GAMES.playerScore++;
                GAMES.result = GAMES.player;
                setTimeout(showResult, 1200)
            } else {
                if (getEmptySquares().length == 0) {
                    GAMES.result = "draw"
                    setTimeout(showResult, 1200);
                } else {
                    switchTurn();
                    setTimeout(cpuMove, 500);
                }
            }
        }
    }
}

// Lister les emplacement vide
function getEmptySquares() {
    return GAMES.board.filter(item => typeof item === "number")
}

// Mise à jour du leaderboard
function updateScore(result) {
    switch (result) {
        case GAMES.player:
            document.querySelector(".you-score").textContent = GAMES.playerScore;
            break;
        case GAMES.cpu:
            document.querySelector(".cpu-score").textContent = GAMES.cpuScore;
            break;
        default:
            break;
    }
}

// Affichage du resultat
function showResult() {
    toggleOverlay();
    let text = "";
    updateScore(GAMES.result);
    if (GAMES.result == GAMES.player) {
        text = '<div id="result" class="text-success pt-3 pb-2"> Win <br> Score +1</div>';
    } else {
        if (GAMES.result == GAMES.cpu) {
            text = '<div id="result" class="text-danger py-3 pb-2"> Defeat <br> CPU Score +1</div>';
        } else {
            if (GAMES.result == "draw") {
                text = '<div id="result" class="draw py-3">DRAW</div>';
            }
        }
    }
    document.querySelector("#result").outerHTML = text;
    toggleLayer2()
}


// Réjoué une partie
function playAgain() {
    GAMES.reset ? {} : turn = !(GAMES.firstStart);
    GAMES.firstStart = turn;
    if (turn) {
        if (document.querySelector(".cpu-turn").classList.contains("turn")) {
            document.querySelector(".cpu-turn").classList.toggle("turn");
            document.querySelector(".player-turn").classList.toggle("turn");
        }

    } else {
        if (document.querySelector(".player-turn").classList.contains("turn")) {
            document.querySelector(".player-turn").classList.toggle("turn");
            document.querySelector(".cpu-turn").classList.toggle("turn");
        }
        setTimeout(cpuMove, 800)
    }

}

// Nouvelle partie;
function again() {
    reset();
    GAMES.playagain = true;
    toggleLayer2();
    toggleLayer();
}

// Vide le contenu de toute les cases
function reset() {
    for (var i = 0; i < items.length; i++) {
        items[i].textContent = '';
        items[i].classList.contains("color1") ? items[i].classList.remove("color1") : {};
        items[i].classList.contains("color2") ? items[i].classList.remove("color2") : {};
    }
    GAMES.board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
}

// Réinitialise le jeux
function resetGame() {
    reset();
    GAMES.cpuScore = 0;
    GAMES.reset = true;
    GAMES.playerScore = 0;
    GAMES.firstStart = true;
    turn = GAMES.firstStart;
    updateScore(GAMES.cpu);
    updateScore(GAMES.player);
    document.querySelector(".layer").classList ? {} : toggleLayer();
    document.querySelector(".layer2").classList ? {} : toggleLayer2();
    toggleOverlay();
    toggleLayer3();
}