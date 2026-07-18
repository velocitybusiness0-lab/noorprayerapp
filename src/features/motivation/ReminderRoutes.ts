import { Href } from "expo-router";

/** Typed path helpers for the Reminders experience. */
export class ReminderRoutes {
  static feed(): Href {
    return "/reminders" as Href;
  }
}
