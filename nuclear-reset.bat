@echo off
echo [1/6] Deleting old node_modules...
rmdir /s /q node_modules

echo [2/6] Deleting build cache...
rmdir /s /q .next

echo [3/6] Deleting old lockfiles...
del /q package-lock.json
del /q pnpm-lock.yaml

echo [4/6] Installing fresh dependencies...
call npm install

echo [5/6] Committing fresh lockfile...
git add .
git commit -m "Nuclear Reset: Fresh lockfile for Vercel"

echo [6/6] Pushing to GitHub...
git push -u origin main

echo Done! Now go to Vercel to recreate the project.
