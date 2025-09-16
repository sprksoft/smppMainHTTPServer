const previewContainers = document.querySelectorAll(".preview-img-container");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
let activeCardIndex = 1;

if (!previewContainers.length || !prevButton || !nextButton)
  console.error("Required elements not found");

const getNextCardIndex = (currentIndex) =>
  (currentIndex + 1) % previewContainers.length;
const getPrevCardIndex = (currentIndex) =>
  (currentIndex - 1 + previewContainers.length) % previewContainers.length;

function updateCard() {
  previewContainers.forEach((preview) => {
    preview.classList.remove("active", "next", "prev", "ready");
  });

  const nextCardIndex = getNextCardIndex(activeCardIndex);
  const prevCardIndex = getPrevCardIndex(activeCardIndex);
  previewContainers[activeCardIndex].addEventListener(
    "transitionend",
    () => {
      previewContainers[activeCardIndex].classList.add("ready");
    },
    { once: true }
  );
  previewContainers[activeCardIndex].classList.add("active");
  previewContainers[nextCardIndex].classList.add("next");
  previewContainers[prevCardIndex].classList.add("prev");
}

function showPrevCard() {
  activeCardIndex = getPrevCardIndex(activeCardIndex);
  updateCard();
}

function showNextCard() {
  activeCardIndex = getNextCardIndex(activeCardIndex);
  updateCard();
}

prevButton.addEventListener("click", showPrevCard);
nextButton.addEventListener("click", showNextCard);

updateCard();

const times = [
  [10, 25],
  [12, 15],
  [16, 10],
  [20, 30],
];
const timePoints = [
  document.getElementById("point-10am"),
  document.getElementById("point-12am"),
  document.getElementById("point-4pm"),
  document.getElementById("point-8pm"),
];
// Use translations from the server
const timeTitlesENG = [
  window.jsTranslations.first_break || "First Break🍎",
  window.jsTranslations.lunch || "Lunch🥪",
  window.jsTranslations.schools_out || "School's Out!🏫",
  window.jsTranslations.night_checkin || "Night Check-in💤",
];
const timeTitlesMobileENG = [
  window.jsTranslations.break_mobile || "Break🍎",
  window.jsTranslations.lunch_mobile || "Lunch🥪",
  window.jsTranslations.done_mobile || "Done! 🏫",
  window.jsTranslations.night_mobile || "Night💤",
];
const prodPreviewDescriptionsENG = [
  window.jsTranslations.sweater_weather ||
    `See if it's <a href="https://open.spotify.com/track/2QjOHCTQ1Jl3zawyYOpxh6?si=62dad11bc7384e79" target="_blank" class="accent-text"> sweater weather </a> outside`,
  window.jsTranslations.lessons_afternoon ||
    `Check which <span class="accent-text">lessons</span> you have in the afternoon`,
  window.jsTranslations.your_bus_arrive ||
    `Find out when <span class="accent-text">your bus</span> will arrive`,
  window.jsTranslations.homework_check ||
    `Quickly check if you made your <span class="accent-text">homework</span>`,
];
const prodPreviewImagesPrimary = [
  "media/previewWeather.webp",
  "media/previewPlanner1.webp",
  "media/previewDelijn.webp",
  "media/previewPlanner2.webp",
];
const prodPreviewImages = [
  "media/previewWeather.png",
  "media/previewPlanner1.png",
  "media/previewDelijn.png",
  "media/previewPlanner2.png",
];
const prodPreviewTitles = [
  window.jsTranslations.weather_title || "Weather 🌧️",
  window.jsTranslations.planner_title || "Planner 📆",
  window.jsTranslations.delijn_title || "Delijn 🚌",
  window.jsTranslations.planner_title || "Planner 📆",
];
let activeTimeIndex = 0;

function updateProdPreview() {
  document.getElementById("preview-prod-description").innerHTML =
    prodPreviewDescriptionsENG[activeTimeIndex];
  document.getElementById("preview-prod-img-primary-source").srcset =
    prodPreviewImagesPrimary[activeTimeIndex];
  document.getElementById("preview-prod-img").src =
    prodPreviewImages[activeTimeIndex];
  document.getElementById("preview-prod-title").innerText =
    prodPreviewTitles[activeTimeIndex];
}

