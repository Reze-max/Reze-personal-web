@echo off
chcp 65001 >nul
cd /d "C:\Users\33397\Python\trae test\个人网站\portfolio-site"
echo Serving from: %CD%
echo.
echo Open in browser: http://localhost:8000/preview.html
echo.
python -m http.server 8000
