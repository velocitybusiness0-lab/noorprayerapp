/** First visible letter for a user-created list name. */
export class DuaUserListLetter {
  static initial(name: string): string {
    const trimmed = name.trim();
    const match = trimmed.match(/[A-Za-z0-9\u0600-\u06FF]/);
    return (match?.[0] ?? "L").toUpperCase();
  }
}
