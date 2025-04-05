import { PuzzleData } from "@/components/PuzzleGenerator";

// Convert PuzzleData to CrosswordData format needed by CrosswordGrid
export function convertPuzzleDataToCrosswordData(puzzleData: PuzzleData) {
  const { grid, clues, size } = puzzleData;

  // Initialize the grid with proper cell structure
  const crosswordGrid = Array(size)
    .fill(null)
    .map((_, rowIndex) =>
      Array(size)
        .fill(null)
        .map((_, colIndex) => ({
          row: rowIndex,
          col: colIndex,
          letter: grid[rowIndex]?.[colIndex] || "",
          isBlack: !grid[rowIndex]?.[colIndex],
          clueNumber: undefined,
          isAcrossStart: false,
          isDownStart: false,
        })),
    );

  // Process across clues
  Object.entries(clues.across).forEach(([number, clue]) => {
    // Find the starting position for this clue
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        // Check if this could be the start of an across clue
        if (
          !crosswordGrid[row][col].isBlack &&
          (col === 0 || crosswordGrid[row][col - 1].isBlack) &&
          col + 1 < size &&
          !crosswordGrid[row][col + 1].isBlack
        ) {
          // This is the start of a word going across
          // Check if this matches our clue number
          if (crosswordGrid[row][col].clueNumber === undefined) {
            crosswordGrid[row][col].clueNumber = parseInt(number);
            crosswordGrid[row][col].isAcrossStart = true;
            break;
          }
        }
      }
    }
  });

  // Process down clues
  Object.entries(clues.down).forEach(([number, clue]) => {
    // Find the starting position for this clue
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        // Check if this could be the start of a down clue
        if (
          !crosswordGrid[row][col].isBlack &&
          (row === 0 || crosswordGrid[row - 1][col].isBlack) &&
          row + 1 < size &&
          !crosswordGrid[row + 1][col].isBlack
        ) {
          // This is the start of a word going down
          // Check if this matches our clue number
          if (crosswordGrid[row][col].clueNumber === undefined) {
            crosswordGrid[row][col].clueNumber = parseInt(number);
            crosswordGrid[row][col].isDownStart = true;
            break;
          } else if (parseInt(number) === crosswordGrid[row][col].clueNumber) {
            // This cell already has this number (from an across clue)
            crosswordGrid[row][col].isDownStart = true;
            break;
          }
        }
      }
    }
  });

  // Convert clues to the format expected by CrosswordGrid
  const acrossClues = Object.entries(clues.across).map(([number, clue]) => {
    // Find the starting position for this clue
    let row = 0,
      col = 0;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (
          crosswordGrid[r][c].clueNumber === parseInt(number) &&
          crosswordGrid[r][c].isAcrossStart
        ) {
          row = r;
          col = c;
          break;
        }
      }
    }

    // Calculate the answer
    let answer = "";
    let c = col;
    while (c < size && !crosswordGrid[row][c].isBlack) {
      answer += crosswordGrid[row][c].letter;
      c++;
    }

    return {
      number: parseInt(number),
      clue,
      answer,
      direction: "across" as const,
      row,
      col,
    };
  });

  const downClues = Object.entries(clues.down).map(([number, clue]) => {
    // Find the starting position for this clue
    let row = 0,
      col = 0;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (
          crosswordGrid[r][c].clueNumber === parseInt(number) &&
          crosswordGrid[r][c].isDownStart
        ) {
          row = r;
          col = c;
          break;
        }
      }
    }

    // Calculate the answer
    let answer = "";
    let r = row;
    while (r < size && !crosswordGrid[r][col].isBlack) {
      answer += crosswordGrid[r][col].letter;
      r++;
    }

    return {
      number: parseInt(number),
      clue,
      answer,
      direction: "down" as const,
      row,
      col,
    };
  });

  return {
    grid: crosswordGrid,
    clues: {
      across: acrossClues,
      down: downClues,
    },
    size,
  };
}
