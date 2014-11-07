#!/bin/bash

PATH=/sbin:/usr/sbin:/bin:/usr/bin

cd /var/www/universal-tracker/scripts/

exec setuidgid alard ruby log-drainer.rb
