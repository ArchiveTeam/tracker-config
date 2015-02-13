#!/bin/bash -x

while true; do
  ruby ../set-projects-json.rb projects.json
  sleep 5
  ruby ../set-projects-json.rb projects2.json
  sleep 30
  ruby ../set-projects-json.rb projects.json
  sleep 600
done
