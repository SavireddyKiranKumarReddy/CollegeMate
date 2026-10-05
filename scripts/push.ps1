# Safe push helper — token is NOT stored in this repo.
# Token lives in $HOME\.collegemate_gh_token (outside the repo, ACL-restricted)
# plus Windows Credential Manager / ~/.git-credentials via `git credential approve`.
# Usage: powershell -File scripts/push.ps1
$ErrorActionPreference = 'Stop'
$tokFile = Join-Path $HOME '.collegemate_gh_token'
if (-not (Test-Path $tokFile)) {
  Write-Error ('Token file missing: ' + $tokFile)
}
$tok = (Get-Content $tokFile -Raw).Trim()
if (-not $tok) { Write-Error 'Token file is empty.' }
$nl = [Environment]::NewLine
$cred = 'protocol=https' + $nl + 'host=github.com' + $nl + 'username=x-access-token' + $nl + 'password=' + $tok + $nl + $nl
$cred | git credential approve
git push -u origin main --tags
