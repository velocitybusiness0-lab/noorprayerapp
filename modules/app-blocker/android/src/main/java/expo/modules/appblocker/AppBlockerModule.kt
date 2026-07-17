package expo.modules.appblocker

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.provider.Settings
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class AppBlockerModule : Module() {
  private val blockerRegistry: AppBlockerRegistry
    get() = AppBlockerRegistry.getInstance(requireContext())

  override fun definition() = ModuleDefinition {
    Name("AppBlocker")

    Function("isSupported") {
      true
    }

    Function("isAccessibilityEnabled") {
      isAccessibilityServiceEnabled(requireContext())
    }

    Function("openAccessibilitySettings") {
      val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS).apply {
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }
      requireContext().startActivity(intent)
    }

    AsyncFunction("getInstalledApps") {
      InstalledAppsProvider(requireContext())
        .listLaunchableApps()
        .map { mapOf("packageName" to it.packageName, "label" to it.label) }
    }

    Function("setBlockedPackages") { packages: List<String> ->
      blockerRegistry.setBlockedPackages(packages)
    }

    Function("getBlockedPackages") {
      blockerRegistry.blockedPackages().toList()
    }

    Function("setMonitoringEnabled") { enabled: Boolean ->
      blockerRegistry.monitoringEnabled = enabled
    }

    Function("isMonitoringEnabled") {
      blockerRegistry.monitoringEnabled
    }
  }

  private fun requireContext(): Context {
    return appContext.reactContext?.applicationContext
      ?: throw IllegalStateException("React context is not available")
  }

  private fun isAccessibilityServiceEnabled(context: Context): Boolean {
    val enabled = Settings.Secure.getString(
      context.contentResolver,
      Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES,
    ) ?: return false
    val serviceId = ComponentName(context, AppBlockerAccessibilityService::class.java).flattenToString()
    return enabled.split(':').any { it.equals(serviceId, ignoreCase = true) }
  }
}
