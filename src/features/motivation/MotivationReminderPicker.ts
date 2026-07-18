import { MotivationReminderCatalog } from "./MotivationReminderCatalog";
import { MotivationCategoryId, MotivationReminder } from "./motivation.types";

/**
 * Cycles through curated reminders with a shuffled deck so picks feel infinite
 * and never repeat the same line twice in a row.
 */
export class MotivationReminderPicker {
  private deck: MotivationReminder[] = [];
  private lastId: string | null = null;

  constructor(
    private readonly categories: MotivationCategoryId[] | null = null,
    private readonly catalog = MotivationReminderCatalog
  ) {
    this.refillDeck();
  }

  /** Returns the next reminder, reshuffling when the deck runs out. */
  next(): MotivationReminder {
    if (this.deck.length === 0) {
      this.refillDeck();
    }
    if (this.deck.length === 0) {
      return {
        id: "empty",
        category: "motivation",
        text: "Enable at least one reminder type in settings.",
      };
    }

    let pick = this.deck.pop()!;
    if (pick.id === this.lastId && this.deck.length > 0) {
      const alternate = this.deck.pop()!;
      this.deck.push(pick);
      pick = alternate;
    } else if (pick.id === this.lastId && this.deck.length === 0) {
      this.refillDeck();
      const alternate = this.deck.find((r) => r.id !== this.lastId);
      if (alternate) {
        this.deck = this.deck.filter((r) => r.id !== alternate.id);
        pick = alternate;
      }
    }

    this.lastId = pick.id;
    return pick;
  }

  /** First reminder for initial render (advances the deck once). */
  peekInitial(): MotivationReminder {
    return this.next();
  }

  private refillDeck(): void {
    const pool =
      this.categories === null
        ? [...this.catalog.all()]
        : [...this.catalog.forCategories(this.categories)];
    this.deck = MotivationReminderPicker.shuffle(pool);

    if (
      this.lastId &&
      this.deck.length > 1 &&
      this.deck[this.deck.length - 1]?.id === this.lastId
    ) {
      const last = this.deck.pop()!;
      const swapAt = Math.floor(Math.random() * (this.deck.length - 1));
      this.deck.splice(swapAt, 0, last);
    }
  }

  private static shuffle<T>(items: T[]): T[] {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}
