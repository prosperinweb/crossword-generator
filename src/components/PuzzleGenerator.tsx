import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface PuzzleGeneratorProps {
  onPuzzleGenerated: (puzzle: PuzzleData) => void;
}

export interface PuzzleData {
  grid: string[][];
  clues: {
    across: Record<string, string>;
    down: Record<string, string>;
  };
  size: number;
}

const themes = [
  { value: "general", label: "General Knowledge" },
  { value: "astrology", label: "Astrology" },
  { value: "cinema", label: "Cinema" },
  { value: "history", label: "History" },
  { value: "science", label: "Science" },
  { value: "literature", label: "Literature" },
  { value: "geography", label: "Geography" },
  { value: "music", label: "Music" },
  { value: "sports", label: "Sports" },
  { value: "food", label: "Food & Cuisine" },
];

const PuzzleGenerator: React.FC<PuzzleGeneratorProps> = ({
  onPuzzleGenerated = () => {},
}) => {
  const { currentTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState("general");
  const [difficulty, setDifficulty] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDifficultyChange = (value: number[]) => {
    setDifficulty(value[0]);
  };

  const generatePuzzle = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock API call - in a real implementation, this would call the Gemini API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock response data
      const mockPuzzle: PuzzleData = {
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
      };

      onPuzzleGenerated(mockPuzzle);
    } catch (err) {
      setError("Failed to generate puzzle. Please try again.");
      console.error("Error generating puzzle:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getThemeStyles = () => {
    switch (currentTheme) {
      case "vintage":
        return "bg-amber-50 text-amber-900 border-amber-200";
      case "neon":
        return "bg-black text-green-400 border-purple-500 shadow-[0_0_15px_rgba(124,58,237,0.5)]";
      case "magazine":
        return "bg-white text-gray-800 border-gray-200";
      default:
        return "bg-white";
    }
  };

  const getButtonStyles = () => {
    switch (currentTheme) {
      case "vintage":
        return "bg-amber-800 hover:bg-amber-700 text-amber-50";
      case "neon":
        return "bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_10px_rgba(124,58,237,0.7)]";
      case "magazine":
        return "bg-black hover:bg-gray-800 text-white";
      default:
        return "";
    }
  };

  const getDifficultyLabel = () => {
    if (difficulty < 33) return "Easy";
    if (difficulty < 66) return "Medium";
    return "Hard";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-xl mx-auto"
    >
      <Card className={`${getThemeStyles()} transition-all duration-300`}>
        <CardHeader>
          <CardTitle
            className={`text-center ${currentTheme === "vintage" ? "font-serif" : ""}`}
          >
            Create Your Crossword
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Puzzle Theme</label>
            <Select value={selectedTheme} onValueChange={setSelectedTheme}>
              <SelectTrigger
                className={`w-full ${currentTheme === "neon" ? "border-purple-500 bg-gray-900" : ""}`}
              >
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                {themes.map((theme) => (
                  <SelectItem key={theme.value} value={theme.value}>
                    {theme.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Difficulty</label>
              <span className="text-sm font-medium">
                {getDifficultyLabel()}
              </span>
            </div>
            <Slider
              value={[difficulty]}
              min={0}
              max={100}
              step={1}
              onValueChange={handleDifficultyChange}
              className={currentTheme === "neon" ? "bg-purple-900" : ""}
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="pt-2"
          >
            <Button
              onClick={generatePuzzle}
              disabled={isLoading}
              className={`w-full ${getButtonStyles()}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Crossword"
              )}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PuzzleGenerator;
