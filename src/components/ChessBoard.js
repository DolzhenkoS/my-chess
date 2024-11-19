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

                setBoard(newBoard);

                // Сохраняем последний ход
                setLastMove({
                    from: [selectedPiece.row, selectedPiece.col],
                    to: [row, col],
                    piece: selectedPiece.piece,
                });

                setSelectedPiece(null);
                setAvailableMoves([]);
            } else {
                setSelectedPiece(null);
                setAvailableMoves([]);
            }
        } else if (piece === 'P' || piece === 'p') {
            setSelectedPiece({ piece, row, col });
            setAvailableMoves(getPawnMoves(row, col, piece));
        }
    };

    //Выбор фигуры при проходе пешки
    const handlePromotion = (type) => {
        const newBoard = board.map((row) => [...row]);
        newBoard[promotion.row][promotion.col] = promotion.color === 'white' ? type : type.toLowerCase();
        setBoard(newBoard);
        setPromotion(null); // Скрыть модальное окно
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


    return (
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

    );
};

export default ChessBoard;
