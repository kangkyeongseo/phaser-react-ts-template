const PauseSceneScreen = ({ resumeScene }: { resumeScene: () => void }) => {
    const restartBtnSrc = "assets/shared/img-common-restart-btn.webp";

    return (
        <div
            className="fixed top-0 flex h-[100vh] w-[100vw] cursor-pointer items-center justify-center bg-[rgba(0,0,0,0.5)]"
            onClick={resumeScene}
        >
            <img src={restartBtnSrc} alt="restart-btn" className="w-[10vw]" />
        </div>
    );
};

export default PauseSceneScreen;
