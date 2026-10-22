#!/bin/sh
# Display only: no files or settings are modified.
printf '\nNormal ANSI foregrounds\n'
for color in 30 31 32 33 34 35 36 37; do
  printf '\033[%sm Color %s \033[0m' "$color" "$color"
done
printf '\n\nBright ANSI foregrounds\n'
for color in 90 91 92 93 94 95 96 97; do
  printf '\033[%sm Color %s \033[0m' "$color" "$color"
done
printf '\n\nSelection, warnings, errors and success\n'
printf '\033[33m! A moment of attention\033[0m\n'
printf '\033[31m× Something needs correcting\033[0m\n'
printf '\033[32m✓ Ready to continue\033[0m\n\n'
