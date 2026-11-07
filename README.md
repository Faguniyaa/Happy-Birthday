# A little birthday website for Aanchal ♡

A responsive, six-page birthday surprise website. Works in modern mobile and desktop browsers.

## Personalise it
1. Open `assets/images/`.
2. Add your own photos and name them exactly:
   - `cover.jpg` (homepage portrait)
   - `photo1.jpg` through `photo6.jpg` (gallery)
3. Replace the sample letter in `letter.html` with your own words if you want.
4. Edit the timeline in `journey.html` with your real milestones and dates.
5. Add more gallery photos by copying a `<figure>` block in `gallery.html`.

Use JPG, PNG or WebP; if you use another extension, update the matching `src` in the HTML.

## Preview
Open `index.html` in a browser. For best results, preview through a local server:
- On a computer: `python -m http.server 8000`
- On Android with Termux: install Python, go to this folder, run `python -m http.server 8000`, then open `http://127.0.0.1:8000`.

## Free publishing
You can publish the folder with GitHub Pages. Create a GitHub repository, upload the project files, then enable Pages from the repository's Settings. The published link can be opened on Android and PC.

## Notes
- No paid APIs, database, or build tools are needed.
- Google Fonts requires internet; fallback fonts are included.
- The gallery opens photos in a full-screen lightbox.
- The gift reveal and reason cards work with JavaScript.
