import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Moon, Sun, Palette, Share2, Download } from "lucide-react";
import PuzzleGenerator from "./PuzzleGenerator";
import CrosswordGrid from "./CrosswordGrid";
import { useTheme } from "./ThemeProvider";
import { PuzzleData } from "./PuzzleGenerator";
import { Button } from "@/components/ui/button";
import { generateCrossword } from "@/lib/gemini";

const Home = () => {
  const { theme, setTheme } = useTheme();
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [completedPuzzles, setCompletedPuzzles] = useState<PuzzleData[]>([]);

  // Initial puzzle data
  const initialPuzzle: PuzzleData = {
    grid: [
      ["C", "R", "O", "S", "S"],
      ["W", "", "O", "", ""],
      ["O", "", "R", "", ""],
      ["R", "", "D", "", ""],
      ["D", "", "", "", ""],
    ],
    clues: {
      across: {
        "1": "A puzzle with words crossing",
      },
      down: {
        "1": "What this puzzle is called",
      },
    },
    size: 5,
  };

  useEffect(() => {
    // Set initial puzzle data on first load
    if (!puzzle) {
      setPuzzle(initialPuzzle);
    }
  }, []);

  const handlePuzzleGenerated = async (newPuzzle: PuzzleData) => {
    setIsLoading(true);
    try {
      setPuzzle(newPuzzle);
    } catch (error) {
      console.error("Error setting puzzle:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePuzzleCompleted = () => {
    if (puzzle) {
      setCompletedPuzzles([...completedPuzzles, puzzle]);
      // Show completion animation or message
    }
  };

  const generateRandomPuzzle = async () => {
    setIsLoading(true);
    try {
      const themes = [
        "general",
        "science",
        "history",
        "geography",
        "literature",
      ];
      const randomTheme = themes[Math.floor(Math.random() * themes.length)];
      const randomDifficulty = Math.floor(Math.random() * 100);

      const newPuzzle = await generateCrossword(randomTheme, randomDifficulty);
      setPuzzle(newPuzzle);
    } catch (error) {
      console.error("Error generating random puzzle:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sharePuzzle = () => {
    // In a real implementation, this would generate a shareable link
    alert("Sharing functionality would be implemented here!");
  };

  const downloadPuzzle = () => {
    // In a real implementation, this would download the puzzle as PDF
    if (!puzzle) return;

    const puzzleData = JSON.stringify(puzzle, null, 2);
    const blob = new Blob([puzzleData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `crossword-puzzle-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const themeVariants = {
    vintage: {
      backgroundColor: "bg-amber-50",
      textColor: "text-amber-900",
      accentColor: "bg-amber-800",
      borderColor: "border-amber-800",
      headerStyle: "font-serif italic",
      gridStyle: "bg-amber-100 border-amber-800",
      buttonStyle: "bg-amber-800 hover:bg-amber-700 text-amber-50",
    },
    neon: {
      backgroundColor: "bg-gray-900",
      textColor: "text-pink-500",
      accentColor: "bg-cyan-500",
      borderColor: "border-pink-500",
      headerStyle: "font-mono",
      gridStyle: "bg-gray-800 border-cyan-500",
      buttonStyle: "bg-pink-600 hover:bg-pink-500 text-white",
    },
    magazine: {
      backgroundColor: "bg-white",
      textColor: "text-gray-800",
      accentColor: "bg-red-500",
      borderColor: "border-gray-300",
      headerStyle: "font-sans font-bold",
      gridStyle: "bg-gray-50 border-gray-400",
      buttonStyle: "bg-red-500 hover:bg-red-400 text-white",
    },
  };

  const currentTheme = themeVariants[theme];

  const pageTransition = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const themeIconMap = {
    vintage: <Sun className="h-5 w-5" />,
    neon: <Moon className="h-5 w-5" />,
    magazine: <Palette className="h-5 w-5" />,
  };

  return (
    <motion.div
      className={`min-h-screen ${currentTheme.backgroundColor} ${currentTheme.textColor} transition-colors duration-500`}
      initial="hidden"
      animate="visible"
      variants={pageTransition}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <motion.h1
              className={`text-4xl md:text-5xl ${currentTheme.headerStyle}`}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Crossword Creator
            </motion.h1>

            <div className="flex items-center gap-3">
              {/* Action buttons */}
              <AnimatePresence>
                {puzzle && (
                  <>
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={`p-2 rounded-full ${currentTheme.borderColor} border-2`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={sharePuzzle}
                      title="Share puzzle"
                    >
                      <Share2 className="h-5 w-5" />
                    </motion.button>

                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={`p-2 rounded-full ${currentTheme.borderColor} border-2`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={downloadPuzzle}
                      title="Download puzzle"
                    >
                      <Download className="h-5 w-5" />
                    </motion.button>
                  </>
                )}
              </AnimatePresence>

              {/* Theme selector */}
              <div className="relative">
                <motion.button
                  className={`p-2 rounded-full ${currentTheme.borderColor} border-2`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowThemeSelector(!showThemeSelector)}
                >
                  <Settings className="h-5 w-5" />
                </motion.button>

                <AnimatePresence>
                  {showThemeSelector && (
                    <motion.div
                      className={`absolute right-0 mt-2 p-2 rounded-md shadow-lg ${currentTheme.backgroundColor} border ${currentTheme.borderColor} z-10`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="flex flex-col gap-2">
                        {Object.keys(themeVariants).map((themeName) => (
                          <button
                            key={themeName}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md ${theme === themeName ? currentTheme.accentColor + " text-white" : "hover:bg-opacity-10 hover:bg-gray-500"}`}
                            onClick={() => {
                              setTheme(themeName);
                              setShowThemeSelector(false);
                            }}
                          >
                            {themeIconMap[themeName]}
                            <span className="capitalize">{themeName}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <motion.p
            className="mt-2 text-lg opacity-80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Generate custom themed crossword puzzles with AI
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Puzzle Generator Form */}
          <motion.div
            className="lg:col-span-1"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div
              className={`p-6 rounded-lg border ${currentTheme.borderColor} shadow-md`}
            >
              <h2 className="text-2xl font-bold mb-4">Generate Puzzle</h2>
              <PuzzleGenerator
                onPuzzleGenerated={handlePuzzleGenerated}
                isLoading={isLoading}
                themeStyles={currentTheme}
              />

              <div className="mt-4">
                <Button
                  onClick={generateRandomPuzzle}
                  disabled={isLoading}
                  className={`w-full ${currentTheme.buttonStyle}`}
                  variant="outline"
                >
                  I'm Feeling Lucky
                </Button>
              </div>

              {completedPuzzles.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">
                    Completed Puzzles
                  </h3>
                  <div className="space-y-2">
                    {completedPuzzles.map((p, index) => (
                      <motion.div
                        key={index}
                        className={`p-2 rounded border ${currentTheme.borderColor} cursor-pointer`}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setPuzzle(p)}
                      >
                        Puzzle #{index + 1} ({p.size}x{p.size})
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Crossword Grid */}
          <motion.div
            className="lg:col-span-2"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div
              className={`p-6 rounded-lg border ${currentTheme.borderColor} shadow-md h-full`}
            >
              <h2 className="text-2xl font-bold mb-4">Your Puzzle</h2>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <motion.div
                    className={`w-12 h-12 rounded-full ${currentTheme.accentColor}`}
                    animate={{
                      scale: [1, 1.5, 1],
                      rotate: [0, 180, 360],
                      borderRadius: ["50%", "20%", "50%"],
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </div>
              ) : puzzle ? (
                <CrosswordGrid
                  puzzleData={puzzle}
                  onComplete={handlePuzzleCompleted}
                />
              ) : (
                <div className="flex justify-center items-center h-64 text-gray-500">
                  No puzzle generated yet
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
