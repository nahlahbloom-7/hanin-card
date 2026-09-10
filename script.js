/* =========================================
   ELEMENTS
========================================= */

const board =
    document.getElementById("board");


const intro =
    document.getElementById("intro");


const chessSection =
    document.getElementById("chessSection");


const gameStatus =
    document.getElementById("gameStatus");


const checkmate =
    document.getElementById("checkmate");


const continueButton =
    document.getElementById("continueButton");


const greeting =
    document.getElementById("greeting");


/* =========================================
   FUTURE MESSAGE ELEMENTS
========================================= */

const futureTrigger =
    document.getElementById("futureTrigger");


const futureSection =
    document.getElementById("futureSection");


const futureIntro =
    document.getElementById("futureIntro");


const futureMessage =
    document.getElementById("futureMessage");


const futureSave =
    document.getElementById("futureSave");


const futureLetter =
    document.getElementById("futureLetter");


const futureUserMessage =
    document.getElementById("futureUserMessage");


/* =========================================
   MEMORY ELEMENTS
========================================= */

const futureMemory =
    document.getElementById("futureMemory");


const memoryButton =
    document.getElementById("memoryButton");


const memoryView =
    document.getElementById("memoryView");


const memoryOldMessage =
    document.getElementById("memoryOldMessage");


const memoryClose =
    document.getElementById("memoryClose");


/* =========================================
   LOCAL STORAGE KEY
========================================= */

const FUTURE_MESSAGE_KEY =
    "haneenFutureMessage";


/* =========================================
   CHESS POSITION
========================================= */

/*
    الوضعية مطابقة للصورة:

    الأسود:
    King → h6

    الأبيض:
    Queen → e4
    King  → e1
    Rook  → g1
*/

const position = {

    /* BLACK */
    h6: "♚",

    /* WHITE */
    e4: "♕",
    e1: "♔",
    g1: "♖"
};


/* =========================================
   IMPORTANT MOVE
========================================= */

/*
    النقلة الصحيحة للوزير من e4 إلى h4
*/

const correctMove = {

    from: "e4",

    to: "h4"
};


/* =========================================
   STATE
========================================= */

let selectedSquare = null;

let gameFinished = false;


/* =========================================
   BOARD COORDINATES
========================================= */

const files = [

    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h"

];


/* =========================================
   CREATE BOARD
========================================= */

function createBoard() {

    board.innerHTML = "";


    /*
        Chess boards start from rank 8.
    */

    for (
        let rank = 8;
        rank >= 1;
        rank--
    ) {

        for (
            let fileIndex = 0;
            fileIndex < 8;
            fileIndex++
        ) {

            const file =
                files[fileIndex];


            const squareName =
                file + rank;


            /*
                Create square.
            */

            const square =
                document.createElement("div");


            square.classList.add(
                "square"
            );


            /*
                Chess color.
            */

            const light =
                (fileIndex + rank) % 2 === 1;


            square.classList.add(

                light
                    ? "light"
                    : "dark"

            );


            square.dataset.square =
                squareName;


            /*
                Add piece if exists.
            */

            if (
                position[squareName]
            ) {

                createPiece(

                    square,

                    position[squareName]

                );

            }


            /*
                Click interaction.
            */

            square.addEventListener(

                "click",

                () => {

                    handleSquareClick(
                        squareName
                    );

                }

            );


            board.appendChild(
                square
            );
        }
    }
}


/* =========================================
   CREATE PIECE
========================================= */

function createPiece(
    square,
    symbol
) {

    const piece =
        document.createElement("div");


    piece.classList.add(
        "piece"
    );


    /*
        Unicode ranges:

        White:
        ♔ ♕ ♖ ♗ ♘ ♙

        Black:
        ♚ ♛ ♜ ♝ ♞ ♟
    */

    const whitePieces = [

        "♔",
        "♕",
        "♖",
        "♗",
        "♘",
        "♙"

    ];


    if (
        whitePieces.includes(
            symbol
        )
    ) {

        piece.classList.add(
            "white-piece"
        );

    } else {

        piece.classList.add(
            "black-piece"
        );

    }


    piece.textContent =
        symbol;


    piece.dataset.piece =
        symbol;


    square.appendChild(
        piece
    );
}


