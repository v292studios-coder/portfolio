$ErrorActionPreference = "Stop"

$token = "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"
$username = "v292studios-coder"
$repoName = "portfolio"

$gitPath = "C:\Program Files\Git\cmd\git.exe"

Write-Host "Initializing Git repository..."
& $gitPath init

Write-Host "Configuring Git..."
& $gitPath config user.name "292 Studios Coder"
& $gitPath config user.email "vishnu@example.com"
& $gitPath config core.safecrlf false

Write-Host "Adding files..."
& $gitPath add .

Write-Host "Committing..."
try {
    & $gitPath commit -m "Initial commit of portfolio website"
} catch {
    Write-Host "Nothing to commit or error during commit."
}

Write-Host "Setting main branch..."
& $gitPath branch -M main

Write-Host "Setting remote..."
$remoteUrl = "https://$username`:$token@github.com/$username/$repoName.git"
try {
    & $gitPath remote add origin $remoteUrl
} catch {
    & $gitPath remote set-url origin $remoteUrl
}

Write-Host "Pushing to GitHub..."
& $gitPath push -u origin main

Write-Host "Success! Upload complete."
