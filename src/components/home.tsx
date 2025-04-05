import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Moon, Sun, Palette } from "lucide-react";
import PuzzleGenerator from "./PuzzleGenerator";
import CrosswordGrid from "./CrosswordGrid";
import { useTheme } from "./ThemeProvider";

const Home = () => {
  const { theme, setTheme } = useTheme();
  const [puzzle, setPuzzle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  // Mock puzzle data for initial display
  const mockPuzzle = {
    grid: [
      ["C", "R", "O", "S", "S"],
      ["W", "", "O", "", ""],
      ["O", "", "R", "", ""],
      ["R", "", "D", "", ""],
      ["D", "", "", "", ""],
    ],
    clues: {
      across: [
        { number: 1, clue: "A puzzle with words crossing", answer: "CROSS" },
      ],
      down: [
        { number: 1, clue: "What this puzzle is called", answer: "CROSSWORD" },
      ],
    },
  };

  useEffect(() => {
    // Set mock puzzle data on initial load
    if (!puzzle) {
      setPuzzle(mockPuzzle);
    }
  }, []);

  const handlePuzzleGenerated = (newPuzzle) => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setPuzzle(newPuzzle || mockPuzzle);
      setIsLoading(false);
    }, 1500);
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

            <div className="relative">
              <motion.button
                className={`p-2 rounded-full ${currentTheme.borderColor} border-2`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowThemeSelector(!showThemeSelector)}
              >
                <Settings className="h-5 w-5" />
              </motion.button>

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
                <CrosswordGrid puzzle={puzzle} themeStyles={currentTheme} />
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