/* =========================================
   GET SQUARE
========================================= */

function getSquare(
    squareName
) {

    return document.querySelector(

        `[data-square="${squareName}"]`

    );
}


/* =========================================
   CLEAR HIGHLIGHTS
========================================= */

function clearHighlights() {

    document
        .querySelectorAll(".square")
        .forEach(square => {

            square.classList.remove(

                "legal",
                "capture",
                "selected"

            );

        });


    document
        .querySelectorAll(".piece")
        .forEach(piece => {

            piece.classList.remove(

                "selected-piece"

            );

        });
}


/* =========================================
   QUEEN LEGAL MOVES
========================================= */

function getQueenMoves(
    file,
    rank
) {

    const fileIndex =
        files.indexOf(file);


    const moves = [];


    /*
        Horizontal →
    */

    for (
        let i = fileIndex + 1;
        i < 8;
        i++
    ) {

        moves.push(
            files[i] + rank
        );

    }


    /*
        Horizontal ←
    */

    for (
        let i = fileIndex - 1;
        i >= 0;
        i--
    ) {

        moves.push(
            files[i] + rank
        );

    }


    /*
        Vertical ↑
    */

    for (
        let r = rank + 1;
        r <= 8;
        r++
    ) {

        moves.push(
            file + r
        );

    }


    /*
        Vertical ↓
    */

    for (
        let r = rank - 1;
        r >= 1;
        r--
    ) {

        moves.push(
            file + r
        );

    }


    /*
        Diagonal ↗
    */

    let f =
        fileIndex + 1;


    let r =
        rank + 1;


    while (
        f < 8 &&
        r <= 8
    ) {

        moves.push(
            files[f] + r
        );

        f++;
        r++;

    }


    /*
        Diagonal ↖
    */

    f =
        fileIndex - 1;


    r =
        rank + 1;


    while (
        f >= 0 &&
        r <= 8
    ) {

        moves.push(
            files[f] + r
        );

        f--;
        r++;

    }


    /*
        Diagonal ↘
    */

    f =
        fileIndex + 1;


    r =
        rank - 1;


    while (
        f < 8 &&
        r >= 1
    ) {

        moves.push(
            files[f] + r
        );

        f++;
        r--;

    }


    /*
        Diagonal ↙
    */

    f =
        fileIndex - 1;


    r =
        rank - 1;


    while (
        f >= 0 &&
        r >= 1
    ) {

        moves.push(
            files[f] + r
        );

        f--;
        r--;

    }


    return moves;
}


/* =========================================
   SHOW QUEEN MOVES
========================================= */

function showQueenMoves() {

    clearHighlights();


    selectedSquare =
        correctMove.from;


    const queenSquare =
        getSquare(
            correctMove.from
        );


    queenSquare.classList.add(
        "selected"
    );


    const queen =
        queenSquare.querySelector(
            ".piece"
        );


    if (queen) {

        queen.classList.add(
            "selected-piece"
        );

    }


    /*
        Calculate Queen moves.
    */

    const allMoves =
        getQueenMoves(
            "e",
            4
        );


    /*
        We only show visually valid
        destinations for this position.
    */

    const legalMoves =
        filterLegalMoves(
            "e4",
            allMoves
        );


    legalMoves.forEach(
        squareName => {

            const square =
                getSquare(
                    squareName
                );


            if (!square) {
                return;
            }


            if (
                square.querySelector(
                    ".piece"
                )
            ) {

                square.classList.add(
                    "capture"
                );

            } else {

                square.classList.add(
                    "legal"
                );

            }

        }
    );


    gameStatus.textContent =
        "اختاري المكان الذي تبيه الوزير يوصل له.";
}


