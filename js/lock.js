(() => {
  "use strict";

  // Unlocks at 11 November 2026, 23:59:00 IST.
  const UNLOCK_AT = new Date("2026-11-11T23:59:00+05:30").getTime();
  const COUNTDOWN_MUSIC = "music/main/countdown.mp3";
  const BIRTHDAY_MUSIC = "music/main/birthday.mp3";
  const COUPLE_GIF = "assets/images/bubu-dudu.gif";

  const lockStyle = `
    body.birthday-locked { overflow: hidden !important; }
    #birthday-lock {
      position: fixed; inset: 0; z-index: 999999;
      display: flex; align-items: center; justify-content: center;
      overflow-y: auto; padding: 24px 16px;
      background:
        radial-gradient(circle at 12% 12%,rgba(255,211,224,.95),transparent 32%),
        radial-gradient(circle at 88% 82%,rgba(226,207,255,.9),transparent 35%),
        linear-gradient(145deg,#fff8f7,#ffeaf0 52%,#f7edff);
      color: #714253; text-align: center;
      font-family: 'DM Sans', sans-serif;
    }

#birthday-lock .secret-note {
    margin: 18px auto 5px;
    padding: 13px 16px;
    max-width: 340px;
    border: 1px dashed #e9b7c8;
    border-radius: 16px;
    background: #fff5f8;
    color: #bd718b;
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 14px;
    line-height: 1.8;
    animation: lock-bob 3s ease-in-out infinite;
}
    #birthday-lock * { box-sizing: border-box; }
    #birthday-lock .lock-card {
      width: min(560px,100%); padding: clamp(25px,6vw,48px) 22px;
      border: 1px solid rgba(255,255,255,.9); border-radius: 30px;
      background: rgba(255,255,255,.68); backdrop-filter: blur(16px);
      box-shadow: 0 25px 80px rgba(140,76,105,.16);
      position: relative;
    }
    #birthday-lock .lock-kicker {
      font-size: 10px; letter-spacing: 3px; font-weight: 700;
      text-transform: uppercase; color: #bd718b;
    }
    #birthday-lock h1 {
      margin: 12px 0 8px; color: #783d55;
      font: 600 clamp(36px,8vw,58px)/1.08 'Playfair Display',serif;
    }
    #birthday-lock h1 em { color: #d47798; font-weight: 500; }
    #birthday-lock .lock-copy {
      margin: 12px auto 20px; max-width: 390px;
      color: #987985; font-size: 14px; line-height: 1.8;
    }
    #birthday-lock .couple-art {
      width: min(230px,65vw); height: 165px; margin: 4px auto 18px;
      display: flex; align-items: center; justify-content: center;
      position: relative;
    }
    #birthday-lock .couple-art img {
      width: 100%; height: 100%; object-fit: contain;
      filter: drop-shadow(0 10px 14px rgba(125,69,91,.13));
      animation: lock-bob 3s ease-in-out infinite;
    }
    #birthday-lock .couple-fallback {
      display: none; font-size: 76px; letter-spacing: -18px;
      filter: drop-shadow(0 9px 12px rgba(125,69,91,.15));
      animation: lock-bob 3s ease-in-out infinite;
    }
    #birthday-lock .timer {
      display: grid; grid-template-columns: repeat(4,1fr);
      gap: 9px; max-width: 430px; margin: 22px auto;
    }
    #birthday-lock .time-box {
      padding: 14px 5px 11px; border-radius: 17px;
      background: #fff; border: 1px solid #f5dce5;
      box-shadow: 0 8px 20px rgba(160,91,119,.07);
    }
    #birthday-lock .time-number {
      display: block; font: 600 clamp(25px,6vw,38px)/1 'Playfair Display',serif;
      color: #b95778; font-variant-numeric: tabular-nums;
    }
    #birthday-lock .time-label {
      display: block; margin-top: 7px; color: #ad8795;
      font-size: 9px; letter-spacing: 1.4px; text-transform: uppercase;
    }
    #birthday-lock .unlock-date {
      color: #a77e8d; font-size: 11px; letter-spacing: 1px;
    }
    #birthday-lock .music-button {
      margin-top: 20px; padding: 13px 21px; border: 0;
      border-radius: 30px; color: white; background: linear-gradient(120deg,#d47b99,#b75b7c);
      box-shadow: 0 10px 22px rgba(183,91,124,.24);
      font-weight: 700; cursor: pointer;
    }
    #birthday-lock .music-note {
      margin: 10px 0 0; color: #b18b99; font-size: 10px; line-height: 1.6;
    }
    #birthday-lock .tiny-hearts {
      position: absolute; inset: 0; overflow: hidden; pointer-events: none;
    }
    #birthday-lock .tiny-hearts span {
      position: absolute; bottom: -30px; color: rgba(211,119,151,.5);
      animation: lock-float linear infinite;
    }
    @keyframes lock-bob { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-9px) rotate(2deg)} }
    @keyframes lock-float { to { transform: translateY(-110vh) rotate(35deg); opacity: 0; } }
    @media(max-width:420px) {
      #birthday-lock .lock-card { border-radius: 23px; }
      #birthday-lock .timer { gap: 6px; }
      #birthday-lock .time-box { padding: 12px 2px 10px; }
      #birthday-lock .time-label { font-size: 8px; letter-spacing: .8px; }
    }
    @media(prefers-reduced-motion:reduce) {
      #birthday-lock *, #birthday-lock *::before { animation-duration: .01ms !important; }
    }
  `;

  const style = document.createElement("style");
  style.textContent = lockStyle;
  document.head.appendChild(style);

  let countdownAudio = new Audio(COUNTDOWN_MUSIC);
  let birthdayAudio = new Audio(BIRTHDAY_MUSIC);
  [countdownAudio, birthdayAudio].forEach(a => { a.loop = true; a.preload = "auto"; a.volume = 0.65; });
  let musicEnabled = false;
  let unlocked = false;

  const overlay = document.createElement("section");
  overlay.id = "birthday-lock";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-label", "A birthday surprise is waiting");
  overlay.innerHTML = `
    <div class="tiny-hearts" aria-hidden="true"></div>
    <div class="lock-card">
      <div class="lock-kicker">A little surprise is waiting</div>
      <h1>For my <em>Bubbu</em> ♡</h1>
      <p class="lock-copy">  Shhh... Someone very special is about to turn a year older.  Until then, enjoy this little wait, Bubbu. ♡</p>
      <div class="secret-note">  💌 A tiny secret from your Faguniya...  <br>  Your surprise is worth the wait!</div>
      <div class="couple-art">
        <img src="${COUPLE_GIF}" alt="Cute Bubu and Dudu animation">
        <div class="couple-fallback" aria-hidden="true">🐻‍❄️💕🐻</div>
      </div>
      <div class="lock-kicker">The birthday surprise unlocks in</div>
      <div class="timer" aria-live="off">
        <div class="time-box"><span class="time-number" id="lock-days">00</span><span class="time-label">Days</span></div>
        <div class="time-box"><span class="time-number" id="lock-hours">00</span><span class="time-label">Hours</span></div>
        <div class="time-box"><span class="time-number" id="lock-minutes">00</span><span class="time-label">Minutes</span></div>
        <div class="time-box"><span class="time-number" id="lock-seconds">00</span><span class="time-label">Seconds</span></div>
      </div>
      <div class="unlock-date">11 November 2026 · 11:59 PM (IST)</div>
      <button class="music-button" id="lock-music">♫ Play the little waiting song</button>
      <p class="music-note" id="lock-music-note">Tap once to allow music. Your birthday song will begin when the surprise unlocks.</p>
    </div>
  `;

  const artImg = overlay.querySelector(".couple-art img");
  artImg.addEventListener("error", () => {
    artImg.style.display = "none";
    overlay.querySelector(".couple-fallback").style.display = "block";
  });

  document.body.classList.add("birthday-locked");
  document.body.appendChild(overlay);

  const heartLayer = overlay.querySelector(".tiny-hearts");
  for (let i = 0; i < 15; i++) {
    const heart = document.createElement("span");
    heart.textContent = ["♡", "♥", "✿"][i % 3];
    heart.style.left = (Math.random() * 100) + "%";
    heart.style.animationDuration = (9 + Math.random() * 9) + "s";
    heart.style.animationDelay = (-Math.random() * 12) + "s";
    heart.style.fontSize = (12 + Math.random() * 16) + "px";
    heartLayer.appendChild(heart);
  }

  const pad = n => String(n).padStart(2, "0");
  function unlock() {
    if (unlocked) return;
    unlocked = true;
    overlay.style.transition = "opacity .9s ease";
    overlay.style.opacity = "0";
    setTimeout(() => {
      overlay.remove();
      document.body.classList.remove("birthday-locked");
    }, 950);
    if (musicEnabled) {
      countdownAudio.pause();
      birthdayAudio.currentTime = 0;
      birthdayAudio.play().catch(() => {});
    }
  }

  function tick() {
    const remaining = UNLOCK_AT - Date.now();
    if (remaining <= 0) {
      ["days","hours","minutes","seconds"].forEach(k => {
        const el = document.getElementById("lock-" + k);
        if (el) el.textContent = "00";
      });
      unlock();
      return;
    }
    const totalSeconds = Math.floor(remaining / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    document.getElementById("lock-days").textContent = pad(days);
    document.getElementById("lock-hours").textContent = pad(hours);
    document.getElementById("lock-minutes").textContent = pad(minutes);
    document.getElementById("lock-seconds").textContent = pad(seconds);
  }

  overlay.querySelector("#lock-music").addEventListener("click", async () => {
    musicEnabled = true;
    try {
      await countdownAudio.play();
      overlay.querySelector("#lock-music").textContent = "♫ Waiting song is playing";
      overlay.querySelector("#lock-music-note").textContent = "Music is on. At unlock, it will switch to the birthday song.";
      if (unlocked) {
        countdownAudio.pause();
        birthdayAudio.play().catch(() => {});
      }
    } catch (e) {
      overlay.querySelector("#lock-music-note").textContent = "Music could not start. Check that music/main/countdown.mp3 exists.";
    }
  });

  tick();
  const timer = setInterval(() => {
    tick();
    if (unlocked) clearInterval(timer);
  }, 1000);
})();
