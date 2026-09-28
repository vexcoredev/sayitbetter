<div align="center">

<img src="assets/logo.svg" width="72" alt="Say It Better logo">

# Say It Better

**Grammar fixes and better ways to phrase what you mean. No prompting. No AI chat. Just write.**

[**Use it on the web**](https://vexcoredev.github.io/sayitbetter/app/) &nbsp;·&nbsp;
[**Download for Mac**](https://vexcoredev.github.io/sayitbetter/downloads/SayItBetter.dmg) &nbsp;·&nbsp;
[Website](https://vexcoredev.github.io/sayitbetter/)

</div>

<p align="center">
  <img src="assets/screenshots/mac-app.png" width="560" alt="Say It Better on the Mac: a sentence with its corrected version and alternative phrasings">
  &nbsp;
  <img src="assets/screenshots/web-app.png" width="200" alt="Say It Better web app on a phone: corrected line with changes highlighted, plus three other ways to say it">
</p>

## What it does

You already know what you want to say. Say It Better helps you say it better without interrupting you.

Type or paste a sentence. In a second or two you get:

- **The corrected line**: spelling, grammar and punctuation fixed, with every changed word highlighted so you can see what moved.
- **Other ways to say it**: a few rewrites with the same meaning, whether clearer, shorter, friendlier or more professional.

Tap one to copy it, or drop it back into your text. That's the whole app.

**Why not just ask a chatbot?** The usual way is: write → copy → open ChatGPT → paste → type a prompt → wait → copy → switch back → paste.
With Say It Better it's: **write → choose → copy.**

- **Choices, not a verdict.** AI doesn't decide what you meant. You pick how you sound.
- **No prompts, no chat.** Type the sentence; the suggestions are already there.
- **A utility, not a destination.** Open it, fix the line, get back to work.

## Use it on the web: phone or computer

Works in any modern browser, with nothing to download.

1. Open **[vexcoredev.github.io/sayitbetter/app](https://vexcoredev.github.io/sayitbetter/app/)**.
2. Install it if you like, so it opens full-screen like a regular app:
   - **iPhone / iPad:** Safari → **Share** → **Add to Home Screen**
   - **Android / PC:** Chrome or Edge → **Install app** (in the address bar or menu)
3. Pick an AI on first launch. Both free options work well:

| AI | Cost | Privacy | Notes |
|---|---|---|---|
| **Built-in AI** *(default)* | Free, no key | Sent securely, never saved | Works right away. Nothing to set up. |
| **Google Gemini** | Free key | Text goes to Google | Fast and polished. Get a key in a minute at [Google AI Studio](https://aistudio.google.com/apikey). |
| **On this device** | Free, no account | Nothing leaves your device | Downloads a small model once (Qwen 2.5 0.5B, ~300 MB, or Google Gemma 3 1B, ~700 MB), then works offline. Needs WebGPU: recent Chrome or Edge, or Safari 26+. Simpler rewrites. |
| Groq | Free key | Text goes to Groq | Very fast open models. |
| OpenAI · Claude | Paid, per use | Text goes to that provider | Bring your own API key. |
| Custom | Your server | Your server | Any OpenAI-compatible endpoint, e.g. Ollama on your own machine. |

Your API key is stored only in that browser on that device, and is sent only to the provider you picked. There's no Say It Better server in between.

**Line / All:** work on the line you're typing in, or on the whole text.

## Mac app

Everything above, plus features that only a native app can do:

- **Autocomplete in any app.** Grey suggested text appears at your cursor in Mail, Notes, Slack, browsers and more.
  <kbd>⇥</kbd> takes the next word, <kbd>⌥</kbd><kbd>⇥</kbd> the whole suggestion, <kbd>esc</kbd> hides it.
  Password fields are never read; Terminal, code editors and password managers are excluded by default.
- **Suggestions panel** as a window or from the **menu bar**. Copy an alternative with <kbd>⌘1</kbd>…<kbd>⌘9</kbd>.
- **Local by default.** Runs on [Ollama](https://ollama.com) on your Mac, so your text never leaves it. OpenAI, Claude or
  Apple Intelligence (macOS 26+) are there if you want them. Keys are kept in the macOS Keychain.

**Requirements:** macOS 14 Sonoma or later, on Apple Silicon or Intel. Apple Silicon is recommended for local models.

**Install** (about a minute, only once):

1. Download [SayItBetter.dmg](https://vexcoredev.github.io/sayitbetter/downloads/SayItBetter.dmg) and open it.
2. Drag the **Say It Better** icon onto the **Applications** folder in that window.
3. Open it: press <kbd>⌘</kbd> <kbd>Space</kbd>, type **Say It Better**, press <kbd>Return</kbd>.
4. macOS says *“Apple could not verify…”*. Click **Done**, **not** Move to Bin.
5. Open **System Settings → Privacy & Security**, scroll to the bottom, click **Open Anyway** and confirm with your
   password or Touch ID. It opens.

> [!IMPORTANT]
> Steps 4–5 are needed because the app isn't notarized by Apple yet. On macOS 15 and later, right-click → Open no longer
> skips them.

**No permissions needed** for the suggestions panel and the menu bar. Autocomplete in other apps is optional and off
until you turn it on (during setup or anytime in Settings). It then needs two permissions: **Accessibility** to read the
line you're typing and where your cursor is, and **Input Monitoring** to catch <kbd>⇥</kbd>.

## Privacy

- **Mac app:** runs on a local model by default, so nothing leaves your Mac unless you switch to a cloud provider.
- **Web app:** there are no accounts, no analytics and no backend. Your text goes straight from your browser to the AI you
  chose, or nowhere at all with the on-device option. Your draft and settings stay in your browser.

## Share it

Know someone who rewrites every message five times? Send them this:

> Try Say It Better ✍️ Just start typing and better ways to say it pop up as you go. Tap one to copy. Free, no sign-up, nothing to install ⚡ https://vexcoredev.github.io/sayitbetter/app/

[**Share on WhatsApp**](https://wa.me/?text=Try%20Say%20It%20Better%20%E2%9C%8D%EF%B8%8F%20Just%20start%20typing%20and%20better%20ways%20to%20say%20it%20pop%20up%20as%20you%20go.%20Tap%20one%20to%20copy.%20Free%2C%20no%20sign-up%2C%20nothing%20to%20install%20%E2%9A%A1%20https%3A//vexcoredev.github.io/sayitbetter/app/)

## About this repository

This repo is the public website: the landing page, the web app and the Mac download. It's plain HTML, CSS and JavaScript with
no build step, served by GitHub Pages from the `main` branch. The Mac app's source code isn't included here.

```
index.html, styles.css, app.js   landing page
app/                             the web app (installable PWA)
  app.js                         prompts, AI providers, suggestions, settings
  sw.js                          offline support
  manifest.webmanifest, icons/   install metadata
downloads/                       SayItBetter.dmg + latest.json (version/size shown on the page)
assets/                          logo and screenshots
```

**Run it locally:**

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080 for the landing page, or http://localhost:8080/app/ for the web app.

**Publishing changes:** push to `main`, and GitHub Pages redeploys in about a minute. When you change anything in `app/`,
bump `VERSION` in `app/sw.js` so installed copies pick up the update. To ship a new Mac build, replace
`downloads/SayItBetter.dmg` and update `downloads/latest.json` (`{"version": "1.0.1", "size": "1.3 MB", "url": "downloads/SayItBetter.dmg"}`).
