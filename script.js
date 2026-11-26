/* ==========================================================================
   DIDAS & DRUSILLA — COUPLE PORTFOLIO INTERACTIVE SCRIPT
   ========================================================================== */

// ============================================================================
// PHOTO REPLACEMENT GUIDE:
// Replace any `url` below with your own couple photo paths (e.g., "images/us1.jpg")
// ============================================================================
const GALLERY_PHOTOS = [
  {
    url: "date together.jpg",
    title: "Golden Hour Embrace",
    category: "dates",
    desc: "Watching the sky turn gold together—nothing else in the world mattered."
  },
  {
    url: "togetheradventure.jpg",
    title: "Hand in Hand Forever",
    category: "adventures",
    desc: "Every road feels effortless when my hand is holding yours."
  },
  {
    url: "holding together.jpg",
    title: "Candid Laughter",
    category: "cozy",
    desc: "My favorite sound in the entire universe is making you laugh."
  },
  {
    url: "horizon.jpg",
    title: "Evening Under the Lights",
    category: "dates",
    desc: "Dressed up for a night out, yet all I could look at was you."
  },
  {
    url: "Sunday morning.jpg",
    title: "Chasing Horizons",
    category: "adventures",
    desc: "Exploring new places and collecting memories side by side."
  },
  {
    url: "kissing.jpg",
    title: "Quiet Sunday Morning",
    category: "cozy",
    desc: "Simple, peaceful moments with you are worth more than gold."
  }
];

const DEFAULT_NOTES = [
  {
    author: "From Didas to Drusilla",
    title: "My Safe Haven",
    body: "Drusilla, thank you for bringing light, grace, and endless joy into my life. Loving you is the proudest part of my story.",
    sealed: true
  },
  {
    author: "From Drusilla to Didas",
    title: "My Favorite Person",
    body: "Didas, with you every day feels brighter and safer. Thank you for always believing in us and loving me so deeply.",
    sealed: true
  },
  {
    author: "From Didas to Drusilla",
    title: "A Promise for Tomorrow",
    body: "No matter where life takes us, my hand will always reach for yours first. Here is to all our tomorrows, my love.",
    sealed: false
  }
];

const DEFAULT_BUCKET = [
  { text: "Watch a sunrise together by the ocean", done: true },
  { text: "Cook a candlelight dinner from scratch", done: true },
  { text: "Take a spontaneous weekend road trip", done: false },
  { text: "Stargaze away from city lights", done: false },
  { text: "Dance in the rain with no music", done: false },
  { text: "Build our dream home together", done: false }
];

document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  initNavbar();
  initTimer();
  initEditableTimeline();
  initGallery();
  initLoveNotes();
  initBucketList();
  initAmbientMusic();
  initFloatingPetals();
});

/* --------------------------------------------------------------------------
   1. NAVBAR SCROLL & MOBILE MENU
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const mobileBtn = document.getElementById("mobile-menu-btn");
  const navLinks = document.getElementById("nav-links");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  mobileBtn.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => navLinks.classList.remove("open"));
  });
}

/* --------------------------------------------------------------------------
   2. LIVE RELATIONSHIP TIMER
   -------------------------------------------------------------------------- */