function updateClock(shouldAnimate) {
  if (shouldAnimate) {
    document.getElementById("prod-preview").classList.add("changing");
    document
      .getElementById("prod-preview")
      .addEventListener("animationiteration", updateProdPreview);
    document
      .getElementById("prod-preview")
      .addEventListener("animationend", function prodAnimationEndHandler() {
        document
          .getElementById("prod-preview")
          .removeEventListener("animationiteration", updateProdPreview);
        document
          .getElementById("prod-preview")
          .removeEventListener("animationend", prodAnimationEndHandler);
        document.getElementById("prod-preview").classList.remove("changing");
      });
  } else {
    updateProdPreview();
  }
  timePoints.forEach((timePointsID) => {
    timePointsID.classList.remove("active");
  });
  timePoints[activeTimeIndex].classList.add("active");
  document.getElementById("clock-title").innerText =
    timeTitlesENG[activeTimeIndex];
  document.getElementById("clock-title-mobile").innerText =
    timeTitlesMobileENG[activeTimeIndex];
  hoursminutes = times[activeTimeIndex];
  let hours = hoursminutes[0];
  let minutes = hoursminutes[1];
  document.getElementById("digital-time").innerText =
    hours + ":" + (minutes < 10 ? "0" + minutes : minutes);
  if (hours > 12) hours -= 12;
  let minutesAngle = minutes * 6;
  let hoursAngle = hours * 30 + minutes / 2;
  if (minutesAngle > 270) minutesAngle -= 360;
  if (hoursAngle > 270) hoursAngle -= 360;
  document.getElementById(
    "big-handle"
  ).style.transform = `rotate(${minutesAngle}deg)`;
  document.getElementById(
    "small-handle"
  ).style.transform = `rotate(${hoursAngle}deg)`;
}

document.getElementById("point-10am").addEventListener("click", () => {
  let shouldAnimate = activeTimeIndex != 0;
  activeTimeIndex = 0;
  updateClock(shouldAnimate);
});
document.getElementById("point-12am").addEventListener("click", () => {
  let shouldAnimate = activeTimeIndex != 1;
  activeTimeIndex = 1;
  updateClock(shouldAnimate);
});
document.getElementById("point-4pm").addEventListener("click", () => {
  let shouldAnimate = activeTimeIndex != 2;
  activeTimeIndex = 2;
  updateClock(shouldAnimate);
});
document.getElementById("point-8pm").addEventListener("click", () => {
  let shouldAnimate = activeTimeIndex != 3;
  activeTimeIndex = 3;
  updateClock(shouldAnimate);
});

function nextTime() {
  activeTimeIndex += 1;
  if (activeTimeIndex > 3) activeTimeIndex = 0;
  updateClock(true);
}
function prevTime() {
  activeTimeIndex -= 1;
  if (activeTimeIndex < 0) activeTimeIndex = 3;
  updateClock(true);
}

document.getElementById("time-back-button").addEventListener("click", prevTime);
document
  .getElementById("time-forward-button")
  .addEventListener("click", nextTime);
updateClock(false);

let activeFunIndex = 0;
const funApps = [
  document.getElementById("fun-app-flappy"),
  document.getElementById("fun-app-snake"),
  document.getElementById("fun-app-plant"),
  document.getElementById("fun-app-gc"),
];
const funAppMedia = [
  "media/previewFlappy.mp4",
  "media/previewSnake.mp4",
  "media/previewPlant.mp4",
  "media/previewGC.mp4",
];

function updateFunPreviewData() {
  document.getElementById("fun-app-preview").src = funAppMedia[activeFunIndex];
}

