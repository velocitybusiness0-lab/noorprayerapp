import { useAppBootstrap } from "./useAppBootstrap";

/** Headless component running all app-level scheduling side effects. */
export function AppBootstrap(): null {
  useAppBootstrap();
  return null;
}
