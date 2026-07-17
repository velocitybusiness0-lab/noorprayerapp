package expo.modules.appblocker

import android.content.Intent
import android.view.accessibility.AccessibilityEvent
import androidx.core.content.ContextCompat
import android.accessibilityservice.AccessibilityService

/**
 * Watches the foreground app during focus/prayer time and intercepts blocked packages.
 */
class AppBlockerAccessibilityService : AccessibilityService() {
  override fun onServiceConnected() {
    super.onServiceConnected()
    val registry = AppBlockerRegistry.getInstance(this)
    registry.hostPackageName = packageName
  }

  override fun onAccessibilityEvent(event: AccessibilityEvent?) {
    if (event == null) return
    if (event.eventType != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) return

    val packageName = event.packageName?.toString() ?: return
    val registry = AppBlockerRegistry.getInstance(this)
    if (!registry.shouldBlock(packageName)) return
    if (registry.isBlockScreenShowing) return
    if (!registry.canTriggerBlock(packageName)) return

    val blockIntent = Intent(this, PrayerBlockActivity::class.java).apply {
      addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
      putExtra(PrayerBlockActivity.EXTRA_BLOCKED_PACKAGE, packageName)
    }
    ContextCompat.startActivity(this, blockIntent, null)
  }

  override fun onInterrupt() = Unit
}
