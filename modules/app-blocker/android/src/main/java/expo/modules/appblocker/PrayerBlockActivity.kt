package expo.modules.appblocker

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity

/** Full-screen reminder shown when a blocked app is opened during salah. */
class PrayerBlockActivity : AppCompatActivity() {
  private val registry by lazy { AppBlockerRegistry.getInstance(this) }
  private var quoteRotator: PrayerBlockQuoteRotator? = null

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    registry.isBlockScreenShowing = true
    setContentView(R.layout.activity_prayer_block)

    val quoteView = findViewById<TextView>(R.id.prayer_block_quote)
    quoteRotator = PrayerBlockQuoteRotator(quoteView).also { it.start() }

    findViewById<Button>(R.id.prayer_block_dismiss).setOnClickListener {
      stayFocused()
    }

    onBackPressedDispatcher.addCallback(
      this,
      object : OnBackPressedCallback(true) {
        override fun handleOnBackPressed() {
          stayFocused()
        }
      },
    )
  }

  override fun onDestroy() {
    quoteRotator?.stop()
    quoteRotator = null
    registry.isBlockScreenShowing = false
    super.onDestroy()
  }

  private fun stayFocused() {
    registry.markDismissed()
    goHome()
    finishAndRemoveTask()
  }

  private fun goHome() {
    val home = Intent(Intent.ACTION_MAIN).apply {
      addCategory(Intent.CATEGORY_HOME)
      addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    }
    startActivity(home)
  }

  companion object {
    const val EXTRA_BLOCKED_PACKAGE = "blocked_package"
  }
}
