#!/usr/bin/env bash
set -euo pipefail
if [ $# -lt 1 ]; then
  echo "Usage: $0 backup.sql"
  exit 1
fi
cat "$1" | docker exec -i $(docker ps -qf name=db) psql -U postgres -d lims
echo "Restore complete"
