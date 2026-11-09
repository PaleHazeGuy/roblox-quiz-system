#!/usr/bin/env bash
set -u

root="$(cd "$(dirname "$0")" && pwd)"
logs="$root/.dev-logs"
mkdir -p "$logs"

started=()

stop_all() {
  trap - INT TERM EXIT
  echo
  echo "stopping..."
  for pid in "${started[@]}"; do
    kill -- "-$pid" 2>/dev/null
  done
  wait 2>/dev/null
}
trap stop_all INT TERM EXIT

port_in_use() {
  ss -ltn | grep -q ":$1 "
}

already_running() {
  case "$1" in
    port:*) port_in_use "${1#port:}" ;;
    proc:*) pgrep -f "${1#proc:}" > /dev/null ;;
    *) return 1 ;;
  esac
}

run() {
  local name="$1" check="$2" dir="$3"
  shift 3
  if already_running "$check"; then
    echo "skipped  $name (already running)"
    return
  fi
  setsid bash -c "cd '$dir' && exec $*" > "$logs/$name.log" 2>&1 &
  started+=("$!")
  echo "started  $name"
}

start_postgres() {
  if port_in_use 5432; then
    echo "postgres is already running"
    return
  fi
  (cd "$root" && nix-shell --run 'pg_ctl -D "$PGDATA" -l "$PGDATA/server.log" -w start') 2>&1 |
    grep -E "server started|could not|error"
}

start_postgres
run backend port:3000 "$root/backend" npm run start:dev
run dashboard port:5173 "$root/frontend" npm run dev -- --port 5173 --strictPort
run roblox-build proc:rbxtsc "$root/roblox" npm run watch
run rojo port:34872 "$root/roblox" rojo serve

echo
echo "backend    http://localhost:3000"
echo "dashboard  http://localhost:5173"
echo "rojo       localhost:34872"
echo "logs       tail -f .dev-logs/<name>.log"
echo "press ctrl+c to stop what this script started (postgres keeps running)"

[ "${#started[@]}" -eq 0 ] && exit 0
wait
