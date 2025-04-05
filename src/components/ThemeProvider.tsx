import React, { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ThemeType = "vintage" | "neon" | "magazine";

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  isChanging: boolean;
}

const defaultThemeContext: ThemeContextType = {
  theme: "vintage",
  setTheme: () => {},
  isChanging: false,
};

const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeType;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = "vintage",
}) => {
  const [theme, setThemeState] = useState<ThemeType>(defaultTheme);
  const [isChanging, setIsChanging] = useState(false);

  const setTheme = (newTheme: ThemeType) => {
    if (newTheme === theme) return;

    setIsChanging(true);
    setTimeout(() => {
      setThemeState(newTheme);
      setTimeout(() => setIsChanging(false), 600); // Match animation duration
    }, 300);
  };

  useEffect(() => {
    // Apply theme CSS variables to document root
    const root = document.documentElement;
    root.classList.remove("theme-vintage", "theme-neon", "theme-magazine");
    root.classList.add(`theme-${theme}`);

    // Set CSS variables based on theme
    if (theme === "vintage") {
      root.style.setProperty("--background", "#f5f0e1");
      root.style.setProperty("--foreground", "#5c4b3c");
      root.style.setProperty("--primary", "#8b6e4e");
      root.style.setProperty("--primary-foreground", "#f5f0e1");
      root.style.setProperty("--secondary", "#d1b894");
      root.style.setProperty("--accent", "#a67c52");
      root.style.setProperty("--muted", "#e6dcc6");
      root.style.setProperty("--border", "#c9b38c");
      root.style.setProperty("--correct", "#7d9b76");
      root.style.setProperty("--incorrect", "#c17767");
    } else if (theme === "neon") {
      root.style.setProperty("--background", "#0f0f1a");
      root.style.setProperty("--foreground", "#ffffff");
      root.style.setProperty("--primary", "#ff00ff");
      root.style.setProperty("--primary-foreground", "#ffffff");
      root.style.setProperty("--secondary", "#00ffff");
      root.style.setProperty("--accent", "#ffff00");
      root.style.setProperty("--muted", "#1a1a2e");
      root.style.setProperty("--border", "#ff00ff");
      root.style.setProperty("--correct", "#00ff00");
      root.style.setProperty("--incorrect", "#ff0000");
    } else if (theme === "magazine") {
      root.style.setProperty("--background", "#ffffff");
      root.style.setProperty("--foreground", "#1a1a1a");
      root.style.setProperty("--primary", "#e63946");
      root.style.setProperty("--primary-foreground", "#ffffff");
      root.style.setProperty("--secondary", "#457b9d");
      root.style.setProperty("--accent", "#1d3557");
      root.style.setProperty("--muted", "#f1faee");
      root.style.setProperty("--border", "#a8dadc");
      root.style.setProperty("--correct", "#2a9d8f");
      root.style.setProperty("--incorrect", "#e76f51");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isChanging }}>
      <div className="theme-transition-container bg-background min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen"
          >
            {children}
          </motion.div>
        </AnimatePresence>
        {isChanging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background z-50 flex items-center justify-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="w-16 h-16 border-4 border-primary rounded-full border-t-transparent"
            />
          </motion.div>
        )}
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
