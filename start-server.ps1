$ErrorActionPreference = 'Stop'
$workDir = "C:\Users\33397\Python\trae test\个人网站\portfolio-site"
Write-Host "Starting HTTP server in: $workDir"
Write-Host "Open in browser: http://localhost:8000/preview.html"
Write-Host ""
Set-Location $workDir
& python -m http.server 8000
