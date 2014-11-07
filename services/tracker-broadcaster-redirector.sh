#!/bin/bash

PATH=/usr/local/bin/:/sbin:/usr/sbin:/bin:/usr/bin

cd /var/www/universal-tracker-broadcaster/

PORT=8002 exec setuidgid alard node redirector.js
