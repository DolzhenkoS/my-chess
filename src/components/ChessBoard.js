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
    const [selectedSquare, setSelectedSquare] = useState(null); // Состояние выбранной клетки
    const [availableMoves, setAvailableMoves] = useState([]); // Доступные ходы

    // Функция для обработки клика по клетке
    const handleSquareClick = (row, col) => {
        const piece = board[row][col];

        if (selectedPiece) {
            // Если клетка выбрана и доступна для хода
            const isMoveValid = availableMoves.some(
                ([moveRow, moveCol]) => moveRow === row && moveCol === col
            );

            if (isMoveValid) {
                // Выполнить ход
                const newBoard = board.map((boardRow) => [...boardRow]);
                newBoard[row][col] = selectedPiece.piece;
                newBoard[selectedPiece.row][selectedPiece.col] = '.';
                setBoard(newBoard);

                // Сброс выбора
                setSelectedPiece(null);
                setAvailableMoves([]);
            } else {
                // Сброс, если клик вне доступных клеток
                setSelectedPiece(null);
                setAvailableMoves([]);
            }
        } else if (piece === 'P' || piece === 'p') {
            // Если фигура — пешка, рассчитываем доступные ходы
            setSelectedPiece({ piece, row, col });
            setAvailableMoves(getPawnMoves(row, col, piece));
        }
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

        // Ход вперёд на одну клетку
        if (board[row + direction] && board[row + direction][col] === '.') {
            moves.push([row + direction, col]);

            // Ход вперёд на две клетки с начальной позиции
            if ((piece === 'P' && row === 6) || (piece === 'p' && row === 1)) {
                if (board[row + 2 * direction] && board[row + 2 * direction][col] === '.') {
                    moves.push([row + 2 * direction, col]);
                }
            }
        }

        // Взятие фигур по диагонали
        [-1, 1].forEach((offset) => {
            const targetCol = col + offset;
            if (
                board[row + direction] &&
                board[row + direction][targetCol] &&
                board[row + direction][targetCol] !== '.' &&
                (piece === 'P' ? board[row + direction][targetCol] === board[row + direction][targetCol].toLowerCase() :
                    board[row + direction][targetCol] === board[row + direction][targetCol].toUpperCase())
            ) {
                moves.push([row + direction, targetCol]);
            }
        });

        return moves;
    };

    // Функция для рендеринга клетки
    // const renderSquare = (row, col) => {
    //     const isBlack = (row + col) % 2 === 1;
    //     const piece = board[row][col];
    //     const pieceClass = piece !== '.' ? `piece${piece === piece.toUpperCase() ? 'white' : 'black'}` : '';
    //     const isSelected = selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col;

    //     return (
    //         <div
    //             key={`${row}-${col}`}
    //             className={`square ${isBlack ? 'black' : 'white'} ${pieceClass} ${isSelected ? 'selected' : ''}`}
    //             onClick={() => handleSquareClick(row, col)}
    //         >
    //             {piece !== '.' && <img src={getPieceImage(piece)} alt={piece} className="piece-image" />}
    //         </div>
    //     );
    // };

    return (
        // <div className="chess-board">
        //     {board.map((row, rowIndex) => (
        //         <div key={rowIndex} className="row">
        //             {row.map((_, colIndex) => renderSquare(rowIndex, colIndex))}
        //         </div>
        //     ))}
        // </div>
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
        </div>

    );
};

export default ChessBoard;
