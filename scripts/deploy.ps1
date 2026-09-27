<#
.SYNOPSIS
  Builds, pushes and deploys the Geekalender Lambda functions.

.DESCRIPTION
  Images are tagged with the current commit's short SHA. The script builds and pushes any
  image not already in ECR, points each Lambda function at it, waits for the update and
  smoke-tests the function URL. The functions must already exist (see README).

.EXAMPLE
  npm run deploy                  # build and deploy api and web from HEAD
  npm run deploy -- -Target api   # api only
  npm run deploy -- -Tag 166d35b  # redeploy an image already in ECR, e.g. to roll back
#>
param(
  [ValidateSet('all', 'api', 'web')]
  [string]$Target = 'all',
  [string]$Tag,
  [string]$AwsProfile = 'geekalender',
  [string]$Region = 'eu-west-2'
)

$ErrorActionPreference = 'Stop'
$env:AWS_PROFILE = $AwsProfile
$env:AWS_DEFAULT_REGION = $Region
$env:AWS_PAGER = ''

# $ErrorActionPreference does not apply to native programs, so check their exit codes explicitly.
function Invoke-Native {
  param([scriptblock]$Command)
  & $Command
  if ($LASTEXITCODE -ne 0) { throw "Command failed with exit code ${LASTEXITCODE}: $Command" }
}

function Write-Step([string]$Message) {
  Write-Host "==> $Message" -ForegroundColor Cyan
}

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$dockerConfig = Join-Path $env:TEMP 'geekalender-docker'
Push-Location $repoRoot
try {
  # The web app calls the API, so the API is always deployed first.
  $apps = if ($Target -eq 'all') { @('api', 'web') } else { @($Target) }

  Write-Step 'Checking AWS credentials'
  $account = aws sts get-caller-identity --query Account --output text
  if ($LASTEXITCODE -ne 0) { throw "AWS credentials unavailable. Run: aws login --profile $AwsProfile" }
  $registry = "$account.dkr.ecr.$Region.amazonaws.com"

  if (-not $Tag) {
    if (git status --porcelain --untracked-files=no) {
      throw 'Tracked files have uncommitted changes. Commit or stash them so the image tag matches the code.'
    }
    $Tag = git rev-parse --short HEAD
  }
  Write-Host "Deploying $($apps -join ', ') at $Tag"

  # ECR tags are immutable, so an image already pushed for this commit is reused as-is.
  $toBuild = @()
  foreach ($app in $apps) {
    $found = aws ecr list-images --repository-name "geekalender/$app" --filter tagStatus=TAGGED `
      --query "length(imageIds[?imageTag=='$Tag'])" --output text
    if ($LASTEXITCODE -ne 0) { throw "Could not query ECR repository geekalender/$app" }

    if ($found -ne '0') {
      Write-Host "geekalender/${app}:$Tag is already in ECR, skipping build"
    } elseif ($PSBoundParameters.ContainsKey('Tag')) {
      throw "Image geekalender/${app}:$Tag not found in ECR"
    } else {
      $toBuild += $app
    }
  }

  if ($toBuild.Count -gt 0) {
    docker info --format '{{.ServerVersion}}' | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'Docker is not running. Start Docker Desktop and try again.' }

    foreach ($app in $toBuild) {
      Write-Step "Building $app"
      Invoke-Native { docker build --provenance=false --platform linux/amd64 -f "apps/$app/Dockerfile" -t "$registry/geekalender/${app}:$Tag" . }
    }

    # Windows Credential Manager cannot store ECR tokens (they exceed its ~2,500 character limit), so
    # log in using a throwaway Docker config that keeps the token in a file. The auths entry stops
    # Docker falling back to the Docker Desktop credential store. The file is deleted at the end.
    New-Item -ItemType Directory -Force $dockerConfig | Out-Null
    "{""auths"":{""$registry"":{}}}" | Set-Content (Join-Path $dockerConfig 'config.json') -Encoding ascii
    $env:DOCKER_CONFIG = $dockerConfig

    Write-Step 'Logging in to ECR'
    Invoke-Native { aws ecr get-login-password | docker login --username AWS --password-stdin $registry }

    foreach ($app in $toBuild) {
      Write-Step "Pushing $app"
      Invoke-Native { docker push "$registry/geekalender/${app}:$Tag" }
    }
  }

  foreach ($app in $apps) {
    $function = "geekalender-$app"
    Write-Step "Updating $function"
    Invoke-Native { aws lambda update-function-code --function-name $function --image-uri "$registry/geekalender/${app}:$Tag" --query LastUpdateStatus --output text }
    Invoke-Native { aws lambda wait function-updated-v2 --function-name $function }

    # Function URLs end with a slash. Invoke-WebRequest throws on any non-2xx status.
    $url = aws lambda get-function-url-config --function-name $function --query FunctionUrl --output text
    Write-Step "Smoke-testing $function"
    $health = Invoke-WebRequest -UseBasicParsing -TimeoutSec 30 "${url}health"
    Write-Host "  ${url}health -> $($health.StatusCode)"
    if ($app -eq 'web') {
      # The home page fetches from the API, so this also checks the web-to-API connection.
      $page = Invoke-WebRequest -UseBasicParsing -TimeoutSec 30 $url
      Write-Host "  $url -> $($page.StatusCode)"
    }
  }

  Write-Host "Deployed $($apps -join ', ') at $Tag" -ForegroundColor Green
} finally {
  Pop-Location
  Remove-Item (Join-Path $dockerConfig 'config.json') -ErrorAction SilentlyContinue
}
