call npm run build
if %errorlevel% neq 0 exit /b %errorlevel%
git add .
git commit -m "Fix TypeScript errors"
git push origin main