function updateFunPreview(shouldAnimate, extraFun) {
  let preview = document.getElementById("fun-app-preview");
  let volumeContainer = document.getElementById("volume-container");
  if (extraFun) {
    preview.classList.remove("active");
    volumeContainer.classList.add("active");
    document.getElementById("volume-icon").innerHTML = `
        <path d="M12.1657 2.14424C12.8728 2.50021 13 3.27314 13 3.7446V20.2561C13 20.7286 12.8717 21.4998 12.1656 21.8554C11.416 22.2331 10.7175 21.8081 10.3623 21.4891L4.95001 16.6248H3.00001C1.89544 16.6248 1.00001 15.7293 1.00001 14.6248L1 9.43717C1 8.3326 1.89543 7.43717 3 7.43717H4.94661L10.3623 2.51158C10.7163 2.19354 11.4151 1.76635 12.1657 2.14424Z" />
        <path class="volume-icon-x" d="M21.8232 15.6767C21.4327 16.0673 20.7995 16.0673 20.409 15.6768L18.5 13.7678L16.591 15.6768C16.2005 16.0673 15.5673 16.0673 15.1768 15.6767L14.8233 15.3232C14.4327 14.9327 14.4327 14.2995 14.8233 13.909L16.7322 12L14.8232 10.091C14.4327 9.70044 14.4327 9.06727 14.8232 8.67675L15.1767 8.3232C15.5673 7.93267 16.2004 7.93267 16.591 8.32319L18.5 10.2322L20.409 8.32319C20.7996 7.93267 21.4327 7.93267 21.8233 8.3232L22.1768 8.67675C22.5673 9.06727 22.5673 9.70044 22.1768 10.091L20.2678 12L22.1767 13.909C22.5673 14.2995 22.5673 14.9327 22.1767 15.3232L21.8232 15.6767Z" />`;
    document.getElementById("volume-text").innerHTML =
      window.jsTranslations.volume_turn_on ||
      `Please turn on volume for the full experience`;
    document.getElementById("volume-icon").classList.add("volume-icon-hover");
    document
      .getElementById("volume-icon")
      .addEventListener("click", function () {
        document.getElementById("volume-icon").innerHTML = `
            <path d="M13 3.7446C13 3.27314 12.8728 2.50021 12.1657 2.14424C11.4151 1.76635 10.7163 2.19354 10.3623 2.51158L4.94661 7.43717H3C1.89543 7.43717 1 8.3326 1 9.43717L1.00001 14.6248C1.00001 15.7293 1.89544 16.6248 3.00001 16.6248H4.95001L10.3623 21.4891C10.7175 21.8081 11.416 22.2331 12.1656 21.8554C12.8717 21.4998 13 20.7286 13 20.2561V3.7446Z" />
            <path d="M17.336 3.79605L17.0952 3.72886C16.5633 3.58042 16.0117 3.89132 15.8632 4.42329L15.7289 4.90489C15.5804 5.43685 15.8913 5.98843 16.4233 6.13687L16.6641 6.20406C18.9551 6.84336 20.7501 9.14615 20.7501 12.0001C20.7501 14.854 18.9551 17.1568 16.6641 17.7961L16.4233 17.8632C15.8913 18.0117 15.5804 18.5633 15.7289 19.0952L15.8632 19.5768C16.0117 20.1088 16.5633 20.4197 17.0952 20.2713L17.336 20.2041C20.7957 19.2387 23.2501 15.8818 23.2501 12.0001C23.2501 8.11832 20.7957 4.76146 17.336 3.79605Z" />
            <path d="M16.3581 7.80239L16.1185 7.73078C15.5894 7.57258 15.0322 7.87329 14.874 8.40243L14.7308 8.88148C14.5726 9.41062 14.8733 9.96782 15.4024 10.126L15.642 10.1976C16.1752 10.3571 16.75 11.012 16.75 12C16.75 12.9881 16.1752 13.643 15.642 13.8024L15.4024 13.874C14.8733 14.0322 14.5726 14.5894 14.7308 15.1185L14.874 15.5976C15.0322 16.1267 15.5894 16.4274 16.1185 16.2692L16.3581 16.1976C18.1251 15.6693 19.25 13.8987 19.25 12C19.25 10.1014 18.1251 8.33068 16.3581 7.80239Z" />`;
        document.getElementById("volume-text").innerHTML =
          window.jsTranslations.volume_continue ||
          `Press <span id="fun-continue-button" class="accent-text">here</span> to continue`;
        document
          .getElementById("volume-icon")
          .classList.remove("volume-icon-hover");
        document
          .getElementById("fun-continue-button")
          .addEventListener("click", function () {
            volumeContainer.classList.remove("active");
            preview.classList.add("active");
            preview.controls = true;
            preview.muted = false;
            if (activeFunIndex == 0) {
              preview.src = "/media/flappyOfDoom.mp4";
            } else if (activeFunIndex == 1) {
              preview.src = "/media/snakeOfDoom.mp4";
            }
          });
      });
    return;
  }
  volumeContainer.classList.remove("active");
  preview.classList.add("active");
  preview.controls = false;
  preview.muted = true;
  if (shouldAnimate) {
    document.getElementById("fun-app-preview").classList.add("changing");
    document
      .getElementById("fun-app-preview")
      .addEventListener("animationiteration", updateFunPreviewData);
    document
      .getElementById("fun-app-preview")
      .addEventListener("animationend", function funAnimationEndHandler() {
        document
          .getElementById("fun-app-preview")
          .removeEventListener("animationiteration", updateFunPreviewData);
        document
          .getElementById("fun-app-preview")
          .removeEventListener("animationend", funAnimationEndHandler);
        document.getElementById("fun-app-preview").classList.remove("changing");
      });
  } else {
    updateFunPreviewData();
  }
  funApps.forEach((funApp) => {
    funApp.classList.remove("active");
  });
  funApps[activeFunIndex].classList.add("active");
}
const resetDelay = 500; // 500ms
let lastFlappyClickTime = 0;
let lastSnakeClickTime = 0;
let flappyClickCount = 0;
let snakeClickCount = 0;
let lastClickedOn = 0;

