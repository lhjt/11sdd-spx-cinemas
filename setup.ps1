Write-Output "Starting setup process..."
Write-Output "Installing modules..."
.\reinstallModules.ps1

$env:NODE_ENV = "setup"

Write-Output "Seeding database..."
yarn workspace server generate

Write-Output "Complete! You can now run `"yarn dev`" to run the server!"
