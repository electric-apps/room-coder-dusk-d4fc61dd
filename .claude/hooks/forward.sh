#!/bin/bash
BODY="$(cat)"
RESPONSE=$(curl -s -X POST "https://electric-agent.fly.dev/api/sessions/d4fc61dd-d800-4e61-85ff-04020221b3e6/hook-event" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer d31e273a71642e26bc5d7f8b5b620f157af00ec70eac0f7f8138b635d1e3e5e9" \
  -d "${BODY}" \
  --max-time 360 \
  --connect-timeout 5 \
  2>/dev/null)
if echo "${RESPONSE}" | grep -q '"hookSpecificOutput"'; then
  echo "${RESPONSE}"
fi
exit 0