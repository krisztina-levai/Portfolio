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
