
import React, { useState, useEffect, useCallback } from 'react';
import { ROW_DURATION_SECONDS } from '../constants';
import { RowResult } from '../types';
import { Timer, Delete, AlertCircle } from 'lucide-react';

interface PracticeSessionProps {
  rows: number[][];
  title: string;
  onComplete: (results: RowResult[]) => void;
}

export const PracticeSession: React.FC<PracticeSessionProps> = ({ rows, title, onComplete }) => {
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [currentColIndex, setCurrentColIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROW_DURATION_SECONDS);
  
  // Store answers as: { [rowIndex]: { [colIndex]: string_value } }
  const [answers, setAnswers] = useState<Record<number, Record<number, string>>>({});
  const [results, setResults] = useState<RowResult[]>([]);

  // Derived state for the current numbers to add
  const currentRowData = rows[currentRowIndex];
  const maxCols = currentRowData.length - 1;
  const isRowFinished = currentColIndex >= maxCols;
  
  const num1 = !isRowFinished ? currentRowData[currentColIndex] : null;
  const num2 = !isRowFinished ? currentRowData[currentColIndex + 1] : null;

  const handleRowComplete = useCallback(() => {
    // Calculate stats for current row
    const rowAnswers = answers[currentRowIndex] || {};
    const rowNumbers = rows[currentRowIndex];
    let correctCount = 0;
    let totalFilled = 0;

    for (let i = 0; i < rowNumbers.length - 1; i++) {
      const val = rowAnswers[i];
      if (val !== undefined && val !== '') {
        totalFilled++;
        const n1 = rowNumbers[i];
        const n2 = rowNumbers[i + 1];
        const sum = n1 + n2;
        const expectedLastDigit = sum % 10;
        
        if (parseInt(val) === expectedLastDigit) {
          correctCount++;
        }
      }
    }

    const newResult: RowResult = {
      rowIndex: currentRowIndex,
      totalFilled,
      correctCount
    };

    setResults(prev => [...prev, newResult]);

    // Move to next row or finish
    if (currentRowIndex < rows.length - 1) {
      setCurrentRowIndex(prev => prev + 1);
      setCurrentColIndex(0); // Reset column cursor
      setTimeLeft(ROW_DURATION_SECONDS);
    } else {
      setTimeout(() => {
        onComplete([...results, newResult]);
      }, 0);
    }
  }, [answers, currentRowIndex, onComplete, results, rows]);

  // Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleRowComplete();
          return ROW_DURATION_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentRowIndex, handleRowComplete]);

  // Handle Numpad Input
  const handleInput = (value: number) => {
    if (isRowFinished) return;

    // Save answer
    setAnswers(prev => ({
      ...prev,
      [currentRowIndex]: {
        ...(prev[currentRowIndex] || {}),
        [currentColIndex]: value.toString()
      }
    }));

    // Move to next column
    setCurrentColIndex(prev => prev + 1);
  };

  // Handle Backspace/Delete
  const handleDelete = () => {
    if (currentColIndex > 0) {
      // Move back
      const newColIndex = currentColIndex - 1;
      setCurrentColIndex(newColIndex);
      
      // Clear the answer at that position
      setAnswers(prev => ({
        ...prev,
        [currentRowIndex]: {
          ...(prev[currentRowIndex] || {}),
          [newColIndex]: ''
        }
      }));
    }
  };

  // Keyboard support mapping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key >= '0' && e.key <= '9') {
            handleInput(parseInt(e.key));
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            handleDelete();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentRowIndex, currentColIndex, isRowFinished]);

  const progressPercentage = (timeLeft / ROW_DURATION_SECONDS) * 100;

  return (
    <div className="h-screen bg-gray-50 flex flex-col items-center overflow-hidden">
        {/* Header / StatusBar */}
        <div className="w-full bg-white shadow-sm border-b border-gray-200 shrink-0 z-10">
            <div className="max-w-md mx-auto px-4 py-3">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex flex-col">
                        <h1 className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</h1>
                        <h2 className="text-xs md:text-sm font-bold text-gray-800 uppercase tracking-wide">
                            Baris {currentRowIndex + 1} / {rows.length}
                        </h2>
                    </div>
                    <div className={`flex items-center gap-2 font-mono text-lg md:text-xl font-bold ${timeLeft <= 5 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`}>
                        <Timer className="w-4 h-4 md:w-5 md:h-5" />
                        00:{timeLeft.toString().padStart(2, '0')}
                    </div>
                </div>
                {/* Timer Bar */}
                <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-1000 ease-linear ${timeLeft <= 5 ? 'bg-red-500' : 'bg-blue-500'}`}
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>
        </div>

        {/* Main Calculator Area */}
        <div className="flex-1 w-full max-w-md p-3 md:p-4 flex flex-col justify-between min-h-0">
            
            {/* Display Screen */}
            <div className="flex-1 flex flex-col items-center justify-center mb-4 min-h-0">
                {isRowFinished ? (
                    <div className="text-center animate-pulse">
                        <p className="text-gray-400 text-lg">Menunggu waktu...</p>
                        <p className="text-gray-300 text-sm mt-1">Istirahat sejenak</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-4 px-8 bg-white rounded-3xl shadow-sm border border-gray-100 w-full h-full max-h-[40vh] md:max-h-80">
                        <div className="text-gray-400 text-xs font-medium mb-2 uppercase tracking-widest">
                            Soal {currentColIndex + 1}
                        </div>
                        <div className="flex flex-col items-center gap-1 md:gap-2 flex-1 justify-center">
                            <span className="text-5xl md:text-7xl font-bold text-gray-800 leading-tight">{num1}</span>
                            <span className="text-5xl md:text-7xl font-bold text-gray-800 leading-tight">{num2}</span>
                            <div className="w-24 md:w-32 h-1 bg-gray-800 rounded-full my-2"></div>
                            {/* Visual placeholder for answer */}
                            <div className="h-12 w-12 md:h-16 md:w-16 border-2 border-dashed border-blue-200 rounded-xl flex items-center justify-center bg-blue-50 mt-1">
                                <span className="text-blue-300 text-xl md:text-2xl font-bold">?</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Keypad */}
            <div className="w-full shrink-0">
                <div className="grid grid-cols-3 gap-2 md:gap-3 mb-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                            key={num}
                            onClick={() => handleInput(num)}
                            disabled={isRowFinished}
                            className={`
                                h-14 md:h-20 rounded-xl md:rounded-2xl text-2xl md:text-3xl font-bold font-mono transition-all duration-100 shadow-sm border-b-2 md:border-b-4 active:border-b-0 active:translate-y-1 touch-manipulation
                                ${isRowFinished 
                                    ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed' 
                                    : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50 active:bg-blue-50 active:text-blue-600'
                                }
                            `}
                        >
                            {num}
                        </button>
                    ))}
                    
                    {/* Bottom Row: Empty, 0, Delete */}
                    <div className="h-14 md:h-20"></div> {/* Spacer */}
                    
                    <button
                        onClick={() => handleInput(0)}
                        disabled={isRowFinished}
                        className={`
                            h-14 md:h-20 rounded-xl md:rounded-2xl text-2xl md:text-3xl font-bold font-mono transition-all duration-100 shadow-sm border-b-2 md:border-b-4 active:border-b-0 active:translate-y-1 touch-manipulation
                            ${isRowFinished 
                                ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed' 
                                : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50 active:bg-blue-50 active:text-blue-600'
                            }
                        `}
                    >
                        0
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={currentColIndex === 0 && !isRowFinished}
                        className={`
                            h-14 md:h-20 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-100 shadow-sm border-b-2 md:border-b-4 active:border-b-0 active:translate-y-1 touch-manipulation
                            bg-red-50 text-red-500 border-red-100 hover:bg-red-100 active:bg-red-200
                            disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                    >
                        <Delete className="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                </div>
                
                <div className="flex items-center justify-center gap-2 text-[10px] md:text-xs text-gray-400 pb-2">
                    <AlertCircle className="w-3 h-3" />
                    <span>Input angka satuan hasil penjumlahan</span>
                </div>
            </div>
        </div>
    </div>
  );
};
