Remove-Item .\node_modules -Force -Recurse
Write-Output("Top node_modules cleared")
Remove-Item .\packages\client\node_modules -Force -Recurse
Write-Output("Client node_modules cleared")
Remove-Item .\packages\server\node_modules -Force -Recurse
Write-Output("Server node_modules cleared")

yarn workspace server add uuid
