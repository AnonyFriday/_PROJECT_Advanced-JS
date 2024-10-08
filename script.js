'use strict';

///////////////////////////////////////
// Modal window
///////////////////////////////////////

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

// Open Modal
const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

btnsOpenModal.forEach(btn => {
  btn.addEventListener('click', openModal);
});

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

// Close Modal
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Smooth Scrolling
///////////////////////////////////////
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (event) {
  const section1Coords = section1.getBoundingClientRect();

  console.log('Section', section1Coords);

  console.log('BTN', event.target.getBoundingClientRect());

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // scroll
  // - scroll Y: from the top most of the scrollbar
  // - section1Coords.top: from the top most of the viewport
  // - distance from the section to the top most of the scrollbar = top of section + current scrollY
  window.scrollTo({
    top: section1Coords.top + window.scrollY,
    left: section1Coords.left + window.scrollX,
    behavior: 'smooth',
  });

  console.log('Current scroll (X/Y)', window.scrollX, window.scrollY);
});

///////////////////////////////////////
// Navigation Smooth Scrolling
///////////////////////////////////////
const navLinks = document.querySelector('.nav__links');
navLinks.addEventListener('click', function (event) {
  // Prevent the href of default form submission
  event.preventDefault();

  // Only capture the nav__link when bubbling to the nav__links
  if (event.target.classList.contains('nav__link')) {
    const id = event.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth',
    });
  }
});

///////////////////////////////////////
// DOM Traversal
///////////////////////////////////////

// // Going Down
// const h1 = document.querySelector('h1');
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes); // return NodeList: text node, comment nodes and element nodes
// console.log(h1.children); // return HTMLElement List:
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'black';

// // Going up
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// // Going sideways
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.previousSibling);

///////////////////////////////////////
// Tabbed Component
///////////////////////////////////////
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');

// 1. Bubbling the event target of each button into the parent element
tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();
  const btnTabClicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!btnTabClicked) return;

  // Activate the tab
  // - remove all actives and add active to the clicked one
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  btnTabClicked.classList.add('operations__tab--active');

  // Activate content area
  // - using dataset
  // - remove all active class before adding to the current active one
  tabsContent.forEach(tabContent =>
    tabContent.classList.remove('operations__content--active')
  );

  document
    .querySelector(`.operations__content--${btnTabClicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////
// Menu Fade Animation
///////////////////////////////////////

const nav = document.querySelector('.nav');

// A function to handle opacity of other siblings versus the current link
// - event will be passed automatically at the end of args
// - If bind(1) => this = 1,
// - If bind(1,2) => this = 1, using rest operator to get other arguments
// - event is the last, if don't use ...args then use argument 'e'
const handleHover = function (...args) {
  // Stupid Behavior in JS
  const e = args.pop();
  const opacity = this;
  const extraArgument = args[0];

  // current link, siblings link, logo
  const currentLink = e.target;
  const siblingLinks = currentLink
    .closest('.nav')
    .querySelectorAll('.nav__link');
  const logo = currentLink.closest('.nav').querySelector('.nav__logo');

  // fade siblings and logo except the current link
  siblingLinks.forEach(link => {
    if (currentLink != link) {
      link.style.opacity = opacity;
    }
  });
  logo.style.opacity = opacity;
};

// Fading other Links and Logo when mouseover the current link
// - Passing "arguments" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5, 2));

// Clear all fades when hot hovering
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////
// Sticky Navigation (Scrolling and Intersection API)
///////////////////////////////////////

// // When scrolling to the first section,make the navigation sticky
// // - scrollbar viewport to document greater than section top bounding
// const section1Coords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function (e) {
//   if (window.scrollY >= section1Coords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

// Intersection Observer API
// - When the header is out of the viewport, then we add sticky to the header
// - Observe the header(target) correspond with viewport
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const obsHeaderCallback = function (entries, observer) {
  // initial state: all entries
  // when reaching threshold, only 1 entry
  const headerEntry = entries[0];

  // console.log(headerEntry); // infor of entry
  // console.log(observer); // infor of observer

  if (!headerEntry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

let viewportHeaderObserver = new IntersectionObserver(obsHeaderCallback, {
  root: null,
  threshold: [0.7], // in range of 0 to 1, the intersection mark of the target with viewport
  rootMargin: `${-navHeight}px 0px 0px 0px`, // expand the viewport to navHeight px
});
viewportHeaderObserver.observe(header);

////////////////////////////////////////////////////////
// Revealing Sections using Intersection Observer API
////////////////////////////////////////////////////////

// Using Intersection Observer API
// - reveal section on ratio of 15%
// - hidden section when ratio < 15%
// - when reveal all sections, unobserve sections to avoid calling callbacks
const sections = document.querySelectorAll('.section');

const obsSectionCallback = function (entries, observer) {
  const [entry] = entries;

  // handle the initial state when isIntersecting = false
  if (!entry.isIntersecting) return;

  // when the isIntersectiong = true (hitting the first threshold)
  entry.target.classList.remove('section--hidden');

  // after hitting the first threshold, unobserve the element
  // to avoid invoking callback (improve performance)
  observer.unobserve(entry.target);
};

const viewportSectionsObserver = new IntersectionObserver(obsSectionCallback, {
  root: null,
  threshold: [0.15],
});

sections.forEach(section => {
  viewportSectionsObserver.observe(section);
  section.classList.add('section--hidden'); // all will be hidden by default
});

////////////////////////////////////////////////////////
// Lazy-Loading Images
////////////////////////////////////////////////////////

// Performant-critical on Lazy Loading Images
// - set src to the lightweight img's src by default (add some blur with css)
// - when reaching the threshold, set src with high-resolution image
// - addEventListener('load') to load the high-res image, then remove blur after finishing loading

const imgTargets = document.querySelectorAll('img[data-src]');

const obsLazyLoadingCallback = function (entries, observer) {
  const [entry] = entries;

  // If not reaching the entry and initial state
  if (!entry.isIntersecting) return;

  // Assign the data-src to the src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function (e) {
    entry.target.classList.remove('lazy-img');
  });
};

const viewportImagesObserver = new IntersectionObserver(
  obsLazyLoadingCallback,
  {
    root: null,
    threshold: [0],
  }
);

imgTargets.forEach(img => {
  viewportImagesObserver.observe(img);
});
