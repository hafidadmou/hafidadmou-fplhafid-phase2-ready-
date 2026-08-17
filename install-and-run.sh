#!/usr/bin/env bash
set -e
echo "1) التحقق من Node و npm..."
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js غير مثبت. قم بتثبيته من https://nodejs.org/ ثم أعد المحاولة." >&2
  exit 1
fi
echo "Node: $(node -v)  npm: $(npm -v)"

if [ ! -f package.json ]; then
  echo "لم أجد package.json في المجلد الحالي. تأكد أنك في جذر المشروع."
  exit 1
fi

echo "2) npm install..."
npm install

echo "3) تشغيل الخادم (http://localhost:3000)..."
npm run dev
