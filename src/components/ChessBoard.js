import React, { useState } from 'react';
import './ChessBoard.css'; // Подключаем стили

// Импортируем изображения фигур
import whitePawn from '../img/wP.png';
import blackPawn from '../img/bP.png';
import whiteRook from '../img/wR.png';
import blackRook from '../img/bR.png';
import whiteKnight from '../img/wN.png';
import blackKnight from '../img/bN.png';
import whiteBishop from '../img/wB.png';
import blackBishop from '../img/bB.png';
import whiteQueen from '../img/wQ.png';
import blackQueen from '../img/bQ.png';
import whiteKing from '../img/wK.png';
import blackKing from '../img/bK.png';

const ChessBoard = () => {
    // Инициализация состояния доски
    const initialBoard = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['.', '.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.', '.'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ];

    const [board, setBoard] = useState(initialBoard);
    const [selectedPiece, setSelectedPiece] = useState(null); // Выбранная фигура
    const [availableMoves, setAvailableMoves] = useState([]); // Доступные ходы
    const [lastMove, setLastMove] = useState(null); // { from: [row, col], to: [row, col], piece: 'P' }
    const [promotion, setPromotion] = useState(null); // { row, col, color }
    const [castlingRights, setCastlingRights] = useState({
        whiteKingMoved: false,
        blackKingMoved: false,
        whiteRookLeftMoved: false,
        whiteRookRightMoved: false,
        blackRookLeftMoved: false,
        blackRookRightMoved: false,
    });


    // Функция для обработки клика по клетке
    const handleSquareClick = (row, col) => {
        const piece = board[row][col];

        if (selectedPiece) {
            const isMoveValid = availableMoves.some(
                ([moveRow, moveCol]) => moveRow === row && moveCol === col
            );

            if (isMoveValid) {
                const newBoard = board.map((boardRow) => [...boardRow]);

                // Проверяем взятие на проходе
                if (
                    selectedPiece.piece.toLowerCase() === 'p' &&
                    lastMove &&
                    lastMove.piece.toLowerCase() === 'p' &&
                    Math.abs(lastMove.from[0] - lastMove.to[0]) === 2 &&
                    lastMove.to[0] === row - (selectedPiece.piece === 'P' ? -1 : 1) &&
                    lastMove.to[1] === col
                ) {
                    newBoard[lastMove.to[0]][lastMove.to[1]] = '.'; // Убираем взятую пешку
                }

                // Перемещаем выбранную фигуру
                newBoard[row][col] = selectedPiece.piece;
                newBoard[selectedPiece.row][selectedPiece.col] = '.';

                //Проверка превращения
                if ((selectedPiece.piece === 'P' && row === 0) || (selectedPiece.piece === 'p' && row === 7)) {
                    setPromotion({ row, col, color: piece === 'P' ? 'white' : 'black' });
                }

                if (selectedPiece.piece.toLowerCase() === 'k' && Math.abs(col - selectedPiece.col) === 2) {
                    const isWhite = selectedPiece.piece === 'K';
                    const row = isWhite ? 7 : 0;

                    if (col === 6) {
                        // Король перемещается на G1/G8, ладья на F1/F8
                        newBoard[row][5] = newBoard[row][7];
                        newBoard[row][7] = '.';
                    } else if (col === 2) {
                        // Король перемещается на C1/C8, ладья на D1/D8
                        newBoard[row][3] = newBoard[row][0];
                        newBoard[row][0] = '.';
                    }

                    setCastlingRights((prev) => ({
                        ...prev,
                        [isWhite ? 'whiteKingMoved' : 'blackKingMoved']: true,
                        [isWhite ? (col === 6 ? 'whiteRookRightMoved' : 'whiteRookLeftMoved') : (col === 6 ? 'blackRookRightMoved' : 'blackRookLeftMoved')]: true,
                    }));
                }

                setBoard(newBoard);

                // Сохраняем последний ход
                setLastMove({
                    from: [selectedPiece.row, selectedPiece.col],
                    to: [row, col],
                    piece: selectedPiece.piece,
                });

                if (selectedPiece.piece.toLowerCase() === 'k') {
                    setCastlingRights((prev) => ({
                        ...prev,
                        [selectedPiece.piece === 'K' ? 'whiteKingMoved' : 'blackKingMoved']: true,
                    }));
                }

                if (selectedPiece.piece.toLowerCase() === 'r') {
                    if (selectedPiece.row === 7 && selectedPiece.col === 0) {
                        setCastlingRights((prev) => ({ ...prev, whiteRookLeftMoved: true }));
                    }
                    if (selectedPiece.row === 7 && selectedPiece.col === 7) {
                        setCastlingRights((prev) => ({ ...prev, whiteRookRightMoved: true }));
                    }
                    if (selectedPiece.row === 0 && selectedPiece.col === 0) {
                        setCastlingRights((prev) => ({ ...prev, blackRookLeftMoved: true }));
                    }
                    if (selectedPiece.row === 0 && selectedPiece.col === 7) {
                        setCastlingRights((prev) => ({ ...prev, blackRookRightMoved: true }));
                    }
                }


                setSelectedPiece(null);
                setAvailableMoves([]);
            } else {
                setSelectedPiece(null);
                setAvailableMoves([]);
            }
        } else if (piece.toLowerCase() === 'p') {
            setSelectedPiece({ piece, row, col });
            setAvailableMoves(getPawnMoves(row, col, piece));
        } else if (piece.toLowerCase() === 'r') {
            setSelectedPiece({ piece, row, col });
            setAvailableMoves(getRookMoves(row, col, piece));
        } else if (piece.toLowerCase() === 'k') {

            const rawMoves = getKingMoves(row, col, piece);
            const color = piece === piece.toUpperCase() ? 'white' : 'black';
            const attackedSquares = getAttackedSquares(board, color);

            const moves = rawMoves.filter(
                ([moveRow, moveCol]) =>
                    !attackedSquares.some(([attackedRow, attackedCol]) => moveRow === attackedRow && moveCol === attackedCol)
            );

            // Проверка рокировки
            if (canCastle(piece === 'K' ? 'white' : 'black', 'kingside')) {
                moves.push([row, 6]); // Король перемещается на G1 или G8
            }
            if (canCastle(piece === 'K' ? 'white' : 'black', 'queenside')) {
                moves.push([row, 2]); // Король перемещается на C1 или C8
            }

            setSelectedPiece({ piece, row, col });
            setAvailableMoves(moves);
        } else if (piece.toLowerCase() === 'q') {
            setSelectedPiece({ piece, row, col });
            setAvailableMoves(getQueenMoves(row, col, piece));
        } else if (piece.toLowerCase() === 'b') {
            setSelectedPiece({ piece, row, col });
            setAvailableMoves(getBishopMoves(row, col, piece));
        } else if (piece.toLowerCase() === 'n') {
            setSelectedPiece({ piece, row, col });
            setAvailableMoves(getKnightMoves(row, col, piece));
        }
    };

    //Выбор фигуры при проходе пешки
    const handlePromotion = (type) => {
        const newBoard = board.map((row) => [...row]);
        newBoard[promotion.row][promotion.col] = promotion.color === 'white' ? type : type.toLowerCase();
        setBoard(newBoard);
        setPromotion(null); // Скрыть модальное окно
    };

    const canCastle = (color, side) => {
        const isWhite = color === 'white';

        // Проверяем, двигались ли король и соответствующая ладья
        const kingMoved = isWhite ? castlingRights.whiteKingMoved : castlingRights.blackKingMoved;
        const rookMoved = isWhite
            ? side === 'kingside'
                ? castlingRights.whiteRookRightMoved
                : castlingRights.whiteRookLeftMoved
            : side === 'kingside'
                ? castlingRights.blackRookRightMoved
                : castlingRights.blackRookLeftMoved;

        if (kingMoved || rookMoved) return false;

        const row = isWhite ? 7 : 0;
        const rookCol = side === 'kingside' ? 7 : 0;

        // Проверяем, находится ли ладья на соответствующей клетке
        const rook = board[row][rookCol];
        if (rook !== (isWhite ? 'R' : 'r')) return false;

        // Проверяем, чтобы клетки между королём и ладьёй были пустыми
        const emptyCols = side === 'kingside' ? [5, 6] : [1, 2, 3];
        for (const col of emptyCols) {
            if (board[row][col] !== '.') return false;
        }

        // Проверяем, чтобы клетки пути короля не были под атакой
        const kingPath = side === 'kingside'
            ? [[row, 4], [row, 5], [row, 6]]  // e1 → f1 → g1 или e8 → f8 → g8
            : [[row, 4], [row, 3], [row, 2]]; // e1 → d1 → c1 или e8 → d8 → c8

        const attackedSquares = getAttackedSquares(board, color);
        // const opponentColor = isWhite ? 'black' : 'white';
        // const attackedSquares = getAttackedSquares(board, opponentColor);

        for (const [r, c] of kingPath) {
            if (attackedSquares.some(([ar, ac]) => ar === r && ac === c)) return false;
        }
        return true;
    };

    const getAttackedSquares = (board, color) => {
        const attackedSquares = [];

        const opponentPieces = color === 'white' ? ['p', 'r', 'n', 'b', 'q', 'k'] : ['P', 'R', 'N', 'B', 'Q', 'K'];

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];

                if (opponentPieces.includes(piece)) {
                    let moves = [];

                    if (piece.toLowerCase() === 'p') {
                        moves = getPawnAttackSquares(row, col, piece);
                    } else if (piece.toLowerCase() === 'r') {
                        moves = getRookMoves(row, col, piece);
                    } else if (piece.toLowerCase() === 'n') {
                        moves = getKnightMoves(row, col, piece);
                    } else if (piece.toLowerCase() === 'b') {
                        moves = getBishopMoves(row, col, piece);
                    } else if (piece.toLowerCase() === 'q') {
                        moves = getQueenMoves(row, col, piece);
                    } else if (piece.toLowerCase() === 'k') {
                        moves = getKingMoves(row, col, piece);
                    }

                    attackedSquares.push(...moves);
                }
            }
        }

        return attackedSquares;
    };

    const getPawnAttackSquares = (row, col, piece) => {
        const moves = [];
        const direction = piece === 'P' ? -1 : 1; // Белая пешка идёт вверх, чёрная вниз

        const attackLeft = [row + direction, col - 1];
        const attackRight = [row + direction, col + 1];

        if (attackLeft[0] >= 0 && attackLeft[0] < 8 && attackLeft[1] >= 0 && attackLeft[1] < 8) {
            moves.push(attackLeft);
        }
        if (attackRight[0] >= 0 && attackRight[0] < 8 && attackRight[1] >= 0 && attackRight[1] < 8) {
            moves.push(attackRight);
        }

        return moves;
    };

    // Функция для получения изображения фигуры
    const getPieceImage = (piece) => {
        switch (piece) {
            case 'P': return whitePawn;
            case 'p': return blackPawn;
            case 'R': return whiteRook;
            case 'r': return blackRook;
            case 'N': return whiteKnight;
            case 'n': return blackKnight;
            case 'B': return whiteBishop;
            case 'b': return blackBishop;
            case 'Q': return whiteQueen;
            case 'q': return blackQueen;
            case 'K': return whiteKing;
            case 'k': return blackKing;
            default: return null;
        }
    };

    const getPawnMoves = (row, col, piece) => {
        const moves = [];
        const direction = piece === 'P' ? -1 : 1; // Белые двигаются вверх, чёрные — вниз

        // Ход вперёд
        if (board[row + direction] && board[row + direction][col] === '.') {
            moves.push([row + direction, col]);

            // Ход на две клетки с начальной позиции
            if ((piece === 'P' && row === 6) || (piece === 'p' && row === 1)) {
                if (board[row + 2 * direction] && board[row + 2 * direction][col] === '.') {
                    moves.push([row + 2 * direction, col]);
                }
            }
        }

        // Взятие фигур по диагонали
        [-1, 1].forEach((offset) => {
            const targetCol = col + offset;

            // Обычное взятие
            if (
                board[row + direction] &&
                board[row + direction][targetCol] &&
                board[row + direction][targetCol] !== '.' &&
                (piece === 'P' ? board[row + direction][targetCol] === board[row + direction][targetCol].toLowerCase() :
                    board[row + direction][targetCol] === board[row + direction][targetCol].toUpperCase())
            ) {
                moves.push([row + direction, targetCol]);
            }

            // Взятие на проходе
            if (
                lastMove &&
                lastMove.piece.toLowerCase() === 'p' &&
                Math.abs(lastMove.from[0] - lastMove.to[0]) === 2 && // Пешка двигалась на две клетки
                lastMove.to[0] === row && // Пешка находится на том же ряду
                lastMove.to[1] === targetCol // Пешка находится на соседнем столбце
            ) {
                moves.push([row + direction, targetCol]);
            }
        });

        return moves;
    };

    const getRookMoves = (row, col, piece) => {
        const moves = [];
        const directionVectors = [
            [-1, 0], // вверх
            [1, 0],  // вниз
            [0, -1], // влево
            [0, 1],  // вправо
        ];

        // Проверяем каждое направление
        for (const [dx, dy] of directionVectors) {
            let r = row + dx;
            let c = col + dy;

            while (r >= 0 && r < 8 && c >= 0 && c < 8) {
                const targetSquare = board[r][c];

                if (targetSquare === '.') {
                    moves.push([r, c]); // Клетка пуста, добавляем в доступные ходы
                } else if (
                    (piece === piece.toUpperCase() && targetSquare === targetSquare.toLowerCase()) ||
                    (piece === piece.toLowerCase() && targetSquare === targetSquare.toUpperCase())
                ) {
                    // Вражеская фигура — добавляем клетку и прекращаем поиск в этом направлении
                    moves.push([r, c]);
                    break;
                } else {
                    // Своя фигура — прекращаем поиск в этом направлении
                    break;
                }

                r += dx;
                c += dy;
            }
        }

        return moves;
    };

    const getKingMoves = (row, col, piece) => {
        const moves = [];
        const directions = [
            [-1, 0],  // вверх
            [1, 0],   // вниз
            [0, -1],  // влево
            [0, 1],   // вправо
            [-1, -1], // вверх-влево
            [-1, 1],  // вверх-вправо
            [1, -1],  // вниз-влево
            [1, 1],   // вниз-вправо
        ];

        for (const [dx, dy] of directions) {
            const newRow = row + dx;
            const newCol = col + dy;

            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                const targetSquare = board[newRow][newCol];

                if (
                    targetSquare === '.' ||
                    (piece === piece.toUpperCase() && targetSquare === targetSquare.toLowerCase()) ||
                    (piece === piece.toLowerCase() && targetSquare === targetSquare.toUpperCase())
                ) {
                    moves.push([newRow, newCol]);
                }
            }
        }

        return moves;
    };

    const getQueenMoves = (row, col, piece) => {
        const moves = [];

        // Направления движения ладьи
        const rookDirections = [
            [-1, 0], // вверх
            [1, 0],  // вниз
            [0, -1], // влево
            [0, 1],  // вправо
        ];

        // Направления движения слона
        const bishopDirections = [
            [-1, -1], // вверх-влево
            [-1, 1],  // вверх-вправо
            [1, -1],  // вниз-влево
            [1, 1],   // вниз-вправо
        ];

        // Проверяем все направления ладьи
        for (const [dx, dy] of rookDirections) {
            let r = row + dx;
            let c = col + dy;

            while (r >= 0 && r < 8 && c >= 0 && c < 8) {
                const targetSquare = board[r][c];

                if (targetSquare === '.') {
                    moves.push([r, c]);
                } else if (
                    (piece === piece.toUpperCase() && targetSquare === targetSquare.toLowerCase()) ||
                    (piece === piece.toLowerCase() && targetSquare === targetSquare.toUpperCase())
                ) {
                    moves.push([r, c]);
                    break;
                } else {
                    break;
                }

                r += dx;
                c += dy;
            }
        }

        // Проверяем все направления слона
        for (const [dx, dy] of bishopDirections) {
            let r = row + dx;
            let c = col + dy;

            while (r >= 0 && r < 8 && c >= 0 && c < 8) {
                const targetSquare = board[r][c];

                if (targetSquare === '.') {
                    moves.push([r, c]);
                } else if (
                    (piece === piece.toUpperCase() && targetSquare === targetSquare.toLowerCase()) ||
                    (piece === piece.toLowerCase() && targetSquare === targetSquare.toUpperCase())
                ) {
                    moves.push([r, c]);
                    break;
                } else {
                    break;
                }

                r += dx;
                c += dy;
            }
        }

        return moves;
    };

    const getBishopMoves = (row, col, piece) => {
        const moves = [];
        const directions = [
            [-1, -1], // вверх-влево
            [-1, 1],  // вверх-вправо
            [1, -1],  // вниз-влево
            [1, 1],   // вниз-вправо
        ];

        for (const [dx, dy] of directions) {
            let r = row + dx;
            let c = col + dy;

            while (r >= 0 && r < 8 && c >= 0 && c < 8) {
                const targetSquare = board[r][c];

                if (targetSquare === '.') {
                    moves.push([r, c]); // Клетка пуста, добавляем в доступные ходы
                } else if (
                    (piece === piece.toUpperCase() && targetSquare === targetSquare.toLowerCase()) ||
                    (piece === piece.toLowerCase() && targetSquare === targetSquare.toUpperCase())
                ) {
                    // Вражеская фигура — добавляем клетку и прекращаем поиск в этом направлении
                    moves.push([r, c]);
                    break;
                } else {
                    // Своя фигура — прекращаем поиск в этом направлении
                    break;
                }

                r += dx;
                c += dy;
            }
        }

        return moves;
    };

    const getKnightMoves = (row, col, piece) => {
        const moves = [];
        const knightMoves = [
            [-2, -1], // вверх-вверх-влево
            [-2, 1],  // вверх-вверх-вправо
            [-1, -2], // вверх-влево-влево
            [-1, 2],  // вверх-вправо-вправо
            [1, -2],  // вниз-влево-влево
            [1, 2],   // вниз-вправо-вправо
            [2, -1],  // вниз-вниз-влево
            [2, 1],   // вниз-вниз-вправо
        ];

        for (const [dx, dy] of knightMoves) {
            const newRow = row + dx;
            const newCol = col + dy;

            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                const targetSquare = board[newRow][newCol];

                if (
                    targetSquare === '.' ||
                    (piece === piece.toUpperCase() && targetSquare === targetSquare.toLowerCase()) ||
                    (piece === piece.toLowerCase() && targetSquare === targetSquare.toUpperCase())
                ) {
                    moves.push([newRow, newCol]);
                }
            }
        }

        return moves;
    };

    return (
        <div className="chess-board-wrapper">
            <div className="row-coordinates">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="row-coordinate">
                        {8 - i}
                    </div>
                ))}
            </div>
            <div className="board-with-columns">
                <div className="column-coordinates">
                    {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((col, i) => (
                        <div key={i} className="column-coordinate">
                            {col}
                        </div>
                    ))}
                </div>
                <div className="chess-board">
                    {board.map((row, rowIndex) => (
                        <div key={rowIndex} className="row">
                            {row.map((square, colIndex) => (
                                <div
                                    key={`${rowIndex}-${colIndex}`}
                                    className={`square ${(rowIndex + colIndex) % 2 === 0 ? 'white' : 'black'
                                        } ${availableMoves.some(([r, c]) => r === rowIndex && c === colIndex)
                                            ? 'highlight'
                                            : ''
                                        } ${selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex
                                            ? 'selected'
                                            : ''
                                        }`}
                                    onClick={() => handleSquareClick(rowIndex, colIndex)}
                                >
                                    {square !== '.' && (
                                        <img
                                            src={getPieceImage(square)}
                                            alt={square}
                                            className="piece-image"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}

                    {promotion && (
                        <div className="promotion-modal">
                            <div className="promotion-options">
                                {['Q', 'R', 'B', 'N'].map((type) => (
                                    <div
                                        key={type}
                                        className="promotion-piece"
                                        onClick={() => handlePromotion(type)}
                                    >
                                        <img
                                            src={getPieceImage(promotion.color === 'white' ? type : type.toLowerCase())}
                                            alt={type}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

    )
};

export default ChessBoard;
