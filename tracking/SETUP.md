# Send portfolio visitors to a Google Sheet

Each visit becomes one row:

| Column | Example |
|---|---|
| Date / Day / Time | 2026-11-03 / Tuesday / 18:42:10 |
| IP address | 203.0.113.7 |
| Time on site | 2m 05s (only counts while the tab is visible) |
| Pages viewed | / › /video-editing › /graphic-design |
| Device / Browser / Timezone / Language / Screen | Mobile / Chrome / Asia/Karachi / en-US / 390x844 |
| Came from | Direct, or the website that linked to you |

Date, day and time are stamped by Google's server, not the visitor's computer.

## Setup (about 5 minutes)

1. Go to <https://sheets.google.com> and create a **blank spreadsheet** (name it e.g. "Portfolio Visitors").
2. In the spreadsheet: **Extensions → Apps Script**.
3. Delete the sample code, then paste the **entire contents of `Code.gs`** (in this folder). Click **Save** (💾).
4. **Set your time zone** so dates and times are in your local time: left sidebar **Project Settings (⚙) → Time zone**.
5. Click **Deploy → New deployment**.
   - Click the gear next to "Select type" → **Web app**.
   - **Execute as:** Me
   - **Who has access:** Anyone
   - Click **Deploy**, then **Authorize access** and approve your Google account
     (if you see "Google hasn't verified this app", click *Advanced → Go to … (unsafe)* — it is your own script).
6. Copy the **Web app URL** (ends with `/exec`).
7. Open `src/data/site.js` and paste it:
   ```js
   export const analytics = {
     endpoint: 'https://script.google.com/macros/s/XXXXXXXX/exec',
   }
   ```
8. Run the site (`npm run dev`), browse for a few seconds, then check the sheet.
   A `Visitors` tab is created automatically with the headers.

> If you change `Code.gs` later: **Deploy → Manage deployments → ✏️ → Version: New version → Deploy**.
> The URL stays the same.

## Privacy — please read

Tracking runs automatically for every visitor, with no popup or permission step.

An IP address counts as personal data in many places (EU/UK GDPR and similar laws), and some of them require
consent before you collect it. That is your responsibility as the site owner. If you expect visitors from the
EU/UK, ask for a consent banner again and I will add it back.

- A one-line notice in the site footer tells visitors what is recorded. Delete it in
  `src/components/Contact.jsx` if you don't want it, but keep that in mind about the law above.
- The visitor's IP is looked up in their browser through the free ipify.org service. If a visitor's ad-blocker
  blocks it, the IP column shows `unknown` but the rest of the visit is still recorded.
- Only you can see the sheet. Don't share it publicly.

## Limits you should know

- Anyone who finds the Web app URL could send fake rows to it. For a portfolio this is a small risk; if it
  happens, redeploy (new URL) and update `site.js`.
- Google Apps Script allows roughly 20,000 web requests per day on a free account — far more than a portfolio needs.
- Tracking is switched off while `endpoint` is empty, and nothing is sent when running without it.
