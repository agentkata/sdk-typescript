#!/bin/sh

set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
TMP_DIR=$(mktemp -d)
OPENAPI_GENERATOR_IMAGE=${OPENAPI_GENERATOR_IMAGE:-openapitools/openapi-generator-cli:v7.19.0}
trap 'rm -rf "$TMP_DIR"' EXIT

mkdir -p "$TMP_DIR/out"
docker run --rm \
  -v "$ROOT_DIR:/local" \
  -v "$TMP_DIR/out:/out" \
  "$OPENAPI_GENERATOR_IMAGE" generate \
  -i /local/openapi/solver.yaml \
  -g typescript-fetch \
  -c /local/openapi-generator.yaml \
  -o /out

rm -rf "$ROOT_DIR/src/generated"
mkdir -p "$ROOT_DIR/src/generated"
cp -R "$TMP_DIR/out/apis" "$ROOT_DIR/src/generated/apis"
cp -R "$TMP_DIR/out/models" "$ROOT_DIR/src/generated/models"
cp "$TMP_DIR/out/runtime.ts" "$ROOT_DIR/src/generated/runtime.ts"
cp "$TMP_DIR/out/index.ts" "$ROOT_DIR/src/generated/index.ts"
