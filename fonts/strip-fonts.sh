#!/bin/bash

tmpfile="$(mktemp)"
echo $tmpfile

uni2ascii -a P icons.txt > $tmpfile
pyftsubset GoMonoNerdFont-Regular.ttf --output-file=NerdFont-stripped.ttf \
    --layout-features='*' --glyph-names --symbol-cmap --legacy-cmap \
    --notdef-glyph --notdef-outline \
    --name-IDs='*' --name-legacy --name-languages='*' \
    --unicodes-file=$tmpfile