#!/usr/bin/env bash
set -euo pipefail

export PATH="${HOME}/bin:${PATH}"

cd "$(dirname "$0")/.."

echo "→ Проверка GitHub CLI…"
if ! gh auth status >/dev/null 2>&1; then
  echo "Сначала войдите в GitHub: gh auth login"
  exit 1
fi

echo "→ Репозиторий GitHub…"
if git remote get-url origin >/dev/null 2>&1; then
  git push -u origin main
else
  gh repo create TemnovTema/toxichnik --public --source=. --remote=origin --push
fi

echo "→ Деплой на Vercel…"
if ! npx vercel@latest whoami >/dev/null 2>&1; then
  echo "Сначала войдите в Vercel: npx vercel@latest login"
  exit 1
fi

npx vercel@latest --prod

echo ""
echo "Готово."
echo "GitHub: https://github.com/TemnovTema/toxichnik"
