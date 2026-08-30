@echo off
chcp 65001 >nul
title oblivion 个人网站 - 一键启动
cd /d "%~dp0"

echo ============================================
echo   oblivion 个人网站 - 一键启动
echo ============================================
echo.

rem 检查开发服务器是否已在运行
netstat -ano | findstr ":4321" | findstr "LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo [提示] 开发服务器已在运行（端口 4321），直接打开浏览器。
    goto open_browser
)

echo [1/3] 启动开发服务器（后台模式）...
call npx astro dev --background
if errorlevel 1 (
    echo.
    echo [错误] 启动失败。请先确认依赖已安装：npm install
    pause
    exit /b 1
)

echo.
echo [2/3] 等待服务器就绪（最多 20 秒）...
set /a tries=0
:wait_loop
set /a tries+=1
if %tries% gtr 20 goto open_browser
netstat -ano | findstr ":4321" | findstr "LISTENING" >nul 2>&1
if errorlevel 1 (
    timeout /t 1 /nobreak >nul
    goto wait_loop
)

:open_browser
echo [3/3] 打开浏览器...
start "" http://localhost:4321
echo.
echo 完成！访问地址： http://localhost:4321
echo 停止服务器请双击 stop.bat
echo.
pause
