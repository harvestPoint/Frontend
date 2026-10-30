# Renumera as telas da pasta screens sem buracos (01..14) e atualiza routes\index.tsx.
$ErrorActionPreference = 'Stop'
$scr = Join-Path $PSScriptRoot 'src\screens'
$ordem = 'DashboardPage','LeiturasPage','AlertasPage','LotesPage','LoteDetalhePage','JanelaColheitaPage','JanelaExportacaoPage','MercadoPage','LogisticaPage','PerfilPage','ProdutoresPage','PropriedadesPage','CulturasPage','SensoresPage'
$rotas = Join-Path $PSScriptRoot 'src\routes\index.tsx'
$texto = Get-Content -LiteralPath $rotas -Raw -Encoding UTF8
# passo 1: nomes temporarios (evita conflito entre 03_Leituras -> 02_Leituras etc.)
$i = 1
foreach ($nome in $ordem) {
  $velho = Get-ChildItem -LiteralPath $scr -Filter "*_$nome.tsx" | Select-Object -First 1
  if (-not $velho) { Write-Host "nao achei $nome"; continue }
  $novo = '{0:00}_{1}.tsx' -f $i, $nome
  $texto = $texto -replace [regex]::Escape("@/screens/" + $velho.BaseName + "'"), "@/screens/TMP_$($novo -replace '\.tsx$','')'"
  Rename-Item -LiteralPath $velho.FullName -NewName ("TMP_" + $novo)
  $i++
}
foreach ($f in Get-ChildItem -LiteralPath $scr -Filter 'TMP_*.tsx') { Rename-Item -LiteralPath $f.FullName -NewName ($f.Name -replace '^TMP_','') }
$texto = $texto -replace "@/screens/TMP_", "@/screens/"
Set-Content -LiteralPath $rotas -Value $texto -Encoding UTF8
Get-ChildItem -LiteralPath $scr | ForEach-Object { $_.Name }
