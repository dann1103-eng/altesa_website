# -*- coding: utf-8 -*-
import os as _os, sys as _sys
ROOT = _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
PUB  = _os.path.join(ROOT, "public")
WORK = _os.path.join(ROOT, "tools", "_work")
_os.makedirs(WORK, exist_ok=True)

import os, re, glob, sys

PUB = _os.path.join(ROOT, "public")
V = sys.argv[1] if len(sys.argv) > 1 else "dev"
for fp in glob.glob(os.path.join(PUB, "*.html")):
    s = open(fp, encoding="utf-8").read()
    n = re.sub(r"(assets/(?:css|js)/[\w.-]+\.(?:css|js))(\?v=[\w.-]+)?", r"\1?v=" + V, s)
    if n != s:
        open(fp, "w", encoding="utf-8").write(n)
print("version", V)
