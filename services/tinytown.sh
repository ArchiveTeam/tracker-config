#!/bin/bash

PATH=/usr/local/bin/:/sbin:/usr/sbin:/bin:/usr/bin

cd /home/tinytown/terroroftinytown/

exec setuidgid tinytown /home/tinytown/.pyenv/shims/python3 -m terroroftinytown.tracker config.conf