/* =========================================
   FILTER QUEEN MOVES
========================================= */

function filterLegalMoves(
    from,
    moves
) {

    /*
        مسارات الحركة المتاحة
        للوزير من e4 في هذه الوضعية
    */

    return [

        "e5",
        "e6",
        "e7",
        "e8",

        "e3",
        "e2",

        "f4",
        "g4",
        "h4",

        "d4",
        "c4",
        "b4",
        "a4",

        "f5",
        "g6",
        "h7",

        "d5",
        "c6",
        "b7",
        "a8",

        "f3",
        "g2",

        "d3",
        "c2",
        "b1"

    ];
}


/* =========================================
   CLICK HANDLER
========================================= */

function handleSquareClick(
    squareName
) {

    if (gameFinished) {

        return;
    }


    /*
        No selection yet.
    */

    if (
        selectedSquare === null
    ) {

        if (
            squareName ===
            correctMove.from
        ) {

            showQueenMoves();

        } else {

            gentleStatus(
                "اضغطي على الوزير."
            );

        }

        return;
    }


    /*
        Clicking Queen again.
    */

    if (
        squareName ===
        correctMove.from
    ) {

        showQueenMoves();

        return;
    }


    /*
        Correct move.
    */

    if (

        selectedSquare ===
        correctMove.from &&

        squareName ===
        correctMove.to

    ) {

        performWinningMove();

        return;
    }


    /*
        Wrong legal square.
    */

    const clickedSquare =
        getSquare(
            squareName
        );


    if (

        clickedSquare &&

        (
            clickedSquare.classList.contains(
                "legal"
            ) ||

            clickedSquare.classList.contains(
                "capture"
            )
        )

    ) {

        gentleWrongMove(
            clickedSquare
        );

        return;
    }
}


/* =========================================
   WRONG MOVE FEEDBACK
========================================= */

function gentleWrongMove(
    square
) {

    square.animate(

        [

            {
                transform:
                    "scale(1)"
            },

            {
                transform:
                    "scale(.94)"
            },

            {
                transform:
                    "scale(1)"
            }

        ],

        {

            duration: 230,

            easing:
                "ease-out"

        }

    );


    gameStatus.textContent =
        "مش هذه النقلة.";


    setTimeout(() => {

        if (!gameFinished) {

            gameStatus.textContent =
                "جرّبي نقلة ثانية.";

        }

    }, 900);
}


/* =========================================
   GENERAL STATUS
========================================= */

function gentleStatus(
    message
) {

    gameStatus.animate(

        [

            {
                opacity: 1
            },

            {
                opacity: 0.35
            },

            {
                opacity: 1
            }

        ],

        {

            duration: 280

        }

    );


    gameStatus.textContent =
        message;
}


/* =========================================
   WINNING MOVE
========================================= */

function performWinningMove() {

    gameFinished = true;


    clearHighlights();


    const fromSquare =
        getSquare(
            correctMove.from
        );


    const targetSquare =
        getSquare(
            correctMove.to
        );


    const queen =
        fromSquare.querySelector(
            ".piece"
        );


    const enemyPiece =
        targetSquare.querySelector(
            ".piece"
        );


    /*
        Capture animation.
    */

    if (enemyPiece) {

        enemyPiece.classList.add(
            "captured"
        );

    }


    /*
        Slight pause before
        moving the Queen.
    */

    setTimeout(() => {

        if (queen) {

            targetSquare.appendChild(
                queen
            );


            queen.classList.remove(
                "selected-piece"
            );


            queen.style.transform =
                "translateY(-2px) scale(1.02)";

        }

    }, 130);


    /*
        Update visual state.
    */

    setTimeout(() => {

        gameStatus.textContent =
            "";

        intro.classList.add(
            "hidden"
        );

    }, 300);


    /*
        Show Checkmate.
    */

    setTimeout(() => {

        checkmate.classList.add(
            "show"
        );

    }, 760);


    /*
        Chess becomes
        subtle background.
    */

    setTimeout(() => {

        chessSection.classList.add(
            "background-mode"
        );

    }, 1250);
}


