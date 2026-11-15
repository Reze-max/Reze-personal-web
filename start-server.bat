@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Serving from: %CD%
echo.
echo Open in browser: http://localhost:8000/
echo.
node --use-env-proxy server.mjs
