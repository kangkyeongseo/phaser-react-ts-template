const SpeedingAlert = () => {
    return (
        <div className="absolute top-[10%] left-[calc(50%-48px)] flex w-24 items-center justify-center gap-1 rounded-2xl bg-[rgba(28,28,28,0.7)] p-1 text-xs text-white md:left-[calc(50%-64px)] md:w-32 md:text-base">
            <span>2배속</span>
            <Icon delay={100} />
            <Icon delay={300} />
            <Icon delay={500} />
        </div>
    );
};

const Icon = ({ delay }: { delay: number }) => {
    return <span className={`animate-speeding-mode animation-delay-${delay} text-[8px] md:text-xs`}>▶</span>;
};

export default SpeedingAlert;
