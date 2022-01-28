function menuToggle() {
  let navMain = document.querySelector(".main-nav");
  let navToggle = document.querySelector(".main-nav__toggle");
  navMain.classList.remove("main-nav--nojs");
  navToggle.addEventListener("click", function () {
    if (navMain.classList.contains("main-nav--closed")) {
      navMain.classList.remove("main-nav--closed");
      navMain.classList.add("main-nav--opened");
    } else {
      navMain.classList.add("main-nav--closed");
      navMain.classList.remove("main-nav--opened");
    }
  });
}

function saveForms() {
  if (window.localStorage) {
    let elements = document.querySelectorAll("[name]");
    for (var i = 0, length = elements.length; i < length; i++) {
      (function (element) {
        let name = element.getAttribute("name");
        element.value = localStorage.getItem(name) || "";
        element.onkeyup = function () {
          localStorage.setItem(name, element.value);
        };
      })(elements[i]);
    }
  }
}

function sliders() {
  let slider = document.querySelector(".slider");
  if (slider) {
    let btnNext = document.querySelector(".button-next");
    let btnPrev = document.querySelector(".button-prev");
    let slides = document.querySelectorAll(".reviews__item");
    let i = 0;

    btnNext.addEventListener("click", function () {
      ++i;
      if (i >= slides.length) {
        slides[i - 1].classList.remove("reviews__item--on");
        i = 0;
        slides[i].classList.add("reviews__item--on");
      } else {
        slides[i - 1].classList.remove("reviews__item--on");
        slides[i].classList.add("reviews__item--on");
      }
    });

    btnPrev.addEventListener("click", function () {
      --i;
      if (i < 0) {
        i = slides.length - 1;
        slides[i - i].classList.remove("reviews__item--on");
        slides[i].classList.add("reviews__item--on");
      } else {
        slides[i + 1].classList.remove("reviews__item--on");
        slides[i].classList.add("reviews__item--on");
      }
    });
  }
}

window.onload = [saveForms(), menuToggle(), sliders()];
