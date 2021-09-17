"use strict";

// imports
import toggleBurgers from "./modules/toggleBurger";
import getGallery from "./modules/getGallery";

import Flickity from "flickity";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import MicroModal from "micromodal";

gsap.registerPlugin(ScrollTrigger);

// varibles
const burgers = document.querySelectorAll(".burger");
const galleryTabs = document.querySelectorAll(".gallery-tab");
const header = document.querySelector(".header");
const body = document.querySelector("body");
const youTubeItems = document.querySelectorAll(".youtube-item");
const headerTopAnimated = document.querySelectorAll(".header__top_animated");
const galleryCard = document.querySelectorAll(".gallery-card");
const headerCatalogSubcategoriesItem = document.querySelector(
  ".header-catalog__subcategories-item_active"
);
const headerCatalogWrapper = document.querySelector(".header-catalog__wrapper");

let currentIndex = 0;

// if (history.scrollRestoration) {
//   history.scrollRestoration = "manual";
// } else {
//   window.onbeforeunload = function () {
//     window.scrollTo(0, 0);
//   };
// }

window.addEventListener("DOMContentLoaded", () => {
  toggleBurgers(burgers);
  getGallery(galleryTabs);

  galleryCard.forEach((item) => {
    const button = item.querySelector("button");
    const buttonText1 = "в корзину";
    const buttonText2 = "товар в корзине";
    button.addEventListener("click", () => {
      item.classList.toggle("card_in-bucket");
      button.textContent =
        button.textContent === buttonText1 ? buttonText2 : buttonText1;
    });
  });

  (() => {
    const banner = headerCatalogSubcategoriesItem.querySelector(
      ".header-subcategories__banner"
    );
    const column = headerCatalogSubcategoriesItem.querySelectorAll(
      ".header-subcategories__column"
    );
    if (column.length === 4) {
      headerCatalogSubcategoriesItem.style.paddingRight = "0px";
      headerCatalogWrapper.style.background = "#fff";
    }
    if (banner) {
      const subcategories = Array.from(
        headerCatalogSubcategoriesItem.querySelectorAll(
          ".header-subcategories__column"
        )
      );
      const elWidth = subcategories.reduce((acc, category) => {
        return acc + category.getBoundingClientRect().width;
      }, 0);
      banner.style.width = `${elWidth}px`;
    }
  })();

  headerTopAnimated.forEach((item) => {
    setTimeout(() => {
      item.classList.add("stop-animation");
    }, 2000);
  });

  MicroModal.init({
    onClose: (modal) => {
      const iframe = modal.querySelector("iframe");
      if (iframe) iframe.remove();
    },
  });

  ScrollTrigger.matchMedia({
    "(min-width: 1280px)": function () {
      let tlGallery = gsap.timeline({
        scrollTrigger: {
          trigger: ".gallery",
          start: "top 50%",
          scrub: true,
          toggleActions: "play none none none",
        },
      });

      let tlCourses = gsap.timeline({
        scrollTrigger: {
          trigger: ".courses",
          scrub: true,
          toggleActions: "play none none none",
        },
      });

      let tlPicture = gsap.timeline({
        scrollTrigger: {
          trigger: ".pic_bounded",
          scrub: true,
          toggleActions: "play none none none",
        },
      });

      let tlArticles = gsap.timeline({
        scrollTrigger: {
          trigger: ".content",
          start: "top 0%",
          scrub: true,
          toggleActions: "play none none none",
        },
      });

      let tlAboutPic = gsap.timeline({
        scrollTrigger: {
          trigger: ".about__pic",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      let tlAboutText = gsap.timeline({
        scrollTrigger: {
          trigger: ".about__title",
          start: "bottom 100%",
          toggleActions: "play none none none",
        },
      });

      let tlCoverAbout = gsap.timeline({
        scrollTrigger: {
          trigger: ".about .cover",
          start: "top 96%",
          toggleActions: "play none none none",
        },
      });

      tlGallery.fromTo(
        ".gallery-item__middle",
        {
          y: 80,
        },
        {
          y: -80,
        }
      );

      tlCourses.fromTo(
        ".course_animated",
        {
          y: 40,
        },
        {
          y: -40,
        }
      );

      tlPicture.fromTo(
        ".pic_bounded",
        {
          y: -70,
        },
        {
          y: 80,
        }
      );

      tlArticles.to(".articles-list", {
        y: -60,
      });

      tlAboutText.from(".about__title", {
        y: 100,
      });

      tlAboutPic.from(".about__pic", {
        alpha: 0.3,
      });

      tlCoverAbout.to(".about .cover", {
        height: 0,
        duration: 1.5,
      });

      gsap.from(".categories-item", {
        y: 80,
        alpha: 0,
        delay: 0.8,
        stagger: 0.1,
      });

      gsap.from(".promo-content > *", {
        y: 50,
        alpha: 0,
        duration: 1,
        stagger: 0.1,
      });

      gsap.from(".promo-pic_left-side", {
        x: -50,
        alpha: 0,
        duration: 1,
      });

      gsap.from(".promo-pic_right-side", {
        x: 50,
        alpha: 0,
        duration: 1,
      });
    },
  });

  const flkty = new Flickity(".promos", {
    prevNextButtons: false,
    fade: true,
    imagesLoaded: true,
    wrapAround: true,
  });

  flkty.on("change", function (index) {
    if (index > currentIndex) {
      gsap.from(".is-selected .promo-content", {
        y: 50,
        alpha: 0,
        duration: 0.5,
      });
    } else {
      gsap.from(".is-selected .promo-content", {
        y: -50,
        alpha: 0,
        duration: 0.5,
      });
    }

    gsap.from(".is-selected .promo-pic_left-side", {
      x: -50,
      alpha: 0,
      duration: 1,
    });

    gsap.from(".is-selected .promo-pic_right-side", {
      x: 50,
      alpha: 0,
      duration: 1,
    });

    currentIndex = index;
  });
});

window.addEventListener("scroll", () => {
  let lastScroll = 100;
  const currentScroll = window.pageYOffset;
  const scrollUp = "scroll-up";
  const scrollDown = "scroll-down";

  if (currentScroll <= 0) {
    body.classList.remove(scrollUp);
    return;
  }

  if (currentScroll > lastScroll && !body.classList.contains(scrollDown)) {
    // down
    body.classList.remove(scrollUp);
    body.classList.add(scrollDown);
    header.classList.add(scrollDown);
  } else if (
    currentScroll < lastScroll &&
    body.classList.contains(scrollDown)
  ) {
    // up
    body.classList.remove(scrollDown);
    body.classList.add(scrollUp);
    header.classList.remove(scrollDown);
  }
  lastScroll = currentScroll;
});

youTubeItems.forEach((item) => {
  item.addEventListener("click", () => {
    const url = item.dataset.video;
    const iframe = `<iframe
                  src="https://www.youtube.com/embed/${url}"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>`;
    const modalContent = document.querySelector("#modal-1-content");
    modalContent.insertAdjacentHTML("beforeend", iframe);
  });
});
