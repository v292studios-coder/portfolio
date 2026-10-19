$ErrorActionPreference = "Stop"
$baseDir = "images\Photos"
$categories = @("Studio", "Graduation", "headshots", "Beauty", "Automotive", "Product")

$portfolioData = @{}

foreach ($cat in $categories) {
    $catPath = Join-Path $baseDir $cat
    if (-not (Test-Path $catPath -PathType Container)) { continue }
    
    $portfolioData[$cat] = @()
    
    # Check for direct files in the category folder
    $directImages = @()
    $directCover = ""
    $directFiles = Get-ChildItem -Path $catPath -File | Where-Object { $_.Extension -match "\.(png|jpe?g|webp)$" }
    foreach ($file in $directFiles) {
        $imgPath = "images/Photos/$cat/$($file.Name)"
        $directImages += $imgPath
        if ($file.Name.StartsWith("cover-")) {
            $directCover = $imgPath
        }
    }
    
    if ($directImages.Count -gt 0) {
        if ($directCover -eq "") {
            $directCover = $directImages[0]
        }
        $shootObj = @{
            id = "$($cat.ToLower())-shoot"
            title = $cat
            category = $cat
            coverImage = $directCover
            images = $directImages
        }
        $portfolioData[$cat] += $shootObj
    }
    
    $shoots = Get-ChildItem -Path $catPath -Directory
    foreach ($shoot in $shoots) {
        $shootName = $shoot.Name
        $shootId = "$($cat.ToLower())-$($shootName.ToLower().Replace(' ', '-'))"
        $shootPath = $shoot.FullName
        
        $images = @()
        $coverImage = ""
        
        $files = Get-ChildItem -Path $shootPath -File | Where-Object { $_.Extension -match "\.(png|jpe?g|webp)$" }
        foreach ($file in $files) {
            $imgPath = "images/Photos/$cat/$shootName/$($file.Name)"
            $images += $imgPath
            if ($file.Name.StartsWith("cover-")) {
                $coverImage = $imgPath
            }
        }
        
        if ($coverImage -eq "" -and $images.Count -gt 0) {
            $coverImage = $images[0]
        }
        
        $shootObj = @{
            id = $shootId
            title = $shootName
            category = $cat
            coverImage = $coverImage
            images = $images
        }
        $portfolioData[$cat] += $shootObj
    }
}

$json = $portfolioData | ConvertTo-Json -Depth 10
$jsContent = "const portfolioData = $json;`n"
Set-Content -Path "portfolio-data.js" -Value $jsContent
Write-Host "Successfully generated portfolio-data.js"
