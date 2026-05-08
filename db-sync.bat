@echo off
echo [1/2] Syncing Prisma Schema to Supabase...
call npx prisma db push
if %ERRORLEVEL% NEQ 0 (
    echo Error: Prisma db push failed.
    pause
    exit /b %ERRORLEVEL%
)

echo [2/2] Seeding Production Data...
call npx prisma db seed
if %ERRORLEVEL% NEQ 0 (
    echo Error: Prisma db seed failed.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ==========================================
echo SUCCESS: Database is now synced and seeded!
echo ==========================================
echo.
echo Now go to Vercel and trigger a REDEPLOY.
pause
