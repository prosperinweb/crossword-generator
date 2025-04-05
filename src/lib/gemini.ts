import { PuzzleData } from "@/components/PuzzleGenerator";

interface GeminiResponse {
  grid: string[][];
  clues: {
    across: Record<string, string>;
    down: Record<string, string>;
  };
  size: number;
}

export async function generateCrossword(
  theme: string,
  difficulty: number,
): Promise<PuzzleData> {
  try {
    // For now, we'll simulate the API call with a delay and mock data
    // In a real implementation, this would call the Gemini API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate different puzzles based on theme and difficulty
    const difficultyLevel =
      difficulty < 33 ? "easy" : difficulty < 66 ? "medium" : "hard";

    // Mock data based on theme and difficulty
    const puzzles: Record<string, Record<string, GeminiResponse>> = {
      general: {
        easy: {
          grid: [
            ["C", "A", "T", "", ""],
            ["A", "", "R", "", ""],
            ["R", "A", "E", "E", ""],
            ["", "", "E", "", ""],
            ["", "", "", "", ""],
          ],
          clues: {
            across: {
              "1": "Feline pet",
              "3": "Uncommon",
            },
            down: {
              "1": "Automobile",
              "2": "Tree fluid",
            },
          },
          size: 5,
        },
        medium: {
          grid: [
            ["P", "U", "Z", "Z", "L", "E"],
            ["A", "", "E", "", "O", ""],
            ["R", "I", "B", "B", "O", "N"],
            ["K", "", "R", "", "K", ""],
            ["", "", "A", "", "", ""],
            ["", "", "", "", "", ""],
          ],
          clues: {
            across: {
              "1": "Brain teaser",
              "3": "Decorative strip of material",
            },
            down: {
              "1": "Place to leave your car",
              "2": "Striped animal",
              "5": "Observe",
            },
          },
          size: 6,
        },
        hard: {
          grid: [
            ["Q", "U", "I", "Z", "", "J", "A", "M"],
            ["U", "", "", "E", "", "U", "", "A"],
            ["A", "X", "I", "O", "M", "S", "", "Z"],
            ["Y", "", "", "", "", "T", "", "E"],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
          ],
          clues: {
            across: {
              "1": "Test of knowledge",
              "3": "Self-evident truths",
            },
            down: {
              "1": "Unusual or strange",
              "4": "Citrus fruit",
              "6": "Legal professional",
              "8": "Complex puzzle",
            },
          },
          size: 8,
        },
      },
      science: {
        easy: {
          grid: [
            ["A", "T", "O", "M", ""],
            ["C", "", "", "A", ""],
            ["I", "O", "N", "S", ""],
            ["D", "", "", "S", ""],
            ["", "", "", "", ""],
          ],
          clues: {
            across: {
              "1": "Smallest unit of an element",
              "3": "Charged particles",
            },
            down: {
              "1": "Sour substance",
              "4": "State of matter",
            },
          },
          size: 5,
        },
        medium: {
          grid: [
            ["P", "H", "Y", "S", "I", "C", "S"],
            ["L", "", "", "O", "", "", "P"],
            ["A", "T", "O", "M", "I", "C", "A"],
            ["N", "", "", "E", "", "", "C"],
            ["E", "", "", "", "", "", "E"],
            ["T", "", "", "", "", "", ""],
            ["", "", "", "", "", "", ""],
          ],
          clues: {
            across: {
              "1": "Study of matter and energy",
              "3": "Related to atoms",
            },
            down: {
              "1": "Celestial body",
              "4": "Chemical element with symbol Na",
              "7": "Outer space",
            },
          },
          size: 7,
        },
        hard: {
          grid: [
            ["Q", "U", "A", "N", "T", "U", "M", ""],
            ["U", "", "", "E", "", "", "I", ""],
            ["A", "S", "T", "R", "O", "", "T", ""],
            ["S", "", "", "V", "", "", "O", ""],
            ["A", "T", "O", "M", "I", "C", "S", ""],
            ["R", "", "", "", "", "", "I", ""],
            ["", "", "", "", "", "", "S", ""],
            ["", "", "", "", "", "", "", ""],
          ],
          clues: {
            across: {
              "1": "Physics at subatomic scale",
              "3": "Related to stars",
              "5": "Related to atoms",
            },
            down: {
              "1": "State of matter as gas",
              "4": "Chemical element with symbol Fe",
              "7": "Smallest unit of an element",
            },
          },
          size: 8,
        },
      },
      // Add more themes as needed
    };

    // Get puzzle based on theme and difficulty
    const themeData = puzzles[theme] || puzzles.general;
    const difficultyData = themeData[difficultyLevel] || themeData.medium;

    return difficultyData;
  } catch (error) {
    console.error("Error generating crossword:", error);
    throw new Error("Failed to generate crossword puzzle");
  }
}
