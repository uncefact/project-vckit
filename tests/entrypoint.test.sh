#!/bin/bash
# Tests for entrypoint.sh logic (BASEPATH_PORT extraction and SEED_DID guard)
# Run: bash tests/entrypoint.test.sh

PASS=0
FAIL=0

assert_eq() {
  local test_name="$1" expected="$2" actual="$3"
  if [ "$expected" = "$actual" ]; then
    echo "  PASS: $test_name"
    PASS=$((PASS + 1))
  else
    echo "  FAIL: $test_name (expected '$expected', got '$actual')"
    FAIL=$((FAIL + 1))
  fi
}

# --- BASEPATH_PORT extraction ---

echo "BASEPATH_PORT extraction:"

extract_port() {
  local API_DOMAIN="$1"
  case "$API_DOMAIN" in
    "["*"]") echo "" ;;
    "["*"]:"[0-9]*) echo ":${API_DOMAIN##*:}" ;;
    *:[0-9]*) echo ":${API_DOMAIN##*:}" ;;
    *) echo "" ;;
  esac
}

assert_eq "localhost:3332" ":3332" "$(extract_port 'localhost:3332')"
assert_eq "vckit.example.com" "" "$(extract_port 'vckit.example.com')"
assert_eq "vckit.example.com:8080" ":8080" "$(extract_port 'vckit.example.com:8080')"
assert_eq "empty string" "" "$(extract_port '')"
assert_eq "IPv6 with port [::1]:3332" ":3332" "$(extract_port '[::1]:3332')"
assert_eq "IPv6 without port [::1]" "" "$(extract_port '[::1]')"
assert_eq "domain with path (invalid)" "" "$(extract_port 'example.com/path')"

# --- SEED_DID guard logic ---

echo ""
echo "SEED_DID guard logic:"

seed_decision() {
  local SEED_DID="$1" file_exists="$2"
  if [ "${SEED_DID}" = "false" ]; then
    echo "disabled"
  elif [ "$file_exists" = "no" ]; then
    echo "skipped"
  else
    echo "seed"
  fi
}

assert_eq "SEED_DID=false, file exists" "disabled" "$(seed_decision 'false' 'yes')"
assert_eq "SEED_DID=false, file missing" "disabled" "$(seed_decision 'false' 'no')"
assert_eq "SEED_DID=true, file exists" "seed" "$(seed_decision 'true' 'yes')"
assert_eq "SEED_DID=true, file missing" "skipped" "$(seed_decision 'true' 'no')"
assert_eq "SEED_DID unset, file exists" "seed" "$(seed_decision '' 'yes')"
assert_eq "SEED_DID unset, file missing" "skipped" "$(seed_decision '' 'no')"
assert_eq "SEED_DID=FALSE (case-sensitive, seeds)" "seed" "$(seed_decision 'FALSE' 'yes')"
assert_eq "SEED_DID=0 (not false, seeds)" "seed" "$(seed_decision '0' 'yes')"

# --- Summary ---

echo ""
echo "Results: $PASS passed, $FAIL failed"
[ "$FAIL" -eq 0 ] || exit 1
