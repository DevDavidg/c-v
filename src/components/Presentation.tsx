import { useState, useEffect, useRef } from "preact/hooks";
import AnimatedSVG from "./SVGCanvas";

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

interface PresentationProps {
  baseUrl: string;
}

interface SwipeHandlers {
  onTouchStart: (e: TouchEvent) => void;
  onTouchMove: (e: TouchEvent) => void;
  onTouchEnd: (e: TouchEvent) => void;
  onMouseDown: (e: MouseEvent) => void;
  onMouseMove: (e: MouseEvent) => void;
  onMouseUp: (e: MouseEvent) => void;
}

// Extract unified loader component at the top of the file after imports
const EnhancedLoader = ({
  backgroundColor = "#ffffff",
  textColor = "#000000",
  text = "Cargando",
  size = "medium",
  isFullScreen = false,
  loaderId = "default-loader",
}) => {
  const getSize = () => {
    switch (size) {
      case "small":
        return { spinner: 30, text: 12 };
      case "large":
        return { spinner: 50, text: 16 };
      default:
        return { spinner: 40, text: 14 };
    }
  };

  const sizeConfig = getSize();

  return (
    <div
      className="enhanced-loader-container"
      key={loaderId}
      style={{
        position: isFullScreen ? "absolute" : "relative",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:
          backgroundColor === "transparent"
            ? "rgba(255, 255, 255, 0.7)"
            : `${backgroundColor}`,
        zIndex: 10,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div
        className="loader-content"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <div className="spinner-rings">
          <div
            style={{
              width: `${sizeConfig.spinner}px`,
              height: `${sizeConfig.spinner}px`,
              borderRadius: "50%",
              border: `3px solid ${backgroundColor === "#000000" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
              borderTopColor:
                backgroundColor === "#000000" ? "#ffffff" : textColor,
              animation: "spin 1s linear infinite",
              position: "relative",
            }}
          ></div>
        </div>
        {text && (
          <div
            className="loading-text"
            style={{
              fontSize: `${sizeConfig.text}px`,
              fontWeight: "500",
              color: backgroundColor === "#000000" ? "#ffffff" : textColor,
              opacity: 0.8,
              animation: "pulse 1.5s ease-in-out infinite",
              textAlign: "center",
            }}
          >
            {text}
            <span
              className="loading-dots"
              style={{
                display: "inline-block",
                width: "24px",
                textAlign: "left",
              }}
            >
              <span
                style={{
                  animation: "loadingDots 1.5s infinite",
                  animationDelay: "0s",
                  marginLeft: "3px",
                }}
              >
                .
              </span>
              <span
                style={{
                  animation: "loadingDots 1.5s infinite",
                  animationDelay: "0.3s",
                }}
              >
                .
              </span>
              <span
                style={{
                  animation: "loadingDots 1.5s infinite",
                  animationDelay: "0.6s",
                }}
              >
                .
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const Presentation = ({ baseUrl }: PresentationProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const presentationRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<number | null>(null);
  const isSmallMobile = useMediaQuery("(max-width: 600px)");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const loadStartTimeRef = useRef<number>(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isChangingSlide, setIsChangingSlide] = useState(false);

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

  const navigateToSlide = (index: number) => {
    if (index === currentSlide) return;

    // Prevent duplicate loader by setting changing state
    setIsChangingSlide(true);
    loadStartTimeRef.current = Date.now();
    setImageLoading(true);
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const handlePrevSlide = () => {
    // Prevent duplicate loader by setting changing state
    setIsChangingSlide(true);
    loadStartTimeRef.current = Date.now();
    setImageLoading(true);
    setDirection(-1);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    // Prevent duplicate loader by setting changing state
    setIsChangingSlide(true);
    loadStartTimeRef.current = Date.now();
    setImageLoading(true);
    setDirection(1);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

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

  const handleImageLoad = () => {
    const loadingTime = Date.now() - loadStartTimeRef.current;
    const minLoadingTime = 500;

    setIsChangingSlide(false);

    if (loadingTime < minLoadingTime) {
      setTimeout(() => {
        setImageLoading(false);
      }, minLoadingTime - loadingTime);
    } else {
      setImageLoading(false);
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 70) {
      handleNextSlide();
    }
    if (touchStart - touchEnd < -70) {
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

  useEffect(() => {
    if (progressRef.current) {
      const progress = ((currentSlide + 1) / slides.length) * 100;
      progressRef.current.style.width = `${progress}%`;
    }
  }, [currentSlide, slides.length]);

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

  const getSlideStyles = (slide: SlideContent) => {
    const baseStyles: Record<string, string> = {
      backgroundColor: isMobile
        ? "#ffffff"
        : slide.backgroundColor || "#ffffff",
      color: isMobile ? "#000000" : slide.textColor || "#000000",
      transition: "background-color 0.5s ease, color 0.5s ease",
    };

    if (slide.customStyles && !isMobile) {
      return { ...baseStyles, ...slide.customStyles };
    }

    return baseStyles;
  };

  const toggleMobileNav = () => {
    setShowMobileNav(!showMobileNav);
  };

  // Add an effect to preload images when a slide changes
  useEffect(() => {
    // Preload the image for current slide
    if (slide.imagePath && !slide.svgPath) {
      const img = new Image();
      img.src = slide.imagePath;
    }

    // After slide change, make sure we reset the changing state after a safety timeout
    const safetyTimer = setTimeout(() => {
      setIsChangingSlide(false);
    }, 800);

    return () => clearTimeout(safetyTimer);
  }, [currentSlide]);

  return (
    <div
      ref={presentationRef}
      className="presentation-container"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={getSlideStyles(slide)}
      {...swipeHandlers}
    >
      <div className="particles-container">
        {generateParticles(!slide.content ? 10 : 20)}
      </div>

      <div
        className="progress-container"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: isSmallMobile ? "3px" : "4px",
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

      <div
        key={currentSlide}
        className={`slide-content slide-transition-${direction > 0 ? "next" : "prev"}`}
        style={{
          padding: isSmallMobile
            ? slide.content
              ? "20px 15px"
              : "5px"
            : slide.content
              ? "40px"
              : "10px",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          boxSizing: "border-box",
          position: "relative",
          overflow: "hidden",
          maxWidth: "100vw",
        }}
      >
        <div
          className={`slide-header ${getAnimationClass("fadeIn")}`}
          style={{
            marginBottom: isSmallMobile
              ? "10px"
              : slide.content
                ? "30px"
                : "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: isSmallMobile ? "center" : "flex-start",
            position: "relative",
            zIndex: 5,
            backdropFilter: !slide.content ? "blur(5px)" : "none",
            backgroundColor: !slide.content
              ? slide.backgroundColor === "#000000"
                ? "rgba(0,0,0,0.6)"
                : "rgba(255,255,255,0.6)"
              : "transparent",
            padding: !slide.content
              ? isSmallMobile
                ? "8px 10px"
                : "10px 15px"
              : "0",
            borderRadius: !slide.content ? "4px" : "0",
            width: !slide.content ? "auto" : "100%",
            boxShadow: !slide.content ? "0 2px 10px rgba(0,0,0,0.1)" : "none",
            flexWrap: isSmallMobile ? "wrap" : "nowrap",
          }}
        >
          <h2
            className={`slide-title ${getAnimationClass("slideInLeft")}`}
            style={{
              fontSize: isSmallMobile
                ? "1.4rem"
                : !slide.content
                  ? "1.8rem"
                  : "2.2rem",
              marginBottom: isSmallMobile ? "5px" : "10px",
              fontWeight: "600",
              maxWidth: isSmallMobile ? "100%" : "80%",
              lineHeight: isSmallMobile ? "1.2" : "1.3",
              textAlign: isSmallMobile ? "center" : "left",
              width: isSmallMobile ? "100%" : "auto",
              order: isSmallMobile ? 1 : 0,
            }}
          >
            {slide.title}
          </h2>
          <div
            className={`slide-number ${getAnimationClass("fadeIn")}`}
            style={{
              fontSize: isSmallMobile ? "0.8rem" : "1rem",
              opacity: 0.7,
              fontWeight: "500",
              width: isSmallMobile ? "100%" : "auto",
              textAlign: isSmallMobile ? "center" : "right",
              marginTop: isSmallMobile ? "-5px" : "0",
              order: isSmallMobile ? 2 : 0,
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
            gap: isSmallMobile ? "15px" : "30px",
            height: !slide.content ? "calc(100vh - 80px)" : "auto",
            position: "relative",
            flexDirection: isSmallMobile && slide.content ? "column" : "row",
          }}
        >
          {slide.content && (
            <div
              className="slide-text-content"
              style={{
                flex: isSmallMobile
                  ? "1"
                  : slide.svgPath || slide.imagePath
                    ? "1"
                    : "1",
                maxWidth: isSmallMobile
                  ? "100%"
                  : slide.svgPath || slide.imagePath
                    ? "55%"
                    : "100%",
                order: isSmallMobile ? 2 : 0,
              }}
            >
              {slide.content.split("\n").map((paragraph, idx) => (
                <p
                  key={idx}
                  className={`slide-paragraph ${getAnimationClass("fadeUp", idx)}`}
                  style={{
                    marginBottom: isSmallMobile ? "12px" : "16px",
                    lineHeight: 1.6,
                    fontSize: isSmallMobile ? "0.95rem" : "1.1rem",
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
                flex: isSmallMobile ? "none" : slide.content ? 1 : "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: slide.content ? "auto" : "100%",
                height: isSmallMobile && slide.content ? "40vh" : "100%",
                maxHeight: isSmallMobile && slide.content ? "40vh" : "100%",
                overflow: "hidden",
                position: !slide.content ? "absolute" : "relative",
                top: !slide.content ? "0" : "auto",
                left: !slide.content ? "0" : "auto",
                right: !slide.content ? "0" : "auto",
                bottom: !slide.content ? "0" : "auto",
                zIndex: !slide.content ? "1" : "auto",
                order: isSmallMobile ? 1 : 0,
                margin: isSmallMobile ? "0 -15px" : "0",
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
                <div
                  className="image-container"
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {imageLoading && !isChangingSlide && (
                    <EnhancedLoader
                      backgroundColor={
                        isMobile ? "#ffffff" : slide.backgroundColor
                      }
                      textColor={isMobile ? "#000000" : slide.textColor}
                      text="Cargando imagen"
                      size={
                        isSmallMobile ? "small" : isMobile ? "medium" : "large"
                      }
                      isFullScreen={true}
                      loaderId={`image-loader-${currentSlide}`}
                    />
                  )}
                  <img
                    ref={imageRef}
                    src={slide.imagePath}
                    alt={slide.title}
                    onLoad={handleImageLoad}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      borderRadius: isSmallMobile ? "6px" : "8px",
                      boxShadow: isSmallMobile
                        ? "0 4px 15px rgba(0,0,0,0.12)"
                        : "0 8px 20px rgba(0,0,0,0.15)",
                      opacity: imageLoading ? 0 : 1,
                      transition: "opacity 0.5s ease",
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div
        className="presentation-controls"
        style={{
          position: "absolute",
          bottom: isSmallMobile ? "12px" : isMobile ? "16px" : "20px",
          right: isSmallMobile ? "12px" : isMobile ? "16px" : "20px",
          display: "flex",
          alignItems: "center",
          height: isSmallMobile ? "38px" : isMobile ? "44px" : "56px",
          maxHeight: isSmallMobile ? "38px" : isMobile ? "44px" : "56px",
          gap: isSmallMobile ? "4px" : isMobile ? "6px" : "10px",
          zIndex: 20,
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          borderRadius: "28px",
          padding: isSmallMobile ? "3px 4px" : isMobile ? "4px 6px" : "6px 8px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          transition:
            "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease, height 0.3s ease",
          opacity: showMobileNav ? 0.3 : 1,
          transform: showMobileNav
            ? `translateY(10px) scale(0.96)`
            : `translateY(0) scale(1)`,
          pointerEvents: showMobileNav ? "none" : "auto",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.5)",
        }}
      >
        <button
          className={`control-button jump-to-start-button ${getAnimationClass("fadeIn")}`}
          onClick={() => navigateToSlide(0)}
          aria-label="Go to first slide"
          style={{
            backgroundColor: isMobile
              ? "rgba(0, 0, 0, 0.05)"
              : slide.textColor === "#ffffff"
                ? "rgba(255, 255, 255, 0.2)"
                : "rgba(0, 0, 0, 0.05)",
            border: "none",
            borderRadius: "50%",
            width: isSmallMobile ? "28px" : isMobile ? "32px" : "38px",
            height: isSmallMobile ? "28px" : isMobile ? "32px" : "38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            color: "#000000",
            transform: "scale(1)",
            position: "relative",
            outline: "none",
            touchAction: "manipulation",
          }}
          onMouseDown={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(0.92)";
          }}
          onMouseUp={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(1)";
          }}
          onTouchStart={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(0.92)";
          }}
          onTouchEnd={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <svg
            width={isSmallMobile ? "14" : isMobile ? "16" : "18"}
            height={isSmallMobile ? "14" : isMobile ? "16" : "18"}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="11 17 6 12 11 7"></polyline>
            <polyline points="18 17 13 12 18 7"></polyline>
          </svg>
          <span
            className="control-tooltip"
            style={{
              position: "absolute",
              bottom: "100%",
              left: "50%",
              transform: "translateX(-50%) translateY(-5px)",
              backgroundColor: "rgba(0,0,0,0.8)",
              color: "#fff",
              padding: "5px 8px",
              borderRadius: "6px",
              fontSize: "12px",
              whiteSpace: "nowrap",
              opacity: 0,
              transition: "opacity 0.2s ease, transform 0.2s ease",
              pointerEvents: "none",
              fontWeight: 500,
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            Primera
          </span>
        </button>

        <button
          className={`control-button prev-slide-button ${getAnimationClass("fadeIn")}`}
          onClick={handlePrevSlide}
          aria-label="Previous slide"
          style={{
            backgroundColor: isMobile
              ? "rgba(0, 0, 0, 0.05)"
              : slide.textColor === "#ffffff"
                ? "rgba(255, 255, 255, 0.2)"
                : "rgba(0, 0, 0, 0.05)",
            border: "none",
            borderRadius: "50%",
            width: isSmallMobile ? "30px" : isMobile ? "34px" : "42px",
            height: isSmallMobile ? "30px" : isMobile ? "34px" : "42px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            color: "#000000",
            transform: "scale(1)",
            position: "relative",
            outline: "none",
            touchAction: "manipulation",
          }}
          onMouseDown={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(0.92)";
          }}
          onMouseUp={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(1)";
          }}
          onTouchStart={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(0.92)";
          }}
          onTouchEnd={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <svg
            width={isSmallMobile ? "16" : isMobile ? "18" : "22"}
            height={isSmallMobile ? "16" : isMobile ? "18" : "22"}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <span
            className="control-tooltip"
            style={{
              position: "absolute",
              bottom: "100%",
              left: "50%",
              transform: "translateX(-50%) translateY(-5px)",
              backgroundColor: "rgba(0,0,0,0.8)",
              color: "#fff",
              padding: "5px 8px",
              borderRadius: "6px",
              fontSize: "12px",
              whiteSpace: "nowrap",
              opacity: 0,
              transition: "opacity 0.2s ease, transform 0.2s ease",
              pointerEvents: "none",
              fontWeight: 500,
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            Anterior
          </span>
        </button>

        <div
          className="slide-count-indicator"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.75)",
            color: "#fff",
            borderRadius: "16px",
            padding: isSmallMobile ? "2px 6px" : "3px 8px",
            fontSize: isSmallMobile ? "9px" : isMobile ? "10px" : "12px",
            fontWeight: 600,
            minWidth: isSmallMobile ? "24px" : isMobile ? "28px" : "32px",
            height: isSmallMobile ? "18px" : isMobile ? "20px" : "24px",
            position: "relative",
            letterSpacing: "0.5px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <span>{currentSlide + 1}</span>
          <span style={{ opacity: 0.6, margin: "0 2px" }}>/</span>
          <span style={{ opacity: 0.6 }}>{slides.length}</span>
        </div>

        <button
          className={`control-button next-slide-button ${getAnimationClass("fadeIn")}`}
          onClick={handleNextSlide}
          aria-label="Next slide"
          style={{
            backgroundColor: isMobile
              ? "rgba(0, 0, 0, 0.05)"
              : slide.textColor === "#ffffff"
                ? "rgba(255, 255, 255, 0.2)"
                : "rgba(0, 0, 0, 0.05)",
            border: "none",
            borderRadius: "50%",
            width: isSmallMobile ? "30px" : isMobile ? "34px" : "42px",
            height: isSmallMobile ? "30px" : isMobile ? "34px" : "42px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            color: "#000000",
            transform: "scale(1)",
            position: "relative",
            outline: "none",
            touchAction: "manipulation",
          }}
          onMouseDown={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(0.92)";
          }}
          onMouseUp={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(1)";
          }}
          onTouchStart={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(0.92)";
          }}
          onTouchEnd={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <svg
            width={isSmallMobile ? "16" : isMobile ? "18" : "22"}
            height={isSmallMobile ? "16" : isMobile ? "18" : "22"}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
          <span
            className="control-tooltip"
            style={{
              position: "absolute",
              bottom: "100%",
              left: "50%",
              transform: "translateX(-50%) translateY(-5px)",
              backgroundColor: "rgba(0,0,0,0.8)",
              color: "#fff",
              padding: "5px 8px",
              borderRadius: "6px",
              fontSize: "12px",
              whiteSpace: "nowrap",
              opacity: 0,
              transition: "opacity 0.2s ease, transform 0.2s ease",
              pointerEvents: "none",
              fontWeight: 500,
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            Siguiente
          </span>
        </button>

        <button
          className={`control-button jump-to-end-button ${getAnimationClass("fadeIn")}`}
          onClick={() => navigateToSlide(slides.length - 1)}
          aria-label="Go to last slide"
          style={{
            backgroundColor: isMobile
              ? "rgba(0, 0, 0, 0.05)"
              : slide.textColor === "#ffffff"
                ? "rgba(255, 255, 255, 0.2)"
                : "rgba(0, 0, 0, 0.05)",
            border: "none",
            borderRadius: "50%",
            width: isSmallMobile ? "28px" : isMobile ? "32px" : "38px",
            height: isSmallMobile ? "28px" : isMobile ? "32px" : "38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            color: "#000000",
            transform: "scale(1)",
            position: "relative",
            outline: "none",
            touchAction: "manipulation",
          }}
          onMouseDown={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(0.92)";
          }}
          onMouseUp={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(1)";
          }}
          onTouchStart={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(0.92)";
          }}
          onTouchEnd={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <svg
            width={isSmallMobile ? "14" : isMobile ? "16" : "18"}
            height={isSmallMobile ? "14" : isMobile ? "16" : "18"}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="13 17 18 12 13 7"></polyline>
            <polyline points="6 17 11 12 6 7"></polyline>
          </svg>
          <span
            className="control-tooltip"
            style={{
              position: "absolute",
              bottom: "100%",
              left: "50%",
              transform: "translateX(-50%) translateY(-5px)",
              backgroundColor: "rgba(0,0,0,0.8)",
              color: "#fff",
              padding: "5px 8px",
              borderRadius: "6px",
              fontSize: "12px",
              whiteSpace: "nowrap",
              opacity: 0,
              transition: "opacity 0.2s ease, transform 0.2s ease",
              pointerEvents: "none",
              fontWeight: 500,
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            Última
          </span>
        </button>

        <div
          style={{
            width: "1px",
            height: isSmallMobile ? "20px" : isMobile ? "22px" : "24px",
            backgroundColor: "rgba(0,0,0,0.15)",
            margin: "0 2px",
          }}
        />

        <button
          className={`control-button autoplay-button ${getAnimationClass("fadeIn")}`}
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          aria-label={isAutoPlay ? "Pause autoplay" : "Start autoplay"}
          style={{
            backgroundColor: isMobile
              ? isAutoPlay
                ? "rgba(76, 175, 80, 0.1)"
                : "rgba(0, 0, 0, 0.05)"
              : isAutoPlay
                ? "rgba(76, 175, 80, 0.15)"
                : slide.textColor === "#ffffff"
                  ? "rgba(255, 255, 255, 0.2)"
                  : "rgba(0, 0, 0, 0.05)",
            border: isAutoPlay ? "1px solid rgba(76, 175, 80, 0.3)" : "none",
            borderRadius: "50%",
            width: isSmallMobile ? "30px" : isMobile ? "34px" : "42px",
            height: isSmallMobile ? "30px" : isMobile ? "34px" : "42px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            color: isAutoPlay ? "#4CAF50" : "#000000",
            transform: "scale(1)",
            boxShadow: isAutoPlay ? "0 2px 8px rgba(76, 175, 80, 0.2)" : "none",
            position: "relative",
            outline: "none",
            touchAction: "manipulation",
          }}
          onMouseDown={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(0.92)";
          }}
          onMouseUp={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(1)";
          }}
          onTouchStart={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(0.92)";
          }}
          onTouchEnd={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {isAutoPlay ? (
            <svg
              width={isSmallMobile ? "14" : isMobile ? "16" : "20"}
              height={isSmallMobile ? "14" : isMobile ? "16" : "20"}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          ) : (
            <svg
              width={isSmallMobile ? "14" : isMobile ? "16" : "20"}
              height={isSmallMobile ? "14" : isMobile ? "16" : "20"}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          )}
          <span
            className="control-tooltip"
            style={{
              position: "absolute",
              bottom: "100%",
              left: "50%",
              transform: "translateX(-50%) translateY(-5px)",
              backgroundColor: "rgba(0,0,0,0.8)",
              color: "#fff",
              padding: "5px 8px",
              borderRadius: "6px",
              fontSize: "12px",
              whiteSpace: "nowrap",
              opacity: 0,
              transition: "opacity 0.2s ease, transform 0.2s ease",
              pointerEvents: "none",
              fontWeight: 500,
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            {isAutoPlay ? "Pausar" : "Auto"}
          </span>
        </button>

        <button
          className={`control-button fullscreen-button ${getAnimationClass("fadeIn")}`}
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          style={{
            backgroundColor: isMobile
              ? isFullscreen
                ? "rgba(33, 150, 243, 0.1)"
                : "rgba(0, 0, 0, 0.05)"
              : isFullscreen
                ? "rgba(33, 150, 243, 0.15)"
                : slide.textColor === "#ffffff"
                  ? "rgba(255, 255, 255, 0.2)"
                  : "rgba(0, 0, 0, 0.05)",
            border: isFullscreen ? "1px solid rgba(33, 150, 243, 0.3)" : "none",
            borderRadius: "50%",
            width: isSmallMobile ? "30px" : isMobile ? "34px" : "42px",
            height: isSmallMobile ? "30px" : isMobile ? "34px" : "42px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            color: isFullscreen ? "#2196F3" : "#000000",
            transform: "scale(1)",
            boxShadow: isFullscreen
              ? "0 2px 8px rgba(33, 150, 243, 0.2)"
              : "none",
            position: "relative",
            outline: "none",
            touchAction: "manipulation",
          }}
          onMouseDown={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(0.92)";
          }}
          onMouseUp={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(1)";
          }}
          onTouchStart={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(0.92)";
          }}
          onTouchEnd={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {isFullscreen ? (
            <svg
              width={isSmallMobile ? "14" : isMobile ? "16" : "20"}
              height={isSmallMobile ? "14" : isMobile ? "16" : "20"}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
            </svg>
          ) : (
            <svg
              width={isSmallMobile ? "14" : isMobile ? "16" : "20"}
              height={isSmallMobile ? "14" : isMobile ? "16" : "20"}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
            </svg>
          )}
          <span
            className="control-tooltip"
            style={{
              position: "absolute",
              bottom: "100%",
              left: "50%",
              transform: "translateX(-50%) translateY(-5px)",
              backgroundColor: "rgba(0,0,0,0.8)",
              color: "#fff",
              padding: "5px 8px",
              borderRadius: "6px",
              fontSize: "12px",
              whiteSpace: "nowrap",
              opacity: 0,
              transition: "opacity 0.2s ease, transform 0.2s ease",
              pointerEvents: "none",
              fontWeight: 500,
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            {isFullscreen ? "Salir" : "Pantalla completa"}
          </span>
        </button>
      </div>

      {isMobile && (
        <button
          className={`mobile-nav-toggle ${getAnimationClass("fadeIn")}`}
          onClick={toggleMobileNav}
          aria-label="Toggle navigation"
          style={{
            position: "absolute",
            bottom: isSmallMobile ? "10px" : "15px",
            left: isSmallMobile ? "10px" : "15px",
            zIndex: 30,
            width: isSmallMobile ? "32px" : "40px",
            height: isSmallMobile ? "32px" : "40px",
            borderRadius: "50%",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            color: "#000000",
            transition: "transform 0.2s ease",
          }}
          onMouseDown={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(0.95)";
          }}
          onMouseUp={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(1)";
          }}
          onTouchStart={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(0.95)";
          }}
          onTouchEnd={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <svg
            width={isSmallMobile ? "16" : "24"}
            height={isSmallMobile ? "16" : "24"}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {showMobileNav ? (
              <path d="M18 6L6 18M6 6l12 12"></path>
            ) : (
              <path d="M4 8h16M4 16h16"></path>
            )}
          </svg>
        </button>
      )}

      {isMobile && (
        <div
          className={`mobile-navigation-overlay ${showMobileNav ? "active" : ""}`}
          style={{
            position: "fixed",
            bottom: showMobileNav ? "0" : "-100%",
            left: "0",
            width: "100%",
            height: "auto",
            maxHeight: isSmallMobile ? "70vh" : "60vh",
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            zIndex: 25,
            transition: "bottom 0.3s ease-in-out",
            borderTopLeftRadius: isSmallMobile ? "12px" : "16px",
            borderTopRightRadius: isSmallMobile ? "12px" : "16px",
            boxShadow: "0 -5px 25px rgba(0,0,0,0.15)",
            padding: isSmallMobile ? "15px 10px" : "20px 15px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: isSmallMobile ? "10px" : "15px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="mobile-nav-header"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: isSmallMobile ? "5px" : "10px",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: isSmallMobile ? "14px" : "16px",
                fontWeight: 600,
              }}
            >
              Diapositivas ({currentSlide + 1}/{slides.length})
            </h3>
            <div
              className="mobile-nav-controls"
              style={{ display: "flex", gap: isSmallMobile ? "8px" : "10px" }}
            >
              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                style={{
                  border: "none",
                  background: "rgba(0,0,0,0.05)",
                  borderRadius: isSmallMobile ? "6px" : "8px",
                  padding: isSmallMobile ? "6px 8px" : "8px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: isSmallMobile ? "12px" : "14px",
                  transition: "transform 0.2s ease, background-color 0.2s ease",
                }}
                onMouseDown={(e) => {
                  if (e.currentTarget.style)
                    e.currentTarget.style.transform = "scale(0.97)";
                }}
                onMouseUp={(e) => {
                  if (e.currentTarget.style)
                    e.currentTarget.style.transform = "scale(1)";
                }}
                onTouchStart={(e) => {
                  if (e.currentTarget.style)
                    e.currentTarget.style.transform = "scale(0.97)";
                }}
                onTouchEnd={(e) => {
                  if (e.currentTarget.style)
                    e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <svg
                  width={isSmallMobile ? "12" : "16"}
                  height={isSmallMobile ? "12" : "16"}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  {isAutoPlay ? (
                    <rect x="6" y="4" width="4" height="16"></rect>
                  ) : (
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  )}
                </svg>
                {isAutoPlay ? "Pausar" : "Auto"}
              </button>
            </div>
          </div>

          <div
            className="thumbnail-navigation"
            style={{
              display: "grid",
              gridTemplateColumns: isSmallMobile
                ? "repeat(3, 1fr)"
                : "repeat(3, 1fr)",
              gap: isSmallMobile ? "6px" : "10px",
              marginBottom: isSmallMobile ? "10px" : "15px",
            }}
          >
            {slides.map((slideItem, idx) => (
              <div
                key={idx}
                className={`slide-thumbnail ${idx === currentSlide ? "active-thumbnail" : ""}`}
                onClick={() => {
                  navigateToSlide(idx);
                  setShowMobileNav(false);
                }}
                style={{
                  position: "relative",
                  aspectRatio: "16/9",
                  borderRadius: isSmallMobile ? "6px" : "8px",
                  overflow: "hidden",
                  border:
                    idx === currentSlide
                      ? "2px solid #000"
                      : "1px solid rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  backgroundColor: slideItem.backgroundColor || "#ffffff",
                  boxShadow:
                    idx === currentSlide
                      ? "0 2px 10px rgba(0,0,0,0.15)"
                      : "none",
                  transform: idx === currentSlide ? "scale(1.05)" : "scale(1)",
                  transition: "all 0.2s ease",
                }}
              >
                {slideItem.imagePath && (
                  <div
                    style={{
                      backgroundImage: `url(${slideItem.imagePath})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                    }}
                  />
                )}
                {slideItem.svgPath && (
                  <div
                    style={{
                      backgroundColor: slideItem.backgroundColor || "#ffffff",
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width={isSmallMobile ? "16" : "24"}
                      height={isSmallMobile ? "16" : "24"}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#000000"
                      strokeWidth="2"
                    >
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </div>
                )}
                <div
                  style={{
                    position: "absolute",
                    bottom: "0",
                    left: "0",
                    width: "100%",
                    padding: isSmallMobile ? "3px" : "4px",
                    backgroundColor: "rgba(255,255,255,0.85)",
                    fontSize: isSmallMobile ? "8px" : "10px",
                    textAlign: "center",
                    fontWeight: idx === currentSlide ? "600" : "400",
                  }}
                >
                  {idx + 1}
                </div>
              </div>
            ))}
          </div>

          <div
            className="quick-nav-buttons"
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: isSmallMobile ? "8px" : "10px",
              marginTop: "auto",
            }}
          >
            <button
              onClick={() => {
                handlePrevSlide();
                setShowMobileNav(false);
              }}
              style={{
                flex: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: isSmallMobile ? "10px" : "12px",
                borderRadius: isSmallMobile ? "10px" : "12px",
                backgroundColor: "rgba(0,0,0,0.05)",
                border: "none",
                gap: isSmallMobile ? "5px" : "8px",
                fontWeight: "500",
                fontSize: isSmallMobile ? "14px" : "16px",
                transition: "transform 0.2s ease, background-color 0.2s ease",
              }}
              onMouseDown={(e) => {
                if (e.currentTarget.style) {
                  e.currentTarget.style.transform = "scale(0.98)";
                  e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.07)";
                }
              }}
              onMouseUp={(e) => {
                if (e.currentTarget.style) {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)";
                }
              }}
              onTouchStart={(e) => {
                if (e.currentTarget.style) {
                  e.currentTarget.style.transform = "scale(0.98)";
                  e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.07)";
                }
              }}
              onTouchEnd={(e) => {
                if (e.currentTarget.style) {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)";
                }
              }}
            >
              <svg
                width={isSmallMobile ? "16" : "18"}
                height={isSmallMobile ? "16" : "18"}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              <span>Anterior</span>
            </button>
            <button
              onClick={() => {
                handleNextSlide();
                setShowMobileNav(false);
              }}
              style={{
                flex: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: isSmallMobile ? "10px" : "12px",
                borderRadius: isSmallMobile ? "10px" : "12px",
                backgroundColor: "rgba(0,0,0,0.05)",
                border: "none",
                gap: isSmallMobile ? "5px" : "8px",
                fontWeight: "500",
                fontSize: isSmallMobile ? "14px" : "16px",
                transition: "transform 0.2s ease, background-color 0.2s ease",
              }}
              onMouseDown={(e) => {
                if (e.currentTarget.style) {
                  e.currentTarget.style.transform = "scale(0.98)";
                  e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.07)";
                }
              }}
              onMouseUp={(e) => {
                if (e.currentTarget.style) {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)";
                }
              }}
              onTouchStart={(e) => {
                if (e.currentTarget.style) {
                  e.currentTarget.style.transform = "scale(0.98)";
                  e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.07)";
                }
              }}
              onTouchEnd={(e) => {
                if (e.currentTarget.style) {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)";
                }
              }}
            >
              <span>Siguiente</span>
              <svg
                width={isSmallMobile ? "16" : "18"}
                height={isSmallMobile ? "16" : "18"}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      )}

      <div
        className={`slide-navigation ${getAnimationClass("fadeUp")}`}
        style={{
          position: "absolute",
          bottom: isSmallMobile
            ? "8px"
            : isMobile
              ? "10px"
              : isTablet
                ? "15px"
                : "20px",
          left: "50%",
          transform: "translateX(-50%)",
          display: isMobile ? "none" : "flex",
          alignItems: "center",
          gap: isSmallMobile
            ? "4px"
            : isMobile
              ? "5px"
              : isTablet
                ? "8px"
                : "10px",
          zIndex: 20,
          width: "calc(100% - 40px)",
          maxWidth: isSmallMobile
            ? "320px"
            : isMobile
              ? "360px"
              : isTablet
                ? "450px"
                : "500px",
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
            backgroundColor: isMobile
              ? "rgba(0, 0, 0, 0.1)"
              : slide.textColor === "#ffffff"
                ? "rgba(255, 255, 255, 0.2)"
                : "rgba(0, 0, 0, 0.1)",
            border: "none",
            borderRadius: "50%",
            width: isSmallMobile ? "36px" : isMobile ? "40px" : "48px",
            height: isSmallMobile ? "36px" : isMobile ? "40px" : "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background-color 0.3s ease, transform 0.2s ease",
            color: isMobile ? "#000000" : slide.textColor || "#000000",
          }}
          onMouseDown={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(0.95)";
          }}
          onMouseUp={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(1)";
          }}
          onTouchStart={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(0.95)";
          }}
          onTouchEnd={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <svg
            width={isSmallMobile ? "18" : isMobile ? "20" : "24"}
            height={isSmallMobile ? "18" : isMobile ? "20" : "24"}
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
            gap: isSmallMobile ? "3px" : isMobile ? "4px" : "6px",
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: isSmallMobile ? "70%" : "60%",
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
                    ? isSmallMobile
                      ? "8px"
                      : isMobile
                        ? "10px"
                        : "12px"
                    : isSmallMobile
                      ? "6px"
                      : isMobile
                        ? "8px"
                        : "10px",
                height:
                  idx === currentSlide
                    ? isSmallMobile
                      ? "8px"
                      : isMobile
                        ? "10px"
                        : "12px"
                    : isSmallMobile
                      ? "6px"
                      : isMobile
                        ? "8px"
                        : "10px",
                borderRadius: "50%",
                backgroundColor: isMobile
                  ? idx === currentSlide
                    ? "#000000"
                    : "rgba(0, 0, 0, 0.2)"
                  : slide.textColor === "#ffffff"
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
            backgroundColor: isMobile
              ? "rgba(0, 0, 0, 0.1)"
              : slide.textColor === "#ffffff"
                ? "rgba(255, 255, 255, 0.2)"
                : "rgba(0, 0, 0, 0.1)",
            border: "none",
            borderRadius: "50%",
            width: isSmallMobile ? "36px" : isMobile ? "40px" : "48px",
            height: isSmallMobile ? "36px" : isMobile ? "40px" : "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background-color 0.3s ease, transform 0.2s ease",
            color: isMobile ? "#000000" : slide.textColor || "#000000",
          }}
          onMouseDown={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(0.95)";
          }}
          onMouseUp={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(1)";
          }}
          onTouchStart={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(0.95)";
          }}
          onTouchEnd={(e) => {
            if (e.currentTarget.style)
              e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <svg
            width={isSmallMobile ? "18" : isMobile ? "20" : "24"}
            height={isSmallMobile ? "18" : isMobile ? "20" : "24"}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      {isMobile && (
        <div
          className="mobile-progress-indicator"
          style={{
            position: "absolute",
            bottom: isSmallMobile ? "60px" : "10px",
            left: "50%",
            transform: "translateX(-50%)",
            width: isSmallMobile ? "80%" : "60%",
            height: isSmallMobile ? "3px" : "4px",
            backgroundColor: "rgba(0,0,0,0.1)",
            borderRadius: isSmallMobile ? "1.5px" : "2px",
            overflow: "hidden",
            zIndex: 20,
            display: showMobileNav ? "none" : "block",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${((currentSlide + 1) / slides.length) * 100}%`,
              backgroundColor: "#000000",
              borderRadius: isSmallMobile ? "1.5px" : "2px",
              transition: "width 0.3s ease-out",
            }}
          />
        </div>
      )}

      <div
        className="gesture-hint"
        style={{
          position: "absolute",
          bottom: isSmallMobile ? "70px" : isMobile ? "90px" : "120px",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: isMobile && showMobileNav ? 0 : 0.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: isSmallMobile ? "0.7rem" : isMobile ? "0.8rem" : "0.9rem",
          color: isMobile ? "#000000" : slide.textColor || "#000000",
          transition: "opacity 0.3s ease",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <div
          className="swipe-icon"
          style={{
            display: "flex",
            alignItems: "center",
            gap: isSmallMobile ? "3px" : "5px",
          }}
        >
          <svg
            width={isSmallMobile ? "14" : "18"}
            height={isSmallMobile ? "14" : "18"}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 8l-4 4 4 4"></path>
          </svg>
          <span>Desliza para navegar</span>
          <svg
            width={isSmallMobile ? "14" : "18"}
            height={isSmallMobile ? "14" : "18"}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M10 8l4 4-4 4"></path>
          </svg>
        </div>
      </div>

      <style>
        {`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes spinner-dash {
            0% { stroke-dashoffset: 94.2477796077; }
            50% { stroke-dashoffset: 23.5619449019; }
            100% { stroke-dashoffset: 94.2477796077; }
          }
          @keyframes spinner-rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .mobile-navigation-overlay {
            -webkit-overflow-scrolling: touch;
          }
          .mobile-navigation-overlay::-webkit-scrollbar {
            width: 3px;
          }
          .mobile-navigation-overlay::-webkit-scrollbar-thumb {
            background-color: rgba(0,0,0,0.2);
            border-radius: 3px;
          }
          .active-thumbnail {
            animation: pulse 1.5s infinite;
          }
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(0,0,0,0.3); }
            70% { box-shadow: 0 0 0 5px rgba(0,0,0,0); }
            100% { box-shadow: 0 0 0 0 rgba(0,0,0,0); }
          }
          .slide-transition-next {
            animation: slideInNext 0.4s ease forwards;
          }
          .slide-transition-prev {
            animation: slideInPrev 0.4s ease forwards;
          }
          @keyframes slideInNext {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideInPrev {
            from { transform: translateX(-100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease forwards;
          }
          .animate-fadeUp {
            animation: fadeUp 0.5s ease forwards;
          }
          .animate-slideInLeft {
            animation: slideInFromLeft 0.5s ease forwards;
          }
          .animate-slideInRight {
            animation: slideInFromRight 0.5s ease forwards;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideInFromLeft {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes slideInFromRight {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          .animation-delay-100 { animation-delay: 0.1s; }
          .animation-delay-200 { animation-delay: 0.2s; }
          .animation-delay-300 { animation-delay: 0.3s; }
          .animation-delay-400 { animation-delay: 0.4s; }
          .animation-delay-500 { animation-delay: 0.5s; }
          
          @media (max-width: 600px) {
            .animation-delay-100 { animation-delay: 0.05s; }
            .animation-delay-200 { animation-delay: 0.1s; }
            .animation-delay-300 { animation-delay: 0.15s; }
            .animation-delay-400 { animation-delay: 0.2s; }
            .animation-delay-500 { animation-delay: 0.25s; }
            
            .slide-content {
              padding: 10px !important;
            }
            
            .slide-title {
              font-size: 1.2rem !important;
              line-height: 1.2 !important;
            }
            
            .slide-number {
              font-size: 0.7rem !important;
            }
            
            .slide-paragraph {
              font-size: 0.9rem !important;
              margin-bottom: 10px !important;
            }
            
            .mobile-navigation-overlay {
              border-top-left-radius: 12px !important;
              border-top-right-radius: 12px !important;
              padding: 12px 8px !important;
            }
            
            .slide-thumbnail {
              border-radius: 4px !important;
            }
            
            .slide-media {
              margin: 0 -10px !important;
            }
            
            .gesture-hint {
              bottom: 45px !important;
              font-size: 0.65rem !important;
            }
            
            .nav-button, .control-button {
              width: 30px !important;
              height: 30px !important;
            }
            
            .indicator-dot {
              width: 5px !important;
              height: 5px !important;
              margin: 0 1px !important;
            }
            
            .mobile-progress-indicator {
              bottom: 40px !important;
              width: 70% !important;
              height: 2px !important;
            }
          }
          
          .control-button:hover .control-tooltip {
            opacity: 1;
            transform: translateX(-50%) translateY(-10px);
          }
          
          @media (hover: hover) {
            .control-button:hover {
              background-color: rgba(0, 0, 0, 0.1) !important;
            }
          }
          
          /* Control button specific hover states */
          .autoplay-button:hover {
            color: #4CAF50 !important;
          }
          
          .fullscreen-button:hover {
            color: #2196F3 !important;
          }
          
          .jump-to-start-button:hover, .jump-to-end-button:hover {
            color: #FF9800 !important;
          }
          
          .prev-slide-button:hover, .next-slide-button:hover {
            color: #424242 !important;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 0.4; }
          }
          
          @keyframes loadingDots {
            0%, 100% { opacity: 0.2; transform: translateY(0px); }
            50% { opacity: 1; transform: translateY(-2px); }
          }
          
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          
          .spinner-rings {
            position: relative;
            width: 40px;
            height: 40px;
          }
          
          .enhanced-loader-container {
            animation: fadeIn 0.3s ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

export default Presentation;
