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

function saveForms() {
  if (window.localStorage) {
      var elements = document.querySelectorAll('[name]');

      for (var i = 0, length = elements.length; i < length; i++) {
          (function(element) {
              var name = element.getAttribute('name');

              element.value = localStorage.getItem(name) || '';

              element.onkeyup = function() {
                  localStorage.setItem(name, element.value);
              };
          })(elements[i]);
      }
  }
}

window.onload = saveForms;
