import { useState, useRef, useCallback, useEffect } from "react";
import { MoveHorizontal } from "lucide-react";

interface ImageComparisonSliderProps {
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
  // دعم الأسماء البديلة لمنع أخطاء TypeScript في حال تمرير left/right
  leftImage?: string;
  rightImage?: string;
  leftLabel?: string;
  rightLabel?: string;
}

const ImageComparisonSlider = ({
  beforeImage,
  afterImage,
  beforeLabel,
  afterLabel,
  leftImage,
  rightImage,
  leftLabel,
  rightLabel,
}: ImageComparisonSliderProps) => {
  const resolvedBeforeImage = beforeImage || leftImage || "";
  const resolvedAfterImage = afterImage || rightImage || "";
  const resolvedBeforeLabel = beforeLabel || leftLabel || "Dark Edition";
  const resolvedAfterLabel = afterLabel || rightLabel || "Light Edition";

  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width === 0) return;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
    setHasInteracted(true);
  }, []);

  // متابعة حركة الماوس واللمس على مستوى النافذة أثناء السحب لعدم تعليق الشريط
  useEffect(() => {
    if (!isDragging) return;

    const onWindowMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onWindowTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) handleMove(e.touches[0].clientX);
    };
    const onWindowUp = () => setIsDragging(false);

    window.addEventListener("mousemove", onWindowMouseMove);
    window.addEventListener("touchmove", onWindowTouchMove, { passive: true });
    window.addEventListener("mouseup", onWindowUp);
    window.addEventListener("touchend", onWindowUp);

    return () => {
      window.removeEventListener("mousemove", onWindowMouseMove);
      window.removeEventListener("touchmove", onWindowTouchMove);
      window.removeEventListener("mouseup", onWindowUp);
      window.removeEventListener("touchend", onWindowUp);
    };
  }, [isDragging, handleMove]);

  const handlePointerDown = (clientX: number) => {
    setIsDragging(true);
    handleMove(clientX);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setSliderPosition((prev) => Math.max(0, prev - 5));
      setHasInteracted(true);
    } else if (e.key === "ArrowRight") {
      setSliderPosition((prev) => Math.min(100, prev + 5));
      setHasInteracted(true);
    }
  };

  return (
    <div
      ref={containerRef}
      role="slider"
      tabIndex={0}
      aria-label="Image comparison slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(sliderPosition)}
      onKeyDown={handleKeyDown}
      onMouseDown={(e) => handlePointerDown(e.clientX)}
      onTouchStart={(e) => {
        if (e.touches.length > 0) handlePointerDown(e.touches[0].clientX);
      }}
      className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden cursor-col-resize select-none border border-border focus:outline-none focus:ring-2 focus:ring-primary"
      style={{ touchAction: "pan-y" }}
    >
      {/* الصورة الخلفية الكاملة (الجانب الأيمن - After) */}
      <img
        src={resolvedAfterImage}
        alt={resolvedAfterLabel}
        className="w-full h-auto block pointer-events-none"
        draggable={false}
      />

      {/* الصورة الأمامية المقصوصة (الجانب الأيسر - Before) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={resolvedBeforeImage}
          alt={resolvedBeforeLabel}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* شارة الجانب الأيسر (Before Label) */}
      {resolvedBeforeLabel && (
        <div
          className="absolute top-4 left-4 z-10 pointer-events-none transition-opacity duration-200"
          style={{ opacity: sliderPosition > 15 ? 1 : 0 }}
        >
          <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium border border-white/10">
            {resolvedBeforeLabel}
          </span>
        </div>
      )}

      {/* شارة الجانب الأيمن (After Label) */}
      {resolvedAfterLabel && (
        <div
          className="absolute top-4 right-4 z-10 pointer-events-none transition-opacity duration-200"
          style={{ opacity: sliderPosition < 85 ? 1 : 0 }}
        >
          <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium border border-white/10">
            {resolvedAfterLabel}
          </span>
        </div>
      )}

      {/* شريط الفصل المتحرك في المنتصف */}
      <div
        className="absolute top-0 bottom-0 z-20 pointer-events-none"
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
      >
        {/* الخط العمودي */}
        <div className="absolute inset-y-0 w-[2px] bg-white/80 left-1/2 -translate-x-1/2 shadow-[0_0_10px_rgba(0,0,0,0.5)]" />

        {/* توهج خفيف حول الخط */}
        <div
          className="absolute inset-y-0 w-10 -translate-x-1/2"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
          }}
        />

        {/* المقبض الدائري في المنتصف */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-2xl flex items-center justify-center border border-black/10 transition-transform duration-100">
          <MoveHorizontal size={18} className="text-gray-800" />
        </div>
      </div>

      {/* تلميح السحب يختفي بعد أول تفاعل */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-opacity duration-500"
        style={{ opacity: hasInteracted ? 0 : 0.85 }}
      >
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium tracking-wide border border-white/10 shadow-lg">
          <span>← اسحب الشريط للمقارنة →</span>
        </div>
      </div>
    </div>
  );
};

export default ImageComparisonSlider;
