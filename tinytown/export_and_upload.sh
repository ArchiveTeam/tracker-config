#!/bin/bash
python3 -m terroroftinytown.release.supervisor config.conf \
  /home/tinytown/tinytown-data/export/ \
  --verbose --batch-size 5000000 \
  #--max-batches 10
