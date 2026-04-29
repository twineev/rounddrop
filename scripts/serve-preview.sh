#!/bin/bash
cd /Users/twinee/Side\ Hustles/RoundDrop
exec python3 -m http.server ${PORT:-3000}