function initTimer() {
  const STORAGE_KEY = "didas_drusilla_anniversary";
  let savedDate = localStorage.getItem(STORAGE_KEY) || "2023-02-14";

  const displayEl = document.getElementById("display-anniversary");
  const editBtn = document.getElementById("edit-date-btn");
  const editor = document.getElementById("date-editor");
  const input = document.getElementById("anniversary-input");
  const saveBtn = document.getElementById("save-date-btn");
  const cancelBtn = document.getElementById("cancel-date-btn");

  const dEl = document.getElementById("t-days");
  const hEl = document.getElementById("t-hours");
  const mEl = document.getElementById("t-mins");
  const sEl = document.getElementById("t-secs");

  function formatReadableDate(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return "Since " + dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function updateClock() {
    const [y, m, d] = savedDate.split("-").map(Number);
    const start = new Date(y, m - 1, d, 0, 0, 0).getTime();
    const now = Date.now();
    const diff = Math.abs(now - start);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    dEl.textContent = String(days).padStart(3, "0");
    hEl.textContent = String(hours).padStart(2, "0");
    mEl.textContent = String(mins).padStart(2, "0");
    sEl.textContent = String(secs).padStart(2, "0");
  }

  displayEl.textContent = formatReadableDate(savedDate);
  input.value = savedDate;
  updateClock();
  setInterval(updateClock, 1000);

  editBtn.addEventListener("click", () => editor.classList.toggle("hidden"));
  cancelBtn.addEventListener("click", () => editor.classList.add("hidden"));

  saveBtn.addEventListener("click", () => {
    if (input.value) {
      savedDate = input.value;
      localStorage.setItem(STORAGE_KEY, savedDate);
      displayEl.textContent = formatReadableDate(savedDate);
      updateClock();
      editor.classList.add("hidden");
    }
  });
}

/* --------------------------------------------------------------------------
   3. INLINE EDITABLE TIMELINE (SAVES TO LOCALSTORAGE)
   -------------------------------------------------------------------------- */
function initEditableTimeline() {
  const STORAGE_KEY = "didas_drusilla_timeline";
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

  document.querySelectorAll("[data-key]").forEach((el) => {
    const key = el.getAttribute("data-key");
    if (saved[key]) {
      el.textContent = saved[key];
    }
    el.addEventListener("input", () => {
      saved[key] = el.textContent;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    });
  });
}

/* --------------------------------------------------------------------------
   4. GALLERY & LIGHTBOX
   -------------------------------------------------------------------------- */
function initGallery() {
  const grid = document.getElementById("gallery-grid");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbTitle = document.getElementById("lightbox-title");
  const lbDesc = document.getElementById("lightbox-desc");

  let currentFilter = "all";
  let currentPhotos = [...GALLERY_PHOTOS];
  let currentIndex = 0;

  function renderGallery() {
    currentPhotos =
      currentFilter === "all"
        ? GALLERY_PHOTOS
        : GALLERY_PHOTOS.filter((p) => p.category === currentFilter);

    grid.innerHTML = currentPhotos
      .map(
        (photo, idx) => `
      <div class="gallery-card" data-index="${idx}">
        <img src="${photo.url}" alt="${photo.title}" loading="lazy" />
        <div class="gallery-overlay">
          <span class="gallery-cat">${photo.category}</span>
          <h3>${photo.title}</h3>
        </div>
      </div>
    `
      )
      .join("");

    grid.querySelectorAll(".gallery-card").forEach((card) => {
      card.addEventListener("click", () => {
        openLightbox(Number(card.dataset.index));
      });
    });
  }

  function openLightbox(index) {
    currentIndex = index;
    const item = currentPhotos[currentIndex];
    lbImg.src = item.url;
    lbTitle.textContent = item.title;
    lbDesc.textContent = item.desc;
    lightbox.classList.remove("hidden");
  }

  document.getElementById("lightbox-close").addEventListener("click", () => {
    lightbox.classList.add("hidden");
  });

  document.getElementById("lightbox-prev").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + currentPhotos.length) % currentPhotos.length;
    openLightbox(currentIndex);
  });

  document.getElementById("lightbox-next").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % currentPhotos.length;
    openLightbox(currentIndex);
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) lightbox.classList.add("hidden");
  });

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      renderGallery();
    });
  });

  renderGallery();
}

/* --------------------------------------------------------------------------
   5. SECRET LOVE NOTES
   -------------------------------------------------------------------------- */
function initLoveNotes() {
  const STORAGE_KEY = "didas_drusilla_notes";
  let notes = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || DEFAULT_NOTES;

  const grid = document.getElementById("notes-grid");
  const form = document.getElementById("add-note-form");

  function saveAndRender() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    grid.innerHTML = notes
      .map(
        (n, i) => `
      <article class="note-card ${n.sealed ? "sealed" : ""}" data-idx="${i}">
        <div class="note-meta">
          <span>${n.author}</span>
          <i data-lucide="heart" class="icon-xs fill-current"></i>
        </div>
        <h3>${n.title}</h3>
        <p class="note-secret">${n.body}</p>
        <span class="note-seal-badge">
          <i data-lucide="${n.sealed ? "lock" : "unlock"}" class="icon-xxs"></i>
          ${n.sealed ? "Tap to Unseal Love Note" : "Opened with Love"}
        </span>
      </article>
    `
      )
      .join("");

    lucide.createIcons();

    grid.querySelectorAll(".note-card").forEach((card) => {
      card.addEventListener("click", () => {
        const idx = Number(card.dataset.idx);
        notes[idx].sealed = !notes[idx].sealed;
        saveAndRender();
      });
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const author = document.getElementById("note-author").value;
    const title = document.getElementById("note-title").value.trim();
    const body = document.getElementById("note-body").value.trim();
    if (!title || !body) return;

    notes.unshift({ author, title, body, sealed: false });
    form.reset();
    saveAndRender();
  });

  saveAndRender();
}

/* --------------------------------------------------------------------------
   6. COUPLE BUCKET LIST
   -------------------------------------------------------------------------- */
function initBucketList() {
  const STORAGE_KEY = "didas_drusilla_bucket";
  let items = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || DEFAULT_BUCKET;

  const listEl = document.getElementById("bucket-items");
  const statsEl = document.getElementById("bucket-stats");
  const fillEl = document.getElementById("bucket-progress");
  const form = document.getElementById("add-bucket-form");
  const input = document.getElementById("bucket-input");

  function render() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    const doneCount = items.filter((i) => i.done).length;
    const pct = items.length ? Math.round((doneCount / items.length) * 100) : 0;

    statsEl.textContent = `${doneCount} / ${items.length}`;
    fillEl.style.width = `${pct}%`;

    listEl.innerHTML = items
      .map(
        (item, idx) => `
      <li class="bucket-item ${item.done ? "done" : ""}" data-idx="${idx}">
        <div class="bucket-left">
          <span class="bucket-check">
            ${item.done ? '<i data-lucide="check" class="icon-xs"></i>' : ""}
          </span>
          <span class="bucket-text">${item.text}</span>
        </div>
        <button class="bucket-del" data-del="${idx}" title="Remove item" aria-label="Remove item">
          <i data-lucide="trash-2" class="icon-xs"></i>
        </button>
      </li>
    `
      )
      .join("");

    lucide.createIcons();

    listEl.querySelectorAll(".bucket-item").forEach((li) => {
      li.addEventListener("click", (e) => {
        if (e.target.closest("[data-del]")) return;
        const idx = Number(li.dataset.idx);
        items[idx].done = !items[idx].done;
        render();
      });
    });

    listEl.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.del);
        items.splice(idx, 1);
        render();
      });
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (!val) return;
    items.push({ text: val, done: false });
    input.value = "";
    render();
  });

  render();
}

