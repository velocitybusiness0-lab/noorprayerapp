# Starts Metro in a separate PowerShell window so Cursor terminals stay stable.
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

function Test-Metro([int]$Port) {
  try {
    $r = Invoke-WebRequest -Uri "http://127.0.0.1:$Port/status" -UseBasicParsing -TimeoutSec 2
    return ($r.Content -match "running")
  } catch {
    return $false
  }
}

$runningPort = $null
foreach ($p in @(8081, 8082, 8083)) {
  if (Test-Metro $p) {
    $runningPort = $p
    break
  }
}

if ($runningPort) {
  Write-Host "Metro already running on port $runningPort"
  Write-Host ("iPhone: exp+noor-prayer-app://expo-development-client/?url=http://192.168.4.104:" + $runningPort)
  exit 0
}

$port = 8081
$launcher = Join-Path $env:TEMP "miraj-metro-launcher.ps1"
$lines = @(
  '$Host.UI.RawUI.WindowTitle = "Miraj Metro (keep open)"'
  "Set-Location `"$root`""
  'Write-Host "Miraj Metro - keep this window open" -ForegroundColor Green'
  "Write-Host `"iPhone: exp+noor-prayer-app://expo-development-client/?url=http://192.168.4.104:$port`" -ForegroundColor Cyan"
  'Write-Host ""'
  "npx expo start --dev-client --port $port"
)
$lines | Set-Content -Path $launcher -Encoding ASCII

Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit","-ExecutionPolicy","Bypass","-File",$launcher
Write-Host "Opened Metro in a new Windows window on port $port"
Write-Host ("iPhone: exp+noor-prayer-app://expo-development-client/?url=http://192.168.4.104:" + $port)
