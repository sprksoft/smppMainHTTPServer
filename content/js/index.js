const previewContainers = document.querySelectorAll(".preview-img-container");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
let activeCardIndex = 1;

if (!previewContainers.length || !prevButton || !nextButton) console.error("Required elements not found");

const getNextCardIndex = (currentIndex) => (currentIndex + 1) % previewContainers.length;
const getPrevCardIndex = (currentIndex) => (currentIndex - 1 + previewContainers.length) % previewContainers.length;

function updateCard() {
    previewContainers.forEach(preview => {
        preview.classList.remove("active", "next", "prev", "ready");
    });

    const nextCardIndex = getNextCardIndex(activeCardIndex);
    const prevCardIndex = getPrevCardIndex(activeCardIndex);
    previewContainers[activeCardIndex].addEventListener("transitionend", () => {
        previewContainers[activeCardIndex].classList.add("ready");
    }, { once: true });
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

const times = [[10, 25], [12, 15], [16, 10], [20, 30]]
const timePoints = [
    document.getElementById("point-10am"),
    document.getElementById("point-12am"),
    document.getElementById("point-4pm"),
    document.getElementById("point-8pm")
]
const timeTitlesENG = ["First Break🍎", "Lunch🥪", "School's Out!🏫", "Night Check-in💤"]
const timeTitlesMobileENG = ["Break🍎", "Lunch🥪", "Done! 🏫", "Night💤"]
const prodPreviewDescriptionsENG = [
    `See if it's <a href="https://open.spotify.com/track/2QjOHCTQ1Jl3zawyYOpxh6?si=62dad11bc7384e79" target="_blank" class="accent-text"> sweater weather </a> outside`,
    `Check which <span class="accent-text">lessons</span> you have in the afternoon`,
    `Find out when <span class="accent-text">your bus</span> will arrive`,
    `Quickly check if you made your <span class="accent-text">homework</span>`
]
const prodPreviewImagesPrimary = [
    "media/previewWeather.webp",
    "media/previewPlanner1.webp",
    "media/previewDelijn.webp",
    "media/previewPlanner2.webp"
]
const prodPreviewImages = [
    "media/previewWeather.png",
    "media/previewPlanner1.png",
    "media/previewDelijn.png",
    "media/previewPlanner2.png"
]
const prodPreviewTitles = [
    "Weather 🌧️",
    "Planner 📆",
    "Delijn 🚌",
    "Planner 📆"
]
let activeTimeIndex = 0

function updateProdPreview() {
    document.getElementById("preview-prod-description").innerHTML = prodPreviewDescriptionsENG[activeTimeIndex]
    document.getElementById("preview-prod-img-primary-source").srcset = prodPreviewImagesPrimary[activeTimeIndex]
    document.getElementById("preview-prod-img").src = prodPreviewImages[activeTimeIndex]
    document.getElementById("preview-prod-title").innerText = prodPreviewTitles[activeTimeIndex]
}

function updateClock(shouldAnimate) {
    if (shouldAnimate) {
        document.getElementById("prod-preview").classList.add("changing")
        document.getElementById("prod-preview").addEventListener("animationiteration", updateProdPreview)
        document.getElementById("prod-preview").addEventListener("animationend", function prodAnimationEndHandler() {
            document.getElementById("prod-preview").removeEventListener("animationiteration", updateProdPreview)
            document.getElementById("prod-preview").removeEventListener("animationend", prodAnimationEndHandler)
            document.getElementById("prod-preview").classList.remove("changing")
        })
    } else {
        updateProdPreview()
    }
    timePoints.forEach(timePointsID => {
        timePointsID.classList.remove("active")
    })
    timePoints[activeTimeIndex].classList.add("active")
    document.getElementById("clock-title").innerText = timeTitlesENG[activeTimeIndex]
    document.getElementById("clock-title-mobile").innerText = timeTitlesMobileENG[activeTimeIndex]
    hoursminutes = times[activeTimeIndex]
    let hours = hoursminutes[0]
    let minutes = hoursminutes[1]
    document.getElementById("digital-time").innerText = hours + ":" + (minutes < 10 ? ("0" + minutes) : minutes)
    if (hours > 12) hours -= 12;
    let minutesAngle = minutes * 6
    let hoursAngle = hours * 30 + (minutes / 2)
    if (minutesAngle > 270) minutesAngle -= 360
    if (hoursAngle > 270) hoursAngle -= 360
    document.getElementById("big-handle").style.transform = `rotate(${minutesAngle}deg)`
    document.getElementById("small-handle").style.transform = `rotate(${hoursAngle}deg)`
}

document.getElementById("point-10am").addEventListener("click", () => {
    let shouldAnimate = activeTimeIndex != 0
    activeTimeIndex = 0
    updateClock(shouldAnimate)
})
document.getElementById("point-12am").addEventListener("click", () => {
    let shouldAnimate = activeTimeIndex != 1
    activeTimeIndex = 1
    updateClock(shouldAnimate)
})
document.getElementById("point-4pm").addEventListener("click", () => {
    let shouldAnimate = activeTimeIndex != 2
    activeTimeIndex = 2
    updateClock(shouldAnimate)
})
document.getElementById("point-8pm").addEventListener("click", () => {
    let shouldAnimate = activeTimeIndex != 3
    activeTimeIndex = 3
    updateClock(shouldAnimate)
})


function nextTime() {
    activeTimeIndex += 1
    if (activeTimeIndex > 3) activeTimeIndex = 0
    updateClock(true)
}
function prevTime() {
    activeTimeIndex -= 1
    if (activeTimeIndex < 0) activeTimeIndex = 3
    updateClock(true)
}

document.getElementById("time-back-button").addEventListener("click", prevTime)
document.getElementById("time-forward-button").addEventListener("click", nextTime)
updateClock(false)

let activeFunIndex = 0
const funApps = [
    document.getElementById("fun-app-flappy"),
    document.getElementById("fun-app-snake"),
    document.getElementById("fun-app-plant"),
    document.getElementById("fun-app-gc")
]
const funAppMedia = [
    "media/previewFlappy.mp4",
    "media/previewSnake.mp4",
    "media/previewPlant.mp4",
    "media/previewGC.mp4"
]

function updateFunPreviewData() {
    document.getElementById("fun-app-preview").src = funAppMedia[activeFunIndex]
}

function updateFunPreview(shouldAnimate, extraFun) {
    if (extraFun) {
        document.getElementById("fun-app-preview").controls = true
        document.getElementById("fun-app-preview").muted = false
        if (activeFunIndex == 0) {
            // document.getElementById("fun-app-preview").src = "media/"
        } else if (activeFunIndex == 1) {

        }
        return
    }
    document.getElementById("fun-app-preview").controls = false
    document.getElementById("fun-app-preview").muted = true
    if (shouldAnimate) {
        document.getElementById("fun-app-preview").classList.add("changing")
        document.getElementById("fun-app-preview").addEventListener("animationiteration", updateFunPreviewData)
        document.getElementById("fun-app-preview").addEventListener("animationend", function funAnimationEndHandler() {
            document.getElementById("fun-app-preview").removeEventListener("animationiteration", updateFunPreviewData)
            document.getElementById("fun-app-preview").removeEventListener("animationend", funAnimationEndHandler)
            document.getElementById("fun-app-preview").classList.remove("changing")
        })
    } else {
        updateFunPreviewData()
    }
    funApps.forEach(funApp => {
        funApp.classList.remove("active")
    })
    funApps[activeFunIndex].classList.add("active")
}
const resetDelay = 2000; // 2000ms
let lastFlappyClickTime = 0;
let lastSnakeClickTime = 0;
let flappyClickCount = 0;
let snakeClickCount = 0;

document.getElementById("fun-app-flappy").addEventListener("click", () => {
    const now = Date.now();
    if (now - lastFlappyClickTime > resetDelay) {
        flappyClickCount = 0;
    }
    flappyClickCount++
    lastFlappyClickTime = now
    let shouldAnimate = activeFunIndex != 0
    activeFunIndex = 0

    if (flappyClickCount >= 5) {
        updateFunPreview(shouldAnimate, true)
        flappyClickCount = 0;
        return;
    }
    updateFunPreview(shouldAnimate, false)
})
document.getElementById("fun-app-snake").addEventListener("click", () => {
    const now = Date.now();

    if (now - lastFlappyClickTime > resetDelay) {
        snakeClickCount = 0;
    }
    snakeClickCount++
    lastSnakeClickTime = now

    let shouldAnimate = activeFunIndex != 1
    activeFunIndex = 1

    if (snakeClickCount >= 5) {
        updateFunPreview(shouldAnimate, true)
        snakeClickCount = 0;
        return;
    }
    updateFunPreview(shouldAnimate, false)
})
document.getElementById("fun-app-plant").addEventListener("click", () => {
    let shouldAnimate = activeFunIndex != 2
    activeFunIndex = 2
    updateFunPreview(shouldAnimate, false)
})
document.getElementById("fun-app-gc").addEventListener("click", () => {
    let shouldAnimate = activeFunIndex != 3
    activeFunIndex = 3
    updateFunPreview(shouldAnimate, false)
})
const targetElement = document.getElementById("fun-container");
const funObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            updateFunPreview(false, false)
            funObserver.unobserve(targetElement)
        }
    });
});

funObserver.observe(targetElement);