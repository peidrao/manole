#!/bin/sh
set -eu

exec /app/start.sh create-user "$@"
