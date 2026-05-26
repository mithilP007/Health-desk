# download-documents.ps1
$documents = @{
    # WHO PDF Guidelines
    "who-dengue-guidelines-2023.pdf" = "https://iris.who.int/bitstream/handle/10665/355020/9789240011910-eng.pdf"
    "who-malaria-factsheet.pdf" = "https://iris.who.int/bitstream/handle/10665/274382/WHO-CDS-GMP-2018.18-eng.pdf"
    "who-diabetes-guidelines.pdf" = "https://iris.who.int/bitstream/handle/10665/204871/9789241545254_eng.pdf"
    "who-hypertension-2021.pdf" = "https://iris.who.int/bitstream/handle/10665/344424/9789240037545-eng.pdf"
    "who-mental-health-2020.pdf" = "https://iris.who.int/bitstream/handle/10665/339620/9789240003922-eng.pdf"
    "who-tuberculosis-2020.pdf" = "https://iris.who.int/bitstream/handle/10665/336324/9789240030836-eng.pdf"
    "who-hiv-factsheet.pdf" = "https://iris.who.int/bitstream/handle/10665/342641/9789240015062-eng.pdf"
    "who-pneumonia-2019.pdf" = "https://iris.who.int/bitstream/handle/10665/325319/9789241550517-eng.pdf"
    "who-diarrhea-treatment.pdf" = "https://iris.who.int/bitstream/handle/10665/43209/9789241593187_eng.pdf"
    "who-nutrition-guidelines.pdf" = "https://iris.who.int/bitstream/handle/10665/42717/9241546123.pdf"
    
    # NIH/MedlinePlus HTML Pages (saved as requested)
    "nih-diabetes-overview.pdf" = "https://medlineplus.gov/diabetes.html"
    "nih-heart-disease.pdf" = "https://medlineplus.gov/heartdiseases.html"
    "nih-stroke.pdf" = "https://medlineplus.gov/stroke.html"
    "nih-cancer-basics.pdf" = "https://medlineplus.gov/cancer.html"
    "nih-asthma.pdf" = "https://medlineplus.gov/asthma.html"
    "nih-kidney-disease.pdf" = "https://medlineplus.gov/kidneydiseases.html"

    # CDC HTML Pages (saved as requested)
    "cdc-hypertension.pdf" = "https://www.cdc.gov/bloodpressure/index.htm"
    "cdc-heart-attack-signs.pdf" = "https://www.cdc.gov/heartdisease/signs_symptoms.htm"
    "cdc-first-aid.pdf" = "https://www.cdc.gov/disasters/firstaid.html"
}

$folder = "documents"
if (!(Test-Path $folder)) { New-Item -ItemType Directory -Path $folder }

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

foreach ($doc in $documents.GetEnumerator()) {
    $filepath = "$folder\$($doc.Key)"
    Write-Host "Downloading: $($doc.Key)..."
    try {
        # Custom User-Agent to bypass scraping restrictions
        Invoke-WebRequest -Uri $doc.Value -OutFile $filepath -UserAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" -TimeoutSec 60
        Write-Host "  ✅ Saved: $filepath" -ForegroundColor Green
    } catch {
        Write-Host "  ❌ Failed: $($doc.Key)" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)"
    }
}

Write-Host "`nDownload complete! Files in $folder"
Write-Host "Total files: $(@(Get-ChildItem $folder).Count)"
