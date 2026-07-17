package expo.modules.appblocker

import android.content.Context

/** Shared prefs for blocked packages and monitoring state (read by the accessibility service). */
class AppBlockerRegistry(context: Context) {
  private val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

  var monitoringEnabled: Boolean
    get() = prefs.getBoolean(KEY_MONITORING, false)
    set(value) = prefs.edit().putBoolean(KEY_MONITORING, value).apply()

  var hostPackageName: String
    get() = prefs.getString(KEY_HOST_PACKAGE, "") ?: ""
    set(value) = prefs.edit().putString(KEY_HOST_PACKAGE, value).apply()

  var isBlockScreenShowing: Boolean
    get() = prefs.getBoolean(KEY_BLOCK_SCREEN_SHOWING, false)
    set(value) = prefs.edit().putBoolean(KEY_BLOCK_SCREEN_SHOWING, value).apply()

  fun blockedPackages(): Set<String> =
    prefs.getStringSet(KEY_BLOCKED, emptySet())?.toSet() ?: emptySet()

  fun setBlockedPackages(packages: Collection<String>) {
    prefs.edit().putStringSet(KEY_BLOCKED, packages.toSet()).apply()
  }

  fun shouldBlock(packageName: String): Boolean {
    if (!monitoringEnabled || packageName.isBlank()) return false
    if (packageName == hostPackageName) return false
    if (packageName in SYSTEM_ALLOWLIST) return false
    return packageName in blockedPackages()
  }

  fun canTriggerBlock(packageName: String, cooldownMs: Long = BLOCK_COOLDOWN_MS): Boolean {
    val now = System.currentTimeMillis()
    val lastPackage = prefs.getString(KEY_LAST_BLOCKED_PACKAGE, null)
    val lastAt = prefs.getLong(KEY_LAST_BLOCKED_AT, 0L)
    val dismissedAt = prefs.getLong(KEY_DISMISSED_AT, 0L)
    if (lastPackage == packageName && now - lastAt < cooldownMs) return false
    if (lastPackage == packageName && now - dismissedAt < DISMISS_COOLDOWN_MS) return false
    prefs.edit()
      .putString(KEY_LAST_BLOCKED_PACKAGE, packageName)
      .putLong(KEY_LAST_BLOCKED_AT, now)
      .apply()
    return true
  }

  fun markDismissed() {
    prefs.edit().putLong(KEY_DISMISSED_AT, System.currentTimeMillis()).apply()
  }

  companion object {
    private const val PREFS_NAME = "miraj_app_blocker"
    private const val KEY_MONITORING = "monitoring_enabled"
    private const val KEY_BLOCKED = "blocked_packages"
    private const val KEY_HOST_PACKAGE = "host_package"
    private const val KEY_LAST_BLOCKED_PACKAGE = "last_blocked_package"
    private const val KEY_LAST_BLOCKED_AT = "last_blocked_at"
    private const val KEY_BLOCK_SCREEN_SHOWING = "block_screen_showing"
    private const val KEY_DISMISSED_AT = "dismissed_at"
    private const val BLOCK_COOLDOWN_MS = 2_000L
    private const val DISMISS_COOLDOWN_MS = 5_000L

    private val SYSTEM_ALLOWLIST = setOf(
      "com.android.settings",
      "com.google.android.settings.intelligence",
    )

    @Volatile
    private var instance: AppBlockerRegistry? = null

    fun getInstance(context: Context): AppBlockerRegistry {
      return instance ?: synchronized(this) {
        instance ?: AppBlockerRegistry(context.applicationContext).also { instance = it }
      }
    }
  }
}
