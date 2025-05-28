export {};

declare global {
    interface Window {
        gCloseWindow: () => void;
        gClearGame: (GameId: string, IsSucces: boolean) => void;
    }
}

window.gCloseWindow = () => window.close();
window.gClearGame = (GameId: string, IsSucces: boolean) =>
    console.log("func:clearGame -> " + GameId, IsSucces);

const characterLoding = document.querySelector(".loading-container__character");
const characters = characterLoding?.querySelectorAll("img");
const textLoading = document.querySelector(".loading-container__text");
const texts = textLoading?.querySelectorAll("span");

const loading = () => {
    const animations: Animation[] = [];
    const characterFrames = [
        { transform: "translateY(0px)" },
        { transform: "translateY(-40px) rotate(-5deg)" },
        { transform: "translateY(-40px) rotate(3deg)" },
        { transform: "translateY(0px)" },
    ];
    const characterAnimaitionOptions: KeyframeAnimationOptions = {
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

    animations.at(-1)?.finished.then(() => loading());
};

const textAnimation = () => {
    const textAnimations = [];
    const textFrames = [{ scale: 1 }, { scale: 0.8 }];
    const textAnimaitionOptions: KeyframeAnimationOptions = {
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
};

const appearCharacterAnimation = () => {
    const appearAnimations: Animation[] = [];
    const appearCharacterFrames = [
        { opacity: 0, transform: "translateY(0px)" },
        { opacity: 1, transform: "translateY(-40px)" },
        { opacity: 1, transform: "translateY(0px)" },
    ];
    const appearCharacterAnimaitionOptions: KeyframeAnimationOptions = {
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

    appearAnimations.at(-1)?.finished.then(() => loading());
};

// 초기 랜더링
const appearCharacter = () => {
    let imgOnloadCount = 0;
    // 캐시 상태 확인
    characters?.forEach((item) => {
        if (item.complete) imgOnloadCount++;
    });
    // 모든 이미지 로드 후 애니메이션 시작
    if (imgOnloadCount !== characters?.length) {
        characters?.forEach((item) => {
            item.onload = () => {
                ++imgOnloadCount;
                if (imgOnloadCount === characters.length) {
                    appearCharacterAnimation();
                }
            };
        });
    } else {
        appearCharacterAnimation();
    }
};

textAnimation();
appearCharacter();
