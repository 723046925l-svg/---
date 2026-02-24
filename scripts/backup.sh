#!/usr/bin/env bash
set -euo pipefail
docker exec -t $(docker ps -qf name=db) pg_dump -U postgres lims > backup_$(date +%F).sql
echo "Backup complete"
