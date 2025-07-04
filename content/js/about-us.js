const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(".card").forEach((el) => {
  observer.observe(el);
});

document.querySelectorAll(".text-card").forEach((el) => {
  observer.observe(el);
});
