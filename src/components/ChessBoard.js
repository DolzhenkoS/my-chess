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
    const [selectedSquare, setSelectedSquare] = useState(null); // Состояние выбранной клетки

    // Функция для обработки клика по клетке
    const handleSquareClick = (row, col) => {
        if (selectedSquare) {
            const [selectedRow, selectedCol] = selectedSquare;
            // Если выбрана фигура, перемещаем ее
            const newBoard = [...board];
            newBoard[row][col] = newBoard[selectedRow][selectedCol];
            newBoard[selectedRow][selectedCol] = '.';
            setBoard(newBoard);
            setSelectedSquare(null); // Снимаем выделение
        } else {
            setSelectedSquare([row, col]); // Выбираем клетку
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


    // Функция для рендеринга клетки
    const renderSquare = (row, col) => {
        const isBlack = (row + col) % 2 === 1;
        const piece = board[row][col];
        const pieceClass = piece !== '.' ? `piece${piece === piece.toUpperCase() ? 'white' : 'black'}` : '';
        const isSelected = selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col;

        return (
            <div
                key={`${row}-${col}`}
                className={`square ${isBlack ? 'black' : 'white'} ${pieceClass} ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSquareClick(row, col)}
            >
                {piece !== '.' && <img src={getPieceImage(piece)} alt={piece} className="piece-image" />}
            </div>
        );
    };

    return (
        <div className="chess-board">
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="row">
                    {row.map((_, colIndex) => renderSquare(rowIndex, colIndex))}
                </div>
            ))}
        </div>
    );
};

export default ChessBoard;
