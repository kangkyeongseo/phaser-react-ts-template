const PauseSceneScreen = ({ resumeScene }: { resumeScene: () => void }) => {
    const restartBtnSrc = "/assets/img-common-restart-btn.webp";

    return (
        <div
            className="fixed top-0 flex h-[100vh] w-[100vw] cursor-pointer items-center justify-center"
            onClick={resumeScene}
        >
            <img src={restartBtnSrc} alt="restart-btn" />
        </div>
    );
};

export default PauseSceneScreen;
