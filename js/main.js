function jumpTo(id){
  const el = document.getElementById(id);
  if(!el) return;

  el.scrollIntoView({ behavior: "smooth", block: "start" });

  // subtle highlight
  el.classList.remove("flash");
  void el.offsetWidth;
  el.classList.add("flash");

  // update hash without hard jump
  history.replaceState(null, "", "#" + id);
}

// Click handler for any element with data-jump
document.addEventListener("click", (e) => {
  const trigger = e.target.closest("[data-jump]");
  if(!trigger) return;
  jumpTo(trigger.getAttribute("data-jump"));
});

// If loaded with a hash (#portfolio), jump there
window.addEventListener("load", () => {
  const hash = (location.hash || "").replace("#", "");
  if(hash) setTimeout(() => jumpTo(hash), 50);
});

// Expose for Storyline / embedding use later:
// window.jumpToSection("portfolio")
window.jumpToSection = jumpTo;

/* ================================
   WORK SAMPLE LIBRARY (in-page carousel + filters)
   Paste BELOW: window.jumpToSection = jumpTo;
================================ */
(() => {
  const track = document.getElementById("samplesTrack");
  const meta = document.getElementById("samplesMeta");
  const prevBtn = document.querySelector("[data-carousel-prev]");
  const nextBtn = document.querySelector("[data-carousel-next]");
  const typeBtns = document.querySelectorAll("[data-filter-type]");
  const skillBtns = document.querySelectorAll("[data-filter-skill]");
  const clearBtn = document.querySelector("[data-filter-clear]");

  if (!track || !prevBtn || !nextBtn || !meta) return;

  // 1) Define your library here (replace src/href with your assets)
  // type: "video" | "visual" | "code"
  const SAMPLES = [
    {
      id: "v-tech-1",
      type: "video",
      title: "How To Use The ABBYY Marketplace",
      desc: "Structured demo video showing product flow and key decision points.",
      badge: "Video · Technical",
      src: "assets/videos/ABBYY Marketplace video.mp4",
      skills: ["Camtasia", "Storyboarding"]
    },
    {
      id: "v-tech-2",
      type: "video",
      title: "Document Sets in ABBYY Vantage",
      desc: "Structured demo video showing product flow and key decision points.",
      badge: "Video · Technical",
      src: "assets/videos/ABBYY Vantage pilot.mp4",
      skills: ["Camtasia", "Synthesia"]
    },
    {
      id: "v-tech-3",
      type: "video",
      title: "Getting Familiar with the Vantage Platform",
      desc: "Structured demo video showing product flow and key decision points.",
      badge: "Video · Technical",
      src: "assets/videos/1.2_Getting Familiar with the Vantage Platform.mp4",
      skills: ["Camtasia"]
    },
    {
      id: "v-exp-1",
      type: "video",
      title: "Understanding CNNs",
      desc: "Short explainer optimized for clarity, pacing, and retention.",
      badge: "Video · Explainer",
      src: "assets/videos/AI - CNN.mp4",
      skills: ["Camtasia", "Microlearning", "Photoshop", "Motion graphics"]
    },
    {
      id: "v-exp-2",
      type: "video",
      title: "Understanding GANs",
      desc: "Short explainer optimized for clarity, pacing, and retention.",
      badge: "Video · Explainer",
      src: "assets/videos/AI GANS.mp4",
      skills: ["Camtasia", "Microlearning", "Photoshop", "Motion graphics"]
    },
    {
      id: "v-exp-3",
      type: "video",
      title: "Understanding LSTMs",
      desc: "Short explainer optimized for clarity, pacing, and retention.",
      badge: "Video · Explainer",
      src: "assets/videos/AI-LSTM.mp4",
      skills: ["Camtasia", "Microlearning", "Photoshop", "Motion graphics"]
    },
    {
      id: "v-exp-4",
      type: "video",
      title: "AI Essentials: A Realistic Future",
      desc: "Short explainer optimized for clarity, pacing, and retention.",
      badge: "Video · Explainer",
      src: "assets/videos/AI - Realistic Future.mp4",
      skills: ["Camtasia", "Microlearning", "Storyboarding"]
    },
    {
      id: "vis-mkt-1",
      type: "visual",
      title: "Marketing visual set",
      desc: "Brand-aligned exports designed for campaign consistency.",
      badge: "Visual · Marketing",
      thumb: "assets/images/project2.jpg",
      skills: ["Photoshop", "Brand Alignment"]
    },
    {
      id: "vis-scorm-1",
      type: "visual",
      title: "SCORM template UI kit",
      desc: "Reusable layout patterns built for consistent e-learning delivery.",
      badge: "Visual · SCORM",
      thumb: "assets/images/project3.jpg",
      skills: ["SCORM", "Storyline", "UX"]
    },
    {
      id: "code-1",
      type: "code",
      title: "Carousel component (vanilla JS)",
      desc: "Reusable carousel pattern with accessible controls.",
      badge: "Code · UI",
      thumb: "assets/images/project1.jpg",
      link: "assets/codes/Carousel with picture.html",
      skills: ["HTML/CSS", "JavaScript", "Accessibility"]
    },
    {
      id: "code-2",
      type: "code",
      title: "Link library (filtering + tags)",
      desc: "Library pattern with tags and quick navigation.",
      badge: "Code · Library",
      thumb: "assets/images/project2.jpg",
      link: "assets/code/link-library.html",
      skills: ["HTML/CSS", "JavaScript"]
    }
  ];

  // Filters state
  let activeType = "all"; // all | video | visual | code
  const activeSkills = new Set(); // multi-select

  function render() {
    const filtered = SAMPLES.filter(s => {
      const typeOk = activeType === "all" ? true : s.type === activeType;
      const skillsOk = activeSkills.size === 0
        ? true
        : [...activeSkills].every(req => (s.skills || []).includes(req));
      return typeOk && skillsOk;
    });

    track.innerHTML = filtered.map(sampleToCard).join("");

    meta.textContent = filtered.length === 0
      ? "No samples match those filters. Try clearing filters."
      : `Showing ${filtered.length} sample${filtered.length === 1 ? "" : "s"}${activeType !== "all" ? ` · ${activeType}` : ""}${activeSkills.size ? ` · Skills: ${[...activeSkills].join(", ")}` : ""}`;

    // reset scroll so user sees start of results
    track.scrollTo({ left: 0, behavior: "smooth" });

    updateNavButtons();
  }

  function sampleToCard(s) {
    const skillsHtml = (s.skills || []).map(k => `<span class="chip">${escapeHtml(k)}</span>`).join("");

    let mediaHtml = "";
    if (s.type === "video" && s.src) {
      mediaHtml = `<video src="${s.src}" controls preload="metadata"></video>`;
    } else {
      // visual or code: use thumb image
      const img = s.thumb ? s.thumb : "assets/images/project1.jpg";
      mediaHtml = `<img src="${img}" alt="${escapeHtml(s.title)}">`;
    }

    // optional link (for code samples)
    const linkHtml = s.link
      ? `<a class="sampleLink" href="${s.link}" target="_blank" rel="noopener">Open →</a>`
      : "";

    return `
      <article class="sampleCard" data-sample-id="${escapeHtml(s.id)}">
        <div class="sampleCard__media">
          ${mediaHtml}
          <div class="sampleBadge">${escapeHtml(s.badge || s.type)}</div>
        </div>
        <div class="sampleCard__body">
          <h3 class="sampleCard__title">${escapeHtml(s.title)}</h3>
          <p class="sampleCard__desc">${escapeHtml(s.desc)}</p>

          <div class="sampleCard__ctaRow">
            ${linkHtml}
          </div>

          <div class="chips">
            ${skillsHtml}
          </div>
        </div>
      </article>
    `;
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function setActiveType(nextType) {
    activeType = nextType;

    typeBtns.forEach(btn => {
      btn.classList.toggle("is-active", btn.dataset.filterType === nextType);
    });

    render();
  }

  function toggleSkill(skill) {
    if (activeSkills.has(skill)) activeSkills.delete(skill);
    else activeSkills.add(skill);

    skillBtns.forEach(btn => {
      btn.classList.toggle("is-active", activeSkills.has(btn.dataset.filterSkill));
    });

    render();
  }

  function clearFilters() {
    activeSkills.clear();
    skillBtns.forEach(btn => btn.classList.remove("is-active"));
    setActiveType("all");
  }

  // Carousel navigation
  function scrollByOneCard(direction) {
    const card = track.querySelector(".sampleCard");
    const step = card ? (card.getBoundingClientRect().width + 14) : 360; // 14 = gap
    track.scrollBy({ left: direction * step, behavior: "smooth" });
    // update after scroll finishes-ish
    setTimeout(updateNavButtons, 220);
  }

  function updateNavButtons() {
    const maxScrollLeft = track.scrollWidth - track.clientWidth;
    const left = track.scrollLeft;

    prevBtn.disabled = left <= 2;
    nextBtn.disabled = left >= maxScrollLeft - 2;
  }

  // Events
  typeBtns.forEach(btn => {
    btn.addEventListener("click", () => setActiveType(btn.dataset.filterType));
  });

  skillBtns.forEach(btn => {
    btn.addEventListener("click", () => toggleSkill(btn.dataset.filterSkill));
  });

  clearBtn?.addEventListener("click", clearFilters);

  prevBtn.addEventListener("click", () => scrollByOneCard(-1));
  nextBtn.addEventListener("click", () => scrollByOneCard(1));

  track.addEventListener("scroll", () => {
    // light debounce
    window.clearTimeout(track.__t);
    track.__t = window.setTimeout(updateNavButtons, 60);
  });

  // Keyboard: left/right arrows on focused track
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") scrollByOneCard(-1);
    if (e.key === "ArrowRight") scrollByOneCard(1);
  });

  // Initial render
  render();
})();