/* =========================================
   CONTINUE TO GREETING
========================================= */

continueButton.addEventListener(
    "click",
    () => {

        checkmate.classList.remove(
            "show"
        );


        setTimeout(() => {

            greeting.classList.add(
                "show"
            );

        }, 300);

    }
);


/* =========================================
   OPEN FUTURE MESSAGE
========================================= */

futureTrigger.addEventListener(
    "click",
    () => {

        greeting.classList.remove(
            "show"
        );


        setTimeout(() => {

            futureSection.classList.add(
                "show"
            );


            /*
                تظهر الذاكرة فقط هنا،
                وليس عند بداية البطاقة.
            */

            checkForSavedMemory();


            setTimeout(() => {

                futureMessage.focus();

            }, 500);

        }, 400);

    }
);


/* =========================================
   CHECK SAVED MEMORY
========================================= */

function checkForSavedMemory() {

    const savedMessage =
        localStorage.getItem(
            FUTURE_MESSAGE_KEY
        );


    /*
        لا توجد رسالة محفوظة.
        نخفي الذاكرة بالكامل.
    */

    if (!savedMessage) {

        futureMemory.classList.remove(
            "show"
        );

        return;
    }


    /*
        توجد رسالة محفوظة.
        تظهر فقط في مرحلة المستقبل.
    */

    futureMemory.classList.add(
        "show"
    );
}


/* =========================================
   SAVE FUTURE MESSAGE
========================================= */

function saveFutureMessage() {

    const message =
        futureMessage.value.trim();


    /*
        لا نسمح بحفظ رسالة فارغة.
    */

    if (!message) {

        futureMessage.animate(

            [

                {
                    transform:
                        "translateX(0)"
                },

                {
                    transform:
                        "translateX(-4px)"
                },

                {
                    transform:
                        "translateX(4px)"
                },

                {
                    transform:
                        "translateX(0)"
                }

            ],

            {

                duration: 250

            }

        );

        return;
    }


    /*
        حفظ الرسالة في الجهاز.
    */

    localStorage.setItem(

        FUTURE_MESSAGE_KEY,

        message

    );


    /*
        عرض الرسالة.
    */

    futureUserMessage.textContent =
        message;


    /*
        إخفاء شاشة الكتابة.
    */

    futureIntro.classList.add(
        "hidden"
    );


    /*
        إظهار شاشة المستقبل.
    */

    setTimeout(() => {

        futureLetter.classList.add(
            "show"
        );

    }, 450);
}


/* =========================================
   SAVE BUTTON
========================================= */

futureSave.addEventListener(
    "click",
    saveFutureMessage
);


/* =========================================
   CTRL / CMD + ENTER
========================================= */

futureMessage.addEventListener(
    "keydown",
    event => {

        if (

            event.key === "Enter" &&

            (event.ctrlKey || event.metaKey)

        ) {

            event.preventDefault();

            saveFutureMessage();

        }

    }
);


/* =========================================
   SHOW OLD MESSAGE
========================================= */

memoryButton.addEventListener(
    "click",
    () => {

        const savedMessage =
            localStorage.getItem(
                FUTURE_MESSAGE_KEY
            );


        if (!savedMessage) {

            return;
        }


        memoryOldMessage.textContent =
            savedMessage;


        memoryView.classList.add(
            "show"
        );

    }
);


/* =========================================
   CLOSE OLD MESSAGE
========================================= */

memoryClose.addEventListener(
    "click",
    () => {

        memoryView.classList.remove(
            "show"
        );

    }
);


/* =========================================
   START
========================================= */

createBoard();
