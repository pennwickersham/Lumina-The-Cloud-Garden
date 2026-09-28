#!/usr/bin/env python3
"""Checks every field in listing.md against its store's character limit."""
import re, sys, pathlib
text = pathlib.Path(__file__).with_name("listing.md").read_text()
LIMITS = {"description": 4000, "play:title": 30, "play:short": 80, "play:notes": 500,
          "ios:name": 30, "ios:subtitle": 30, "ios:keywords": 100, "ios:promo": 170,
          "ios:whatsnew": 4000, "ios:review": 4000}
def field(k):
    m = re.search(r"<!-- %s:start -->(.*?)<!-- %s:end -->" % (k, k), text, re.S) if k == "description" \
        else re.search(r"<!-- %s -->(.*?)<!-- /%s -->" % (k, k), text, re.S)
    return m.group(1).strip()
bad = False
for k, lim in LIMITS.items():
    v = field(k)
    n = len(v.encode()) if k == "ios:keywords" else len(v)   # Apple counts keyword bytes
    bad |= n > lim
    print(f"{'OK ' if n <= lim else 'OVER'} {k:14} {n:5} / {lim}")
sys.exit(1 if bad else 0)
