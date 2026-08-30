@echo off
chcp 65001 >nul
title oblivion 个人网站 - 一键关闭
cd /d "%~dp0"

echo ============================================
echo   oblivion 个人网站 - 一键关闭
echo ============================================
echo.

call npx astro dev stop
if errorlevel 1 (
    echo.
    echo [提示] 服务器未在运行，或已停止。
)

echo.
echo 完成！可以关闭本窗口。
pause
