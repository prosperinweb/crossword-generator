import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

interface CrosswordCell {
  row: number;
  col: number;
  letter: string;
  clueNumber?: number;
  isAcrossStart?: boolean;
  isDownStart?: boolean;
  isBlack?: boolean;
}

interface CrosswordClue {
  number: number;
  clue: string;
  answer: string;
  direction: "across" | "down";
  row: number;
  col: number;
}

interface CrosswordData {
  grid: CrosswordCell[][];
  clues: {
    across: CrosswordClue[];
    down: CrosswordClue[];
  };
  size: number;
}

interface CrosswordGridProps {
  puzzleData?: CrosswordData;
  onComplete?: () => void;
}

const CrosswordGrid: React.FC<CrosswordGridProps> = ({
  puzzleData = {
    grid: Array(10)
      .fill(null)
      .map(() =>
        Array(10)
          .fill(null)
          .map(() => ({
            row: 0,
            col: 0,
            letter: "",
            isBlack: Math.random() > 0.7,
          })),
      ),
    clues: {
      across: [
        {
          number: 1,
          clue: "Capital of France",
          answer: "PARIS",
          direction: "across",
          row: 0,
          col: 0,
        },
        {
          number: 5,
          clue: "Largest planet in our solar system",
          answer: "JUPITER",
          direction: "across",
          row: 2,
          col: 0,
        },
      ],
      down: [
        {
          number: 1,
          clue: "Frozen water",
          answer: "ICE",
          direction: "down",
          row: 0,
          col: 0,
        },
        {
          number: 2,
          clue: "Opposite of night",
          answer: "DAY",
          direction: "down",
          row: 0,
          col: 2,
        },
      ],
    },
    size: 10,
  },
  onComplete,
}) => {
  const { theme } = useTheme();
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [direction, setDirection] = useState<"across" | "down">("across");
  const [userAnswers, setUserAnswers] = useState<string[][]>([]);
  const [correctCells, setCorrectCells] = useState<boolean[][]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // Initialize user answers and correct cells arrays
  useEffect(() => {
    if (puzzleData) {
      const size = puzzleData.size;
      setUserAnswers(
        Array(size)
          .fill(null)
          .map(() => Array(size).fill("")),
      );
      setCorrectCells(
        Array(size)
          .fill(null)
          .map(() => Array(size).fill(false)),
      );
      setSelectedCell(findFirstEmptyCell());
    }
  }, [puzzleData]);

  const findFirstEmptyCell = () => {
    for (let row = 0; row < puzzleData.size; row++) {
      for (let col = 0; col < puzzleData.size; col++) {
        if (!puzzleData.grid[row][col].isBlack) {
          return { row, col };
        }
      }
    }
    return null;
  };

  const handleCellClick = (row: number, col: number) => {
    if (puzzleData.grid[row][col].isBlack) return;

    if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
      // Toggle direction if clicking the same cell
      setDirection(direction === "across" ? "down" : "across");
    } else {
      setSelectedCell({ row, col });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;

    if (e.key === "ArrowRight") {
      moveToNextCell(row, col, 0, 1);
      setDirection("across");
    } else if (e.key === "ArrowLeft") {
      moveToNextCell(row, col, 0, -1);
      setDirection("across");
    } else if (e.key === "ArrowDown") {
      moveToNextCell(row, col, 1, 0);
      setDirection("down");
    } else if (e.key === "ArrowUp") {
      moveToNextCell(row, col, -1, 0);
      setDirection("down");
    } else if (e.key === "Tab") {
      e.preventDefault();
      moveToNextClue(e.shiftKey);
    } else if (e.key === "Backspace") {
      handleBackspace();
    } else if (/^[A-Za-z]$/.test(e.key)) {
      handleLetterInput(e.key.toUpperCase());
    }
  };

  const moveToNextCell = (
    row: number,
    col: number,
    rowDelta: number,
    colDelta: number,
  ) => {
    let newRow = row + rowDelta;
    let newCol = col + colDelta;

    while (
      newRow >= 0 &&
      newRow < puzzleData.size &&
      newCol >= 0 &&
      newCol < puzzleData.size
    ) {
      if (!puzzleData.grid[newRow][newCol].isBlack) {
        setSelectedCell({ row: newRow, col: newCol });
        return;
      }
      newRow += rowDelta;
      newCol += colDelta;
    }
  };

  const moveToNextClue = (backward: boolean) => {
    // Implementation would find the next/previous clue and move to its first cell
    // This is a simplified version
    const clues = [...puzzleData.clues.across, ...puzzleData.clues.down].sort(
      (a, b) => a.number - b.number,
    );
    if (clues.length === 0) return;

    const currentClue = findCurrentClue();
    let nextClueIndex = 0;

    if (currentClue) {
      const currentIndex = clues.findIndex(
        (c) =>
          c.number === currentClue.number &&
          c.direction === currentClue.direction,
      );

      if (backward) {
        nextClueIndex = (currentIndex - 1 + clues.length) % clues.length;
      } else {
        nextClueIndex = (currentIndex + 1) % clues.length;
      }
    }

    const nextClue = clues[nextClueIndex];
    setSelectedCell({ row: nextClue.row, col: nextClue.col });
    setDirection(nextClue.direction);
  };

  const findCurrentClue = () => {
    if (!selectedCell) return null;

    const { row, col } = selectedCell;

    if (direction === "across") {
      return puzzleData.clues.across.find((clue) => {
        // Check if the selected cell is part of this across clue
        return (
          row === clue.row &&
          col >= clue.col &&
          col < clue.col + clue.answer.length
        );
      });
    } else {
      return puzzleData.clues.down.find((clue) => {
        // Check if the selected cell is part of this down clue
        return (
          col === clue.col &&
          row >= clue.row &&
          row < clue.row + clue.answer.length
        );
      });
    }
  };

  const handleBackspace = () => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;
    const newAnswers = [...userAnswers];

    if (newAnswers[row][col]) {
      // Clear current cell if it has a letter
      newAnswers[row][col] = "";
      setUserAnswers(newAnswers);
    } else {
      // Move to previous cell if current cell is empty
      if (direction === "across") {
        moveToNextCell(row, col, 0, -1);
      } else {
        moveToNextCell(row, col, -1, 0);
      }
    }
  };

  const handleLetterInput = (letter: string) => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;
    const newAnswers = [...userAnswers];
    newAnswers[row][col] = letter;
    setUserAnswers(newAnswers);

    // Check if the letter is correct
    const correctLetter = puzzleData.grid[row][col].letter;
    const isCorrect = letter === correctLetter;

    const newCorrectCells = [...correctCells];
    newCorrectCells[row][col] = isCorrect;
    setCorrectCells(newCorrectCells);

    // Move to next cell
    if (direction === "across") {
      moveToNextCell(row, col, 0, 1);
    } else {
      moveToNextCell(row, col, 1, 0);
    }

    // Check if puzzle is complete
    checkPuzzleCompletion(newAnswers, newCorrectCells);
  };

  const checkPuzzleCompletion = (answers: string[][], correct: boolean[][]) => {
    for (let row = 0; row < puzzleData.size; row++) {
      for (let col = 0; col < puzzleData.size; col++) {
        if (
          !puzzleData.grid[row][col].isBlack &&
          (!answers[row][col] || !correct[row][col])
        ) {
          return;
        }
      }
    }

    // All cells are filled correctly
    setIsComplete(true);
    if (onComplete) onComplete();
  };

  const getHighlightedCells = () => {
    if (!selectedCell) return [];

    const { row, col } = selectedCell;
    const highlighted = [];

    if (direction === "across") {
      // Highlight the entire row from the start of the word to the end
      let startCol = col;
      while (startCol > 0 && !puzzleData.grid[row][startCol - 1].isBlack) {
        startCol--;
      }

      let endCol = col;
      while (
        endCol < puzzleData.size - 1 &&
        !puzzleData.grid[row][endCol + 1].isBlack
      ) {
        endCol++;
      }

      for (let c = startCol; c <= endCol; c++) {
        highlighted.push({ row, col: c });
      }
    } else {
      // Highlight the entire column from the start of the word to the end
      let startRow = row;
      while (startRow > 0 && !puzzleData.grid[startRow - 1][col].isBlack) {
        startRow--;
      }

      let endRow = row;
      while (
        endRow < puzzleData.size - 1 &&
        !puzzleData.grid[endRow + 1][col].isBlack
      ) {
        endRow++;
      }

      for (let r = startRow; r <= endRow; r++) {
        highlighted.push({ row: r, col });
      }
    }

    return highlighted;
  };

  const highlightedCells = getHighlightedCells();
  const currentClue = findCurrentClue();

  // Theme-specific styling
  const getThemeStyles = () => {
    switch (theme) {
      case "vintage":
        return {
          gridBg: "bg-amber-50",
          cellBg: "bg-amber-100",
          blackCellBg: "bg-amber-900",
          selectedCellBg: "bg-amber-300",
          highlightedCellBg: "bg-amber-200",
          correctCellBg: "bg-green-200",
          incorrectCellBg: "bg-red-200",
          borderColor: "border-amber-800",
          textColor: "text-amber-900",
          numberColor: "text-amber-700",
          cluesBg: "bg-amber-100",
          cluesTextColor: "text-amber-900",
          boxShadow: "shadow-amber-200",
        };
      case "neon":
        return {
          gridBg: "bg-gray-900",
          cellBg: "bg-gray-800",
          blackCellBg: "bg-black",
          selectedCellBg: "bg-purple-600",
          highlightedCellBg: "bg-purple-900",
          correctCellBg: "bg-green-600",
          incorrectCellBg: "bg-red-600",
          borderColor: "border-purple-500",
          textColor: "text-white",
          numberColor: "text-purple-300",
          cluesBg: "bg-gray-800",
          cluesTextColor: "text-purple-300",
          boxShadow: "shadow-purple-500/50",
        };
      case "magazine":
      default:
        return {
          gridBg: "bg-white",
          cellBg: "bg-gray-50",
          blackCellBg: "bg-gray-900",
          selectedCellBg: "bg-blue-200",
          highlightedCellBg: "bg-blue-100",
          correctCellBg: "bg-green-100",
          incorrectCellBg: "bg-red-100",
          borderColor: "border-gray-300",
          textColor: "text-gray-900",
          numberColor: "text-gray-600",
          cluesBg: "bg-white",
          cluesTextColor: "text-gray-800",
          boxShadow: "shadow-gray-200",
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <div
      className={`flex flex-col md:flex-row gap-6 p-4 ${styles.gridBg} rounded-xl`}
    >
      <div className="flex-1 flex flex-col items-center">
        <div
          ref={gridRef}
          className={`grid gap-0.5 ${styles.boxShadow} rounded-lg overflow-hidden border ${styles.borderColor}`}
          style={{
            gridTemplateColumns: `repeat(${puzzleData.size}, minmax(30px, 40px))`,
            gridTemplateRows: `repeat(${puzzleData.size}, minmax(30px, 40px))`,
          }}
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {puzzleData.grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isSelected =
                selectedCell?.row === rowIndex &&
                selectedCell?.col === colIndex;
              const isHighlighted = highlightedCells.some(
                (c) => c.row === rowIndex && c.col === colIndex,
              );
              const hasUserAnswer = userAnswers[rowIndex]?.[colIndex];
              const isCorrect = correctCells[rowIndex]?.[colIndex];

              let cellBg = styles.cellBg;
              if (cell.isBlack) {
                cellBg = styles.blackCellBg;
              } else if (isSelected) {
                cellBg = styles.selectedCellBg;
              } else if (isHighlighted) {
                cellBg = styles.highlightedCellBg;
              } else if (hasUserAnswer) {
                cellBg = isCorrect
                  ? styles.correctCellBg
                  : styles.incorrectCellBg;
              }

              return (
                <motion.div
                  key={`${rowIndex}-${colIndex}`}
                  className={`relative flex items-center justify-center ${cellBg} ${styles.borderColor} border cursor-pointer`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  whileTap={{ scale: cell.isBlack ? 1 : 0.95 }}
                  animate={{
                    backgroundColor: isComplete ? "#4ade80" : undefined,
                    transition: { duration: 0.3 },
                  }}
                >
                  {cell.clueNumber && !cell.isBlack && (
                    <span
                      className={`absolute text-xs top-0.5 left-1 ${styles.numberColor}`}
                    >
                      {cell.clueNumber}
                    </span>
                  )}
                  {!cell.isBlack && (
                    <motion.span
                      className={`text-lg font-bold ${styles.textColor}`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{
                        opacity: hasUserAnswer ? 1 : 0,
                        scale: hasUserAnswer ? 1 : 0.5,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {userAnswers[rowIndex]?.[colIndex] || ""}
                    </motion.span>
                  )}
                </motion.div>
              );
            }),
          )}
        </div>

        {isComplete && (
          <motion.div
            className="mt-4 p-3 bg-green-100 text-green-800 rounded-md text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Congratulations! You've completed the puzzle!
          </motion.div>
        )}
      </div>

      <div
        className={`w-full md:w-1/3 ${styles.cluesBg} p-4 rounded-lg ${styles.boxShadow}`}
      >
        <div className="mb-6">
          <h3 className={`text-lg font-bold mb-2 ${styles.cluesTextColor}`}>
            Across
          </h3>
          <ul className="space-y-2">
            {puzzleData.clues.across.map((clue) => (
              <motion.li
                key={`across-${clue.number}`}
                className={`p-2 rounded ${currentClue?.number === clue.number && currentClue?.direction === "across" ? "bg-blue-100" : ""}`}
                whileHover={{ scale: 1.01 }}
                onClick={() => {
                  setSelectedCell({ row: clue.row, col: clue.col });
                  setDirection("across");
                }}
              >
                <span className="font-bold mr-2">{clue.number}.</span>
                <span className={styles.cluesTextColor}>{clue.clue}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={`text-lg font-bold mb-2 ${styles.cluesTextColor}`}>
            Down
          </h3>
          <ul className="space-y-2">
            {puzzleData.clues.down.map((clue) => (
              <motion.li
                key={`down-${clue.number}`}
                className={`p-2 rounded ${currentClue?.number === clue.number && currentClue?.direction === "down" ? "bg-blue-100" : ""}`}
                whileHover={{ scale: 1.01 }}
                onClick={() => {
                  setSelectedCell({ row: clue.row, col: clue.col });
                  setDirection("down");
                }}
              >
                <span className="font-bold mr-2">{clue.number}.</span>
                <span className={styles.cluesTextColor}>{clue.clue}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CrosswordGrid;
