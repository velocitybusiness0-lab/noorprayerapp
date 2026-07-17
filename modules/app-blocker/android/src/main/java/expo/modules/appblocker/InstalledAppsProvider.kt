package expo.modules.appblocker

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager

data class InstalledApp(
  val packageName: String,
  val label: String,
)

/** Lists user-launchable apps for the block picker (no QUERY_ALL_PACKAGES needed). */
class InstalledAppsProvider(private val context: Context) {
  fun listLaunchableApps(): List<InstalledApp> {
    val launcherIntent = Intent(Intent.ACTION_MAIN).apply {
      addCategory(Intent.CATEGORY_LAUNCHER)
    }

    val activities = context.packageManager.queryIntentActivities(
      launcherIntent,
      PackageManager.MATCH_DEFAULT_ONLY,
    )

    val seen = linkedSetOf<String>()
    val apps = mutableListOf<InstalledApp>()

    for (resolve in activities) {
      val packageName = resolve.activityInfo.packageName
      if (packageName == context.packageName) continue
      if (!seen.add(packageName)) continue

      val label = resolve.loadLabel(context.packageManager)?.toString()?.trim()
        ?: packageName
      apps.add(InstalledApp(packageName, label))
    }

    return apps.sortedBy { it.label.lowercase() }
  }
}
