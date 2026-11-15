$ErrorActionPreference = 'Stop'
$workDir = $PSScriptRoot
Write-Host "Starting HTTP server in: $workDir"
Write-Host "Open in browser: http://localhost:8000/"
Write-Host ""
Set-Location $workDir
& node --use-env-proxy server.mjs
