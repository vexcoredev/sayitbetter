# Say It Better website

Static landing/download page — no build step. Preview locally with `python3 -m http.server -d site 8080` (from the repo root) and open http://localhost:8080.
Put the installer at `site/downloads/SayItBetter.dmg`; the Download buttons link there.
Optionally add `site/downloads/latest.json` (`{"version": "1.0.1", "size": "12.4 MB", "url": "downloads/SayItBetter.dmg"}`) to update the version/size label and link automatically.

## Web app

`site/app/` is Say It Better as an installable web app (PWA) — the suggestions panel, for any browser (phone or computer).
On iPhone, open `/app/` in Safari, then **Share → Add to Home Screen**; Chrome/Edge on a PC offer **Install app**. No build step. When you change its files, bump `VERSION` in `site/app/sw.js` so
installed copies pick up the update.

AI options (chosen on first run, stored only in that browser):
- **Google Gemini** — free key from Google AI Studio. Recommended.
- **On this device** — WebLLM runs Qwen 2.5 0.5B (~300 MB, once) or Gemma 3 1B (~700 MB) on-device. Needs WebGPU (recent Chrome/Edge, Safari 26+).
- **Groq** (free key), **OpenAI**, **Claude**, or any **OpenAI-compatible** server.

The site must be served over HTTPS for Add to Home Screen, the service worker and clipboard access (localhost is fine for testing).
