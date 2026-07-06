import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import { storage } from "@/core/storage/StorageManager";
import { StorageKeys } from "@/core/storage/storageKeys";
import { Theme, ThemeMode, themeForScheme } from "./theme";

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function readInitialMode(): ThemeMode {
  return (storage.getString(StorageKeys.themeMode) as ThemeMode) ?? "light";
}

/**
 * Provides the resolved `Theme` to the whole app and persists the user's
 * chosen mode. Defaults to light (peaceful pastels). "system" follows the OS.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>(readInitialMode);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    storage.setString(StorageKeys.themeMode, next);
  }, []);

  const isDark = mode === "system" ? systemScheme !== "light" : mode === "dark";

  const value = useMemo<ThemeContextValue>(
    () => ({ theme: themeForScheme(isDark), mode, setMode }),
    [isDark, mode, setMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx.theme;
}

export function useThemeMode(): { mode: ThemeMode; setMode: (m: ThemeMode) => void } {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeMode must be used within ThemeProvider");
  return { mode: ctx.mode, setMode: ctx.setMode };
}
