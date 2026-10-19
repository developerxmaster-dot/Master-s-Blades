# Spirit Heroes: Long Spin - publish + online multiplayer (beginner guide)

Files: index.html (your game), net.js (internet multiplayer), config.js (your keys), favicon.svg, robots.txt, sitemap.xml.

## A. Free multiplayer backend (Supabase, free plan, no card)
1. supabase.com > Sign in with GitHub > New project (any name, any password, nearest region).
2. Project Settings > API. Copy **Project URL** and the **anon / publishable** key.
3. Open config.js and paste them in. NEVER use the service_role / secret key.
4. No tables or SQL needed. The game only uses Realtime Broadcast.
Free-plan limits (Supabase docs): 200 connections, 100 messages/second. One 1v1 uses roughly 50/s, so about 2 matches at once. For more players: Supabase Pro ($25/mo) or move net.js to a Cloudflare Worker later (only net.js changes).

## B. GitHub Pages
Your username.github.io repo is already used, so make a *project* repo.
1. github.com > New repository > name e.g. `spirit-heroes` > Public > Create.
2. Add file > Upload files > drag ALL 6 files (index.html must be at the top level, not in a folder) > Commit.
   (index.html is ~5 MB; fine for GitHub. Use a computer if the phone upload struggles.)
3. Settings > Pages > Source: Deploy from a branch > main / (root) > Save.
4. After 1-3 minutes your site is at: **https://YOUR-USERNAME.github.io/spirit-heroes/**
5. Replace YOUR-USERNAME/YOUR-REPO in index.html (canonical + og:url), robots.txt and sitemap.xml with the real address (GitHub's pencil icon edits files).

## C. Google visibility (no guarantees)
1. search.google.com/search-console > Add property > URL prefix > your site URL.
2. Verify with the "HTML tag" method: paste the meta tag into index.html <head>, commit, click Verify.
3. Sitemaps > add `sitemap.xml`. URL Inspection > Request indexing.
4. Indexing can take days or weeks. Note: crawlers only read robots.txt at a domain root, so on a project URL it is ignored (harmless).
5. Tip: avoid the "Beyblade" trademark in the public title/description (already done).

## D. Security notes
- The anon key is public by design; there is no database to protect. Never expose secret keys.
- The host runs the match; guests send only joystick/special input, which is clamped on the host. A cheating *host* could cheat; fine for casual play.
- Anyone can join a channel and 4-digit room codes are guessable: fine for casual play, not for ranked/money.

## E. Test plan (two phones, different networks: one Wi-Fi, one mobile data)
Nothing below has been run yet. Mark each pass/fail.
1. Open the URL on both phones; hard-refresh. No errors on the Multiplayer screen.
2. Phone A: Multiplayer > create private match > note code. Phone B: join with the code (or open URL#join=CODE).
3. Both appear in lobby; pick spinners; Ready; host starts 1v1. Check movement, attacks, rpm/health and winner agree on both.
4. Play 3 matches; check Play again and Lobby buttons.
5. Wrong code (e.g. 0000): clear message, no crash.
6. Quick match on both phones at the same time: they should pair within ~5 s.
7. Guest closes tab mid-match: host sees a bot take over. Host closes tab: guest sees "host left" within ~15 s and returns to menu.
8. Airplane mode 5 s then back: "Connection lost" then "Reconnected."
9. Lock phone 30 s, unlock: note whether it recovers.
10. Desktop Chrome + a phone together.
If it fails, open the browser console (desktop: F12) and send me the red errors.
