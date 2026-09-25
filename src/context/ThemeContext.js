import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

const ThemeContext = createContext({ dark: false, toggleDark: () => {} });

function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("dark");
      setDark(
        stored === null
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
          : stored === "true"
      );
    } catch {
      // Storage can be unavailable; the theme toggle still works for this visit.
    }
  }, []);
  const value = useMemo(
    () => ({
      dark,
      toggleDark: () => {
        const next = !dark;
        setDark(next);
        try {
          window.localStorage.setItem("dark", String(next));
        } catch {
          // Persistence is optional, changing the theme is not.
        }
      }
    }),
    [dark]
  );
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

const useTheme = () => useContext(ThemeContext);
export default ThemeContext;
export { ThemeProvider, useTheme };
