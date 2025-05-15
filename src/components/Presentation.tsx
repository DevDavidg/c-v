import { useState, useEffect, useRef } from "preact/hooks";
import { h } from "preact";
import AnimatedSVG from "./SVGCanvas";

// Define a simple MediaQuery hook
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
};

// Define slide content structure
interface SlideContent {
  pageNumber: number;
  title: string;
  content: string;
  svgPath?: string;
  imagePath?: string;
  backgroundColor?: string;
  textColor?: string;
  customStyles?: Record<string, string>;
}

// Define presentation props interface
interface PresentationProps {
  baseUrl: string;
}

// Define slide transition variants
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.8,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.5 },
      scale: { duration: 0.5 },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.8,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.5 },
      scale: { duration: 0.5 },
    },
  }),
};

// Content reveal animations
const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.5,
    },
  }),
};

interface SwipeHandlers {
  onTouchStart: (e: TouchEvent) => void;
  onTouchMove: (e: TouchEvent) => void;
  onTouchEnd: (e: TouchEvent) => void;
  onMouseDown: (e: MouseEvent) => void;
  onMouseMove: (e: MouseEvent) => void;
  onMouseUp: (e: MouseEvent) => void;
}

const Presentation = ({ baseUrl }: PresentationProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const presentationRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Define the slides content with proper baseUrl handling
  const slides: SlideContent[] = [
    {
      pageNumber: 1,
      title: "Metropol Parasol",
      content: "",
      imagePath: `${baseUrl}assets/metorpol.webp`,
      backgroundColor: "#ffffff",
      textColor: "#000000",
    },
    {
      pageNumber: 2,
      title: "Metropol Parasol de lado",
      content: "",
      imagePath: `${baseUrl}assets/metropoldelado.jpg`,
      backgroundColor: "#ffffff",
      textColor: "#000000",
    },
    {
      pageNumber: 3,
      title: "Metropol Parasol - Realismo",
      content: "",
      imagePath: `${baseUrl}assets/realista.png`,
      backgroundColor: "#ffffff",
      textColor: "#000000",
    },
    {
      pageNumber: 4,
      title: "Metropol Parasol - Realismo de lado",
      content: "",
      imagePath: `${baseUrl}assets/realistadelado.png`,
      backgroundColor: "#ffffff",
      textColor: "#000000",
    },
    {
      pageNumber: 5,
      title: "Metropol Parasol - Línea Modular",
      content: "",
      svgPath: `${baseUrl}assets/lineamodular.svg`,
      backgroundColor: "#ffffff",
      textColor: "#000000",
    },
    {
      pageNumber: 6,
      title: "Metropol Parasol - Línea continua",
      content: "",
      svgPath: `${baseUrl}assets/lineacontinua.svg`,
      backgroundColor: "#ffffff",
      textColor: "#000000",
    },
    {
      pageNumber: 7,
      title: "Metropol Parasol - Líneas y planos",
      content: "",
      svgPath: `${baseUrl}assets/lineasyplanos.svg`,
      backgroundColor: "#ffffff",
      textColor: "#000000",
    },
    {
      pageNumber: 8,
      title: "Metropol Parasol - Líneas curvas y rectas de diferentes grosores",
      content: "",
      svgPath: `${baseUrl}assets/lineascurvasyrectasdediferentesgrosores.svg`,
      backgroundColor: "#ffffff",
      textColor: "#000000",
    },
    {
      pageNumber: 9,
      title: "Metropol Parasol - Negativo",
      content: "",
      svgPath: `${baseUrl}assets/negativo.svg`,
      backgroundColor: "#000000",
      textColor: "#ffffff",
      customStyles: {
        background: "#000000",
        color: "#ffffff",
      },
    },
    {
      pageNumber: 10,
      title: "Metropol Parasol - Positivo",
      content: "",
      svgPath: `${baseUrl}assets/positivo.svg`,
      backgroundColor: "#ffffff",
      textColor: "#000000",
    },
    {
      pageNumber: 11,
      title: "Metropol Parasol - Planos en blanco y negro",
      content: "",
      svgPath: `${baseUrl}assets/planosblancoynegro.svg`,
      backgroundColor: "#ffffff",
      textColor: "#000000",
    },
    {
      pageNumber: 12,
      title: "Metropol Parasol - Trama",
      content: "",
      svgPath: `${baseUrl}assets/trama.svg`,
      backgroundColor: "#ffffff",
      textColor: "#000000",
    },
  ];

  const slide = slides[currentSlide];

  // Handle slide navigation
  const navigateToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const handlePrevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      handlePrevSlide();
    } else if (e.key === "ArrowRight") {
      handleNextSlide();
    } else if (e.key === "f" || e.key === "F") {
      toggleFullscreen();
    } else if (e.key === " " || e.key === "Spacebar") {
      setIsAutoPlay(!isAutoPlay);
      e.preventDefault();
    }
  };

  // Custom swipe handlers
  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      // swiped left
      handleNextSlide();
    }
    if (touchStart - touchEnd < -100) {
      // swiped right
      handlePrevSlide();
    }
  };

  const swipeHandlers: SwipeHandlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onMouseDown: () => {},
    onMouseMove: () => {},
    onMouseUp: () => {},
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (presentationRef.current?.requestFullscreen) {
        presentationRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  // Auto-play functionality
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (isAutoPlay) {
      autoPlayTimerRef.current = window.setTimeout(() => {
        handleNextSlide();
      }, 5000);
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
    };
  }, [isAutoPlay, currentSlide]);

  // Update progress indicator
  useEffect(() => {
    if (progressRef.current) {
      const progress = ((currentSlide + 1) / slides.length) * 100;
      progressRef.current.style.width = `${progress}%`;
    }
  }, [currentSlide, slides.length]);

  // Generate particles for background effect
  const generateParticles = (count: number) => {
    return Array.from({ length: count }).map((_, index) => (
      <div
        key={`particle-${index}`}
        className="particle"
        style={{
          position: "absolute",
          width: `${Math.random() * 6 + 2}px`,
          height: `${Math.random() * 6 + 2}px`,
          borderRadius: "50%",
          backgroundColor:
            slide.textColor === "#ffffff"
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.05)",
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          opacity: Math.random() * 0.3 + 0.1,
          animation: `float ${Math.random() * 20 + 20}s linear infinite alternate`,
          pointerEvents: "none",
        }}
      />
    ));
  };

  // Apply animations with CSS classes
  const getAnimationClass = (type: string, index: number = 0) => {
    switch (type) {
      case "fadeIn":
        return "animate-fadeIn";
      case "fadeUp":
        return `animate-fadeUp animation-delay-${index * 100}`;
      case "slideInLeft":
        return "animate-slideInLeft";
      case "slideInRight":
        return "animate-slideInRight";
      default:
        return "";
    }
  };

  // Helper function to get style object
  const getSlideStyles = (slide: SlideContent) => {
    const baseStyles: Record<string, string> = {
      backgroundColor: slide.backgroundColor || "#ffffff",
      color: slide.textColor || "#000000",
      transition: "background-color 0.5s ease, color 0.5s ease",
    };

    // Merge with custom styles if provided
    if (slide.customStyles) {
      return { ...baseStyles, ...slide.customStyles };
    }

    return baseStyles;
  };

  return (
    <div
      ref={presentationRef}
      className="presentation-container"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={getSlideStyles(slide)}
      {...swipeHandlers}
    >
      {/* Background particles effect */}
      <div className="particles-container">
        {generateParticles(!slide.content ? 10 : 20)}
      </div>

      {/* Progress bar */}
      <div
        className="progress-container"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "4px",
          backgroundColor:
            slide.textColor === "#ffffff"
              ? "rgba(255, 255, 255, 0.2)"
              : "rgba(0, 0, 0, 0.1)",
          zIndex: 10,
        }}
      >
        <div
          ref={progressRef}
          className="progress-bar"
          style={{
            height: "100%",
            backgroundColor:
              slide.textColor === "#ffffff" ? "#ffffff" : "#000000",
            transition: "width 0.3s ease-out",
          }}
        />
      </div>

      {/* Main content with slide transition */}
      <div
        key={currentSlide}
        className={`slide-content slide-transition-${direction > 0 ? "next" : "prev"}`}
        style={{
          padding: slide.content ? "40px" : "10px",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          boxSizing: "border-box",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className={`slide-header ${getAnimationClass("fadeIn")}`}
          style={{
            marginBottom: slide.content ? "30px" : "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            position: "relative",
            zIndex: 5,
            backdropFilter: !slide.content ? "blur(5px)" : "none",
            backgroundColor: !slide.content
              ? slide.backgroundColor === "#000000"
                ? "rgba(0,0,0,0.6)"
                : "rgba(255,255,255,0.6)"
              : "transparent",
            padding: !slide.content ? "10px 15px" : "0",
            borderRadius: !slide.content ? "4px" : "0",
            width: !slide.content ? "auto" : "100%",
            boxShadow: !slide.content ? "0 2px 10px rgba(0,0,0,0.1)" : "none",
          }}
        >
          <h2
            className={`slide-title ${getAnimationClass("slideInLeft")}`}
            style={{
              fontSize: !slide.content ? "1.8rem" : "2.2rem",
              marginBottom: "10px",
              fontWeight: "600",
              maxWidth: "80%",
            }}
          >
            {slide.title}
          </h2>
          <div
            className={`slide-number ${getAnimationClass("fadeIn")}`}
            style={{
              fontSize: "1rem",
              opacity: 0.7,
              fontWeight: "500",
            }}
          >
            Página {slide.pageNumber} / {slides.length}
          </div>
        </div>

        <div
          className="slide-body"
          style={{
            display: "flex",
            flex: 1,
            gap: "30px",
            height: !slide.content ? "calc(100vh - 80px)" : "auto",
            position: "relative",
          }}
        >
          {slide.content && (
            <div
              className="slide-text-content"
              style={{
                flex: slide.svgPath || slide.imagePath ? "1" : "1",
                maxWidth: slide.svgPath || slide.imagePath ? "55%" : "100%",
              }}
            >
              {slide.content.split("\n").map((paragraph, idx) => (
                <p
                  key={idx}
                  className={`slide-paragraph ${getAnimationClass("fadeUp", idx)}`}
                  style={{
                    marginBottom: "16px",
                    lineHeight: 1.6,
                    fontSize: "1.1rem",
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {(slide.svgPath || slide.imagePath) && (
            <div
              className={`slide-media ${getAnimationClass("fadeIn")}`}
              style={{
                flex: slide.content ? 1 : "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: slide.content ? "auto" : "100%",
                height: "100%",
                maxHeight: "100%",
                overflow: "hidden",
                position: !slide.content ? "absolute" : "relative",
                top: !slide.content ? "0" : "auto",
                left: !slide.content ? "0" : "auto",
                right: !slide.content ? "0" : "auto",
                bottom: !slide.content ? "0" : "auto",
                zIndex: !slide.content ? "1" : "auto",
              }}
            >
              {slide.svgPath && (
                <AnimatedSVG
                  svgPath={slide.svgPath}
                  animationDuration={2.5}
                  staggerDelay={10}
                  height="100%"
                  width="100%"
                  backgroundColor="transparent"
                  animateFill={true}
                  fillDelay={500}
                />
              )}

              {slide.imagePath && !slide.svgPath && (
                <img
                  src={slide.imagePath}
                  alt={slide.title}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    borderRadius: "8px",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced navigation controls */}
      <div
        className="presentation-controls"
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          display: "flex",
          gap: "12px",
          zIndex: 20,
        }}
      >
        <button
          className={`control-button autoplay-button ${getAnimationClass("fadeIn")}`}
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          aria-label={isAutoPlay ? "Pause autoplay" : "Start autoplay"}
          style={{
            backgroundColor:
              slide.textColor === "#ffffff"
                ? "rgba(255, 255, 255, 0.2)"
                : "rgba(0, 0, 0, 0.1)",
            border: "none",
            borderRadius: "50%",
            width: "42px",
            height: "42px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            color: slide.textColor || "#000000",
          }}
        >
          {isAutoPlay ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          )}
        </button>

        <button
          className={`control-button fullscreen-button ${getAnimationClass("fadeIn")}`}
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          style={{
            backgroundColor:
              slide.textColor === "#ffffff"
                ? "rgba(255, 255, 255, 0.2)"
                : "rgba(0, 0, 0, 0.1)",
            border: "none",
            borderRadius: "50%",
            width: "42px",
            height: "42px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            color: slide.textColor || "#000000",
          }}
        >
          {isFullscreen ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
            </svg>
          )}
        </button>
      </div>

      <div
        className={`slide-navigation ${getAnimationClass("fadeUp")}`}
        style={{
          position: "absolute",
          bottom: isMobile ? "10px" : "20px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: isMobile ? "5px" : "10px",
          zIndex: 20,
          width: "calc(100% - 40px)",
          maxWidth: "500px",
          justifyContent: "center",
          flexWrap: "wrap",
          padding: "0 10px",
        }}
      >
        <button
          className={`nav-button prev ${getAnimationClass("slideInLeft")}`}
          onClick={handlePrevSlide}
          aria-label="Previous slide"
          style={{
            backgroundColor:
              slide.textColor === "#ffffff"
                ? "rgba(255, 255, 255, 0.2)"
                : "rgba(0, 0, 0, 0.1)",
            border: "none",
            borderRadius: "50%",
            width: isMobile ? "40px" : "48px",
            height: isMobile ? "40px" : "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background-color 0.3s ease, transform 0.2s ease",
            color: slide.textColor || "#000000",
          }}
        >
          <svg
            width={isMobile ? "20" : "24"}
            height={isMobile ? "20" : "24"}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div
          className="slide-indicator"
          style={{
            display: "flex",
            gap: isMobile ? "4px" : "6px",
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: "60%",
          }}
        >
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`indicator-dot ${idx === currentSlide ? "active" : ""} ${getAnimationClass("fadeIn")}`}
              onClick={() => navigateToSlide(idx)}
              style={{
                width:
                  idx === currentSlide
                    ? isMobile
                      ? "10px"
                      : "12px"
                    : isMobile
                      ? "8px"
                      : "10px",
                height:
                  idx === currentSlide
                    ? isMobile
                      ? "10px"
                      : "12px"
                    : isMobile
                      ? "8px"
                      : "10px",
                borderRadius: "50%",
                backgroundColor:
                  slide.textColor === "#ffffff"
                    ? idx === currentSlide
                      ? "#ffffff"
                      : "rgba(255, 255, 255, 0.4)"
                    : idx === currentSlide
                      ? "#000000"
                      : "rgba(0, 0, 0, 0.2)",
                transition: "all 0.3s ease",
                cursor: "pointer",
                animationDelay: `${idx * 0.1}s`,
                transform: idx === currentSlide ? "scale(1.2)" : "scale(1)",
                margin: "0 2px",
              }}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  navigateToSlide(idx);
                }
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          className={`nav-button next ${getAnimationClass("slideInRight")}`}
          onClick={handleNextSlide}
          aria-label="Next slide"
          style={{
            backgroundColor:
              slide.textColor === "#ffffff"
                ? "rgba(255, 255, 255, 0.2)"
                : "rgba(0, 0, 0, 0.1)",
            border: "none",
            borderRadius: "50%",
            width: isMobile ? "40px" : "48px",
            height: isMobile ? "40px" : "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background-color 0.3s ease, transform 0.2s ease",
            color: slide.textColor || "#000000",
          }}
        >
          <svg
            width={isMobile ? "20" : "24"}
            height={isMobile ? "20" : "24"}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      {/* Touch gesture hint */}
      <div
        className="gesture-hint"
        style={{
          position: "absolute",
          bottom: "120px",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: 0.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.9rem",
          color: slide.textColor || "#000000",
          transition: "opacity 0.3s ease",
          zIndex: 10,
        }}
      >
        <div
          className="swipe-icon"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 8l-4 4 4 4"></path>
          </svg>
          <span>Desliza para navegar</span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M10 8l4 4-4 4"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Presentation;
