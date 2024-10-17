let themeSwitcherBtn = document.querySelector("#themeSwitcher");
let bodyTheme = localStorage.getItem("body-theme") || "light";

if (bodyTheme === "dark") {
  document.body.classList.add("dark");
  themeSwitcherBtn.innerHTML = `<i class="bi bi-moon-stars-fill"></i>`;
} else {
  document.body.classList.remove("dark");
  themeSwitcherBtn.innerHTML = `<i class="bi bi-brightness-high-fill"></i>`;
}

themeSwitcherBtn.addEventListener("click", function() {
  document.body.classList.toggle("dark");

  if(document.body.classList.contains("dark")) {
    localStorage.setItem("body-theme", "dark");
    this.innerHTML = `<i class="bi bi-moon-stars-fill"></i>`;
  }else {
    localStorage.setItem("body-theme", "light");
    this.innerHTML = `<i class="bi bi-brightness-high-fill"></i>`
  }
})