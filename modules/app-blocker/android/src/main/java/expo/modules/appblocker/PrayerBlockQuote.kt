package expo.modules.appblocker

/** One motivational line shown on the prayer-time block screen. */
data class PrayerBlockQuote(
  val text: String,
  val source: String? = null,
)

/** Reminders and quotes about salah — rotated on the block screen. */
object PrayerBlockQuoteCatalog {
  val entries: List<PrayerBlockQuote> = listOf(
    PrayerBlockQuote("It is time for salah. Leave what you are doing and answer the call."),
    PrayerBlockQuote("The first deed you will be asked about is prayer.", "Hadith"),
    PrayerBlockQuote("When you stand for prayer, you stand before Allah."),
    PrayerBlockQuote("Verily, prayer keeps you from shameful and unjust deeds.", "Qur'an 29:45"),
    PrayerBlockQuote("The coolness of my eyes was placed in prayer.", "Hadith"),
    PrayerBlockQuote("Successful indeed are the believers — those who are humble in their prayers.", "Qur'an 23:1–2"),
    PrayerBlockQuote("Prayer is the pillar of your faith. Do not let it fall."),
    PrayerBlockQuote("Allah does not burden a soul beyond what it can bear.", "Qur'an 2:286"),
    PrayerBlockQuote("Turn to Allah — He is near, and He hears every sincere call."),
    PrayerBlockQuote("Five daily prayers are a meeting with your Lord. Do not miss it."),
    PrayerBlockQuote("The difference between us and them is prayer — do not neglect it.", "Hadith"),
    PrayerBlockQuote("Seek help through patience and prayer.", "Qur'an 2:45"),
  )
}