/* --------------------------------------------------------------------------
   7. ROMANTIC CALL MELODY (WEB AUDIO API - NO EXTERNAL MP3 NEEDED)
   -------------------------------------------------------------------------- */
function initAmbientMusic() {
  const btn = document.getElementById("music-toggle");
  const label = document.getElementById("music-label");
  let audioCtx = null;
  let intervalId = null;
  let isPlaying = false;

  // Chord + Signature Melody Frequencies for "Romantic Call" (F# Major)
  const songBars = [
    {
      // Bar 1: F# (I) + "Ro-man-tic call..." melody
      chord: [185.0, 233.08, 277.18],
      melody: [
        { freq: 369.99, time: 0.0, dur: 0.35 },  // F#4
        { freq: 466.16, time: 0.35, dur: 0.35 }, // A#4
        { freq: 554.37, time: 0.70, dur: 0.65 }, // C#5
        { freq: 466.16, time: 1.40, dur: 0.45 }, // A#4
        { freq: 369.99, time: 1.90, dur: 0.60 }  // F#4
      ]
    },
    {
      // Bar 2: D#m (vi)
      chord: [155.56, 185.0, 233.08],
      melody: [
        { freq: 369.99, time: 0.0, dur: 0.35 },  // F#4
        { freq: 466.16, time: 0.35, dur: 0.35 }, // A#4
        { freq: 554.37, time: 0.70, dur: 0.65 }, // C#5
        { freq: 622.25, time: 1.40, dur: 0.50 }, // D#5
        { freq: 554.37, time: 1.95, dur: 0.55 }  // C#5
      ]
    },
    {
      // Bar 3: B (IV)
      chord: [246.94, 311.13, 369.99],
      melody: [
        { freq: 493.88, time: 0.0, dur: 0.40 },  // B4
        { freq: 466.16, time: 0.45, dur: 0.40 }, // A#4
        { freq: 369.99, time: 0.90, dur: 0.70 }, // F#4
        { freq: 311.13, time: 1.65, dur: 0.80 }  // D#4
      ]
    },
    {
      // Bar 4: C# (V)
      chord: [277.18, 349.23, 415.30],
      melody: [
        { freq: 415.30, time: 0.0, dur: 0.40 },  // G#4
        { freq: 466.16, time: 0.45, dur: 0.40 }, // A#4
        { freq: 415.30, time: 0.90, dur: 0.65 }, // G#4
        { freq: 369.99, time: 1.60, dur: 0.90 }  // F#4
      ]
    }
  ];

  let step = 0;

  function playTone(freq, startTime, duration, volume, type = "sine") {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  function playChord() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const bar = songBars[step % songBars.length];
    step++;

    // Play soft background chord pad
    bar.chord.forEach((f) => {
      playTone(f, now, 2.5, 0.025, "sine");
    });

    // Play lead melody notes on top
    bar.melody.forEach((note) => {
      playTone(note.freq, now + note.time, note.dur, 0.05, "triangle");
    });
  }

  btn.addEventListener("click", () => {
    if (!isPlaying) {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();
      playChord();
      intervalId = setInterval(playChord, 3400);
      isPlaying = true;
      btn.classList.add("playing");
      label.textContent = "Pause Melody";
    } else {
      clearInterval(intervalId);
      isPlaying = false;
      btn.classList.remove("playing");
      label.textContent = "Play Love Song";
    }
  });
}

/* --------------------------------------------------------------------------
   8. FLOATING ROSE PETALS ANIMATION
   -------------------------------------------------------------------------- */
function initFloatingPetals() {
  const canvas = document.getElementById("petals-canvas");
  const ctx = canvas.getContext("2d");
  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const petals = Array.from({ length: 18 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    size: 6 + Math.random() * 7,
    speedY: 0.4 + Math.random() * 0.7,
    speedX: -0.3 + Math.random() * 0.6,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.02,
    alpha: 0.22 + Math.random() * 0.25
  }));

  function animate() {
    ctx.clearRect(0, 0, w, h);
    petals.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(p.angle) * 0.3;
      p.angle += p.spin;

      if (p.y > h + 20) {
        p.y = -20;
        p.x = Math.random() * w;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = `rgba(244, 114, 182, ${p.alpha})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(animate);
  }

  animate();
}
