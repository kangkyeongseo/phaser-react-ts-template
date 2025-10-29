window.__LOADING__ = window.__LOADING__ || {};
window.__LOADING__.stop = false;

const loadingContainer = document.querySelector(".loading-container");

const checkUrl = () => {
    const origin = window.location.origin;
    const url = new URL(origin);
    const cleanUrl = `${url.protocol}//${url.hostname}`;

    setTextLoading();
    if (cleanUrl.includes("school") || cleanUrl.includes("ms")) {
        setSchoolLoading();
    } else {
        setKidsLoading();
    }
};

const setSchoolLoading = () => {
    const logoContainer = document.createElement("div");
    const logoImage = document.createElement("img");
    logoContainer.className = "loading-container__logo";
    logoImage.src = "https://img.genikids.com/school/html5/loading/img-loading-logo-school.webp";
    logoImage.alt = "geni-school-logo";
    logoImage.onload = () => {
        const textContainer = document.querySelector(".loading-container__text");
        textContainer.classList.remove("transparent");
    };

    logoContainer.appendChild(logoImage);
    loadingContainer.prepend(logoContainer);

    handlelogoAnimation(logoImage);
};

const setKidsLoading = () => {
    let imgOnloadCount = 0;
    const characters = [];
    const characterArray = Array.from({ length: 5 }, (_, index) => index + 1);
    const characterContainer = document.createElement("div");
    characterArray.forEach((order) => {
        const count = order.toString().padStart(2, "0");
        const characterImage = document.createElement("img");
        characterImage.src = `https://img.genikids.com/html5/loading/img-loading-character-${count}.webp`;
        characterImage.alt = `loading-character-${count}`;
        characterContainer.appendChild(characterImage);
        characters.push(characterImage);
    });

    characters?.forEach((item) => {
        item.onload = () => {
            ++imgOnloadCount;
            if (imgOnloadCount === characters.length) {
                const textContainer = document.querySelector(".loading-container__text");
                textContainer.classList.remove("transparent");
            }
        };
    });

    characterContainer.className = "loading-container__character";
    loadingContainer.prepend(characterContainer);

    handleCharacterAnimation(characterContainer);
};

const setTextLoading = () => {
    const LOADING = "LOADING";
    const texts = [];
    const textContainer = document.createElement("div");
    LOADING.split("").forEach((letter) => {
        const letterSpan = document.createElement("span");
        letterSpan.innerText = letter;
        textContainer.appendChild(letterSpan);
        texts.push(letterSpan);
    });

    textContainer.className = "loading-container__text transparent";
    loadingContainer.appendChild(textContainer);

    textAnimation(textContainer);
};

function handlelogoAnimation(logo) {
    const logoFrames = [{ opacity: 0 }, { opacity: 1 }, { opacity: 1 }, { opacity: 1 }];
    const logoAnimaitionOptions = {
        duration: 1000,
        easing: "ease-in-out",
        fill: "forwards",
    };
    logo.animate(logoFrames, logoAnimaitionOptions);
}

function handleCharacterAnimation(characterContainer) {
    const characters = characterContainer?.querySelectorAll("img");
    const appearAnimations = [];
    const appearCharacterFrames = [
        { opacity: 0, transform: "translateY(0px)" },
        { opacity: 1, transform: "translateY(-40px)" },
        { opacity: 1, transform: "translateY(0px)" },
    ];
    const appearCharacterAnimaitionOptions = {
        duration: 1000,
        easing: "ease-in-out",
        fill: "forwards",
    };
    characters?.forEach((character, index) => {
        const delayOption = appearCharacterAnimaitionOptions;
        delayOption["delay"] = (index + 1) * 500;
        const animation = character.animate(appearCharacterFrames, delayOption);
        appearAnimations.push(animation);
    });

    appearAnimations.at(-1)?.finished.then(() => characterloading(characterContainer));
}

function textAnimation(textContainer) {
    const texts = textContainer.querySelectorAll("span");
    const textAnimations = [];
    const textFrames = [{ scale: 1 }, { scale: 0.8 }];
    const textAnimaitionOptions = {
        duration: 700,
        easing: "ease-in-out",
        iterations: Infinity,
        direction: "alternate",
    };
    texts?.forEach((text, index) => {
        const delayOption = textAnimaitionOptions;
        delayOption["delay"] = (index + 1) * 100;
        const animation = text.animate(textFrames, delayOption);
        textAnimations.push(animation);
    });
}

function characterloading(characterContainer) {
    if (window.__LOADING__.stop) return;

    const characters = characterContainer?.querySelectorAll("img");
    const animations = [];
    const characterFrames = [
        { transform: "translateY(0px)" },
        { transform: "translateY(-40px) rotate(-5deg)" },
        { transform: "translateY(-40px) rotate(3deg)" },
        { transform: "translateY(0px)" },
    ];
    const characterAnimaitionOptions = {
        duration: 600,
        easing: "ease-in-out",
        fill: "forwards",
    };
    characters?.forEach((character, index) => {
        const delayOption = characterAnimaitionOptions;
        delayOption["delay"] = (index + 1) * 200;
        const animation = character.animate(characterFrames, delayOption);
        animations.push(animation);
    });

    animations.at(-1)?.finished.then(() => characterloading(characterContainer));
}

checkUrl();
