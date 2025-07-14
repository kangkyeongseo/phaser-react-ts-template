const PauseSceneScreen = ({ resumeScene }: { resumeScene: () => void }) => {
    const restartBtnSrc = "assets/shared/img-shared-restart-button.webp";

    return (
        <div
            className="fixed top-0 z-[10] flex h-[100vh] w-[100vw] cursor-pointer items-center justify-center bg-[rgba(0,0,0,0.5)]"
            onClick={resumeScene}
        >
            <img src={restartBtnSrc} alt="restart-btn" className="w-[10vw]" />
        </div>
    );
};

export default PauseSceneScreen;
