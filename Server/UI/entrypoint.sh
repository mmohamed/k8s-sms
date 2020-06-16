#!/usr/bin/env sh
echo "Entrypoint exec"

if [ -z "$BACKEND_URL" ]
then
      echo "Use default Backend URL"
else
      echo "Update Backend URL"
      sed -i "s/\/\*//g" /usr/share/nginx/html/config.js
      sed -i "s/\*\///g" /usr/share/nginx/html/config.js
      sed -i "s|\[APPURLBASE\]|$BACKEND_URL|g" /usr/share/nginx/html/config.js
fi

echo "Run default entrypoint"

