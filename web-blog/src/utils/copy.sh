#!/bin/sh
cd /Users/barry/Documents/advance-project/node-series/web-blog/logs
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log