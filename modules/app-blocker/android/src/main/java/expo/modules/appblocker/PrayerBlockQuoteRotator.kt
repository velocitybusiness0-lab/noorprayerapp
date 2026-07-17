package expo.modules.appblocker

import android.os.Handler
import android.os.Looper
import android.widget.TextView

/** Cycles salah reminders on the block screen every few seconds. */
class PrayerBlockQuoteRotator(
  private val quoteView: TextView,
  private val intervalMs: Long = 5_000L,
) {
  private val handler = Handler(Looper.getMainLooper())
  private var index = 0
  private var running = false

  private val tick = object : Runnable {
    override fun run() {
      if (!running) return
      showCurrent()
      index = (index + 1) % PrayerBlockQuoteCatalog.entries.size
      handler.postDelayed(this, intervalMs)
    }
  }

  fun start() {
    if (running) return
    running = true
    index = 0
    showCurrent()
    index = 1 % PrayerBlockQuoteCatalog.entries.size
    handler.postDelayed(tick, intervalMs)
  }

  fun stop() {
    running = false
    handler.removeCallbacks(tick)
  }

  private fun showCurrent() {
    val entry = PrayerBlockQuoteCatalog.entries[index]
    quoteView.text = if (entry.source.isNullOrBlank()) {
      entry.text
    } else {
      "${entry.text}\n\n— ${entry.source}"
    }
  }
}