document.getElementById("fun-app-flappy").addEventListener("click", () => {
  const now = Date.now();
  if (now - lastFlappyClickTime > resetDelay) {
    flappyClickCount = 0;
  }
  flappyClickCount++;
  lastFlappyClickTime = now;
  let shouldAnimate = activeFunIndex != 0;
  activeFunIndex = 0;

  if (flappyClickCount >= 5) {
    updateFunPreview(shouldAnimate, true);
    flappyClickCount = 0;
    return;
  }
  if (lastClickedOn != 0) {
    updateFunPreview(shouldAnimate, false);
  }
  lastClickedOn = 0;
});
document.getElementById("fun-app-snake").addEventListener("click", () => {
  const now = Date.now();

  if (now - lastSnakeClickTime > resetDelay) {
    snakeClickCount = 0;
  }
  snakeClickCount++;
  lastSnakeClickTime = now;

  let shouldAnimate = activeFunIndex != 1;
  activeFunIndex = 1;

  if (snakeClickCount >= 5) {
    updateFunPreview(shouldAnimate, true);
    snakeClickCount = 0;
    return;
  }
  if (lastClickedOn != 1) {
    updateFunPreview(shouldAnimate, false);
  }
  lastClickedOn = 1;
});
document.getElementById("fun-app-plant").addEventListener("click", () => {
  let shouldAnimate = activeFunIndex != 2;
  activeFunIndex = 2;
  if (lastClickedOn != 2) {
    updateFunPreview(shouldAnimate, false);
  }
  lastClickedOn = 2;
});
document.getElementById("fun-app-gc").addEventListener("click", () => {
  let shouldAnimate = activeFunIndex != 3;
  activeFunIndex = 3;
  if (lastClickedOn != 3) {
    updateFunPreview(shouldAnimate, false);
  }
  lastClickedOn = 3;
});
const targetElement = document.getElementById("fun-container");
const funObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      updateFunPreview(false, false);
      funObserver.unobserve(targetElement);
    }
  });
});

funObserver.observe(targetElement);
