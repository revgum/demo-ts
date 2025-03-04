#!/bin/sh
# buildAndReload task, running in background, watches for source changes
if [ -x "./gradlew" ]; then
  echo "Found gradlew, running application in 'localhost' mode without hotreloading"
  GRADLE="./gradlew"
  "$GRADLE" bootRun -PskipDownload=true --args="--spring.profiles.active=localhost"
else
  GRADLE="gradle"
  (sleep 60; "$GRADLE" buildAndReload --continuous -PskipDownload=true -x Test) & "$GRADLE" bootRun -PskipDownload=true --args="--spring.profiles.active=$1"
fi
