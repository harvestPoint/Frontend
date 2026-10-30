# Reorganiza as telas do HarvestPoint: principais juntas (em ordem do roteiro) e telas publicas a parte.
# Uso (PowerShell), dentro da pasta apps\web:
#   .\reorganizar.ps1
# So MOVE arquivos (nada e apagado, exceto pastas que ficarem vazias). Os imports sao corrigidos depois.
$ErrorActionPreference = 'Stop'
$src = Join-Path $PSScriptRoot 'src'
if (-not (Test-Path -LiteralPath (Join-Path $src 'features'))) { Write-Host 'Nao achei src\features (ja reorganizado?)'; exit 1 }

function Mover($de, $para) {
  $a = Join-Path $src $de
  $b = Join-Path $src $para
  if (Test-Path -LiteralPath $a) {
    New-Item -ItemType Directory -Force -Path (Split-Path $b) | Out-Null
    Move-Item -LiteralPath $a -Destination $b
    Write-Host "OK   $de -> $para"
  } else { Write-Host "pulou (nao existe): $de" }
}

# --- telas principais, na ordem do roteiro ---
$principais = @(
  @('dashboard\pages\DashboardPage.tsx',             'screens\01_DashboardPage.tsx'),
  @('clima\pages\ClimaRegionalPage.tsx',             'screens\02_ClimaRegionalPage.tsx'),
  @('leituras\pages\LeiturasPage.tsx',               'screens\03_LeiturasPage.tsx'),
  @('automacao\pages\AutomacaoPage.tsx',             'screens\04_AutomacaoPage.tsx'),
  @('alertas\pages\AlertasPage.tsx',                 'screens\05_AlertasPage.tsx'),
  @('lotes\pages\LotesPage.tsx',                     'screens\06_LotesPage.tsx'),
  @('lotes\pages\LoteDetalhePage.tsx',               'screens\07_LoteDetalhePage.tsx'),
  @('inteligencia\pages\JanelaColheitaPage.tsx',     'screens\08_JanelaColheitaPage.tsx'),
  @('inteligencia\pages\JanelaExportacaoPage.tsx',   'screens\09_JanelaExportacaoPage.tsx'),
  @('mercado\pages\MercadoPage.tsx',                 'screens\10_MercadoPage.tsx'),
  @('logistica\pages\LogisticaPage.tsx',             'screens\11_LogisticaPage.tsx'),
  @('conta\pages\PerfilPage.tsx',                    'screens\12_PerfilPage.tsx'),
  @('cadastros\produtores\pages\ProdutoresPage.tsx', 'screens\13_ProdutoresPage.tsx'),
  @('cadastros\propriedades\pages\PropriedadesPage.tsx', 'screens\14_PropriedadesPage.tsx'),
  @('cadastros\culturas\pages\CulturasPage.tsx',     'screens\15_CulturasPage.tsx'),
  @('cadastros\sensores\pages\SensoresPage.tsx',     'screens\16_SensoresPage.tsx')
)
# --- telas publicas ---
$publicas = @(
  @('landing\pages\LandingPage.tsx',                 'screens-public\1_LandingPage.tsx'),
  @('landing\LandingPage.antiga.txt',                'screens-public\LandingPage.antiga.txt'),
  @('auth\pages\LoginPage.tsx',                      'screens-public\2_LoginPage.tsx'),
  @('auth\pages\SignupPage.tsx',                     'screens-public\3_SignupPage.tsx'),
  @('landing\components\AutomacaoDemo.tsx',          'screens-public\AutomacaoDemo.tsx')
)
# --- pedacos reutilizaveis ---
$outros = @(
  @('dashboard\components\ClimaComparativo.tsx',     'components\ClimaComparativo.tsx'),
  @('lotes\components\LotesVazioState.tsx',          'components\LotesVazioState.tsx'),
  @('mercado\components\OrigemPill.tsx',             'components\OrigemPill.tsx'),
  @('clima\components\PrevisaoRegua.tsx',            'components\PrevisaoRegua.tsx'),
  @('clima\data\previsaoMock.ts',                    'data\previsaoMock.ts'),
  # modulo de automacao (so existe na pasta Harvestpoint): fica junto, fora das telas
  @('automacao\api.ts',                              'automacao\api.ts'),
  @('automacao\automacao.css',                       'automacao\automacao.css'),
  @('automacao\store.ts',                            'automacao\store.ts'),
  @('automacao\types.ts',                            'automacao\types.ts'),
  @('automacao\components',                          'automacao\components'),
  @('automacao\data',                                'automacao\data')
)
# o modulo automacao sai de features\automacao para automacao\ (mesmo nome): move via pasta temporaria
foreach ($par in $principais + $publicas) { Mover ('features\' + $par[0]) $par[1] }
foreach ($par in $outros) {
  if ($par[0] -like 'automacao\*') {
    $a = Join-Path $src ('features\' + $par[0]); $b = Join-Path $src $par[1]
    if (Test-Path -LiteralPath $a) { New-Item -ItemType Directory -Force -Path (Split-Path $b) | Out-Null; Move-Item -LiteralPath $a -Destination $b; Write-Host "OK   $($par[0]) -> $($par[1])" }
  } else { Mover ('features\' + $par[0]) $par[1] }
}

# apaga a pasta features se sobrou so pasta vazia
$restam = Get-ChildItem -LiteralPath (Join-Path $src 'features') -Recurse -File -ErrorAction SilentlyContinue
if (-not $restam) { Remove-Item -LiteralPath (Join-Path $src 'features') -Recurse -Force; Write-Host 'Pasta features removida (estava vazia).' }
else { Write-Host 'ATENCAO: sobraram arquivos em features:'; $restam | ForEach-Object { $_.FullName } }
Write-Host 'Pronto. Agora me avise para eu corrigir os imports.'
