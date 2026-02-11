import { useState, useRef, useCallback } from "react";
import { MoveHorizontal } from "lucide-react";

interface ImageComparisonSliderProps {
    beforeImage: string;
    afterImage: string;
}

const ImageComparisonSlider = ({
    beforeImage,
    afterImage,
}: ImageComparisonSliderProps) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = useCallback(
        (clientX: number) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
            const percentage = (x / rect.width) * 100;
            setSliderPosition(percentage);
            if (!hasInteracted) setHasInteracted(true);
        },
        [hasInteracted]
    );

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (!isDragging) return;
            e.preventDefault();
            handleMove(e.clientX);
        },
        [isDragging, handleMove]
    );

    const handleTouchMove = useCallback(
        (e: React.TouchEvent) => {
            handleMove(e.touches[0].clientX);
        },
        [handleMove]
    );

    const handleClick = (e: React.MouseEvent) => {
        if (!isDragging) handleMove(e.clientX);
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden cursor-col-resize select-none shadow-2xl shadow-black/20 border border-white/5"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            onClick={handleClick}
            style={{ touchAction: "none" }}
        >
            {/* After Image (Full — right side) */}
            <img
                src={afterImage}
                alt="After"
                className="w-full h-auto block"
                draggable={false}
            />

            {/* Before Image (Clipped — left side) */}
            <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img
                    src={beforeImage}
                    alt="Before"
                    className="w-full h-full object-cover"
                    draggable={false}
                />
            </div>

            {/* Slider Line */}
            <div
                className="absolute top-0 bottom-0 z-10"
                style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
            >
                {/* Vertical line */}
                <div className="absolute inset-0 w-[2px] bg-white/70 left-1/2 -translate-x-1/2" />

                {/* Glow */}
                <div
                    className="absolute inset-0 w-10 -translate-x-1/2 pointer-events-none"
                    style={{
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
                    }}
                />

                {/* Handle */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 backdrop-blur-xl shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center justify-center cursor-grab active:cursor-grabbing border border-white/60 hover:scale-110 active:scale-95 transition-all duration-200"
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                >
                    <MoveHorizontal size={18} className="text-gray-700" />
                </div>
            </div>

            {/* Instruction hint — fades out after first interaction */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none transition-opacity duration-500"
                style={{ opacity: hasInteracted ? 0 : 0.7 }}
            >
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-medium">
                    <span>← Drag to compare →</span>
                </div>
            </div>
        </div>
    );
};

export default ImageComparisonSlider;
