#!/usr/bin/env bash
# Reconstrói todas as peças do projeto VÉRTICE a partir dos arquivos-fonte.
# Requisitos: python3 (Pillow, numpy, scipy, fontTools, brotli), node + playwright (Chromium).
set -euo pipefail
cd "$(dirname "$0")"
python3 build_identity.py
python3 build_graphics.py
python3 build_collections.py
python3 build_packaging.py
python3 build_campaign.py
python3 build_instagram.py
python3 build_direction_strategy.py
python3 build_behance.py
python3 build_manual.py
