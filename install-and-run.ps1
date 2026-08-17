# سكربت PowerShell لتثبيت وتشغيل المشروع
# حفظ الملف باسم install-and-run.ps1 ثم تشغيله عبر PowerShell

Write-Host "1) التحقق من وجود Node.js و npm..." -ForegroundColor Cyan
$node = (Get-Command node -ErrorAction SilentlyContinue)
$npm = (Get-Command npm -ErrorAction SilentlyContinue)

if (-not $node) {
    Write-Host "Node.js غير مثبت أو غير موجود في PATH. يجب تثبيت Node.js 18+ من https://nodejs.org/ ثم إعادة التشغيل." -ForegroundColor Red
    exit 1
}

$nodeVersion = node -v
$npmVersion = npm -v
Write-Host "Node:" $nodeVersion " npm:" $npmVersion -ForegroundColor Green

if (-not (Test-Path package.json)) {
    Write-Host "لم أجد package.json في المجلد الحالي. تأكد أنك في جذر المشروع." -ForegroundColor Red
    exit 1
}

$policy = Get-ExecutionPolicy
if ($policy -eq 'Restricted') {
    Write-Host "سياسة التنفيذ تمنع تشغيل السكربتات. سأضبط سياسة التنفيذ مؤقتًا لهذه الجلسة." -ForegroundColor Yellow
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
}

Write-Host "2) تثبيت الاعتماديات (npm install)..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "خطأ أثناء npm install. انسخ الخطأ وأرسله لي." -ForegroundColor Red
    exit 1
}

Write-Host "3) تشغيل الخادم في وضع التطوير (http://localhost:3000)..." -ForegroundColor Cyan
Write-Host "اضغط Ctrl+C لإيقاف الخادم لاحقًا." -ForegroundColor Yellow
npm run dev
