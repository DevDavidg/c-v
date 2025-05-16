import { useEffect, useRef, useState } from "preact/hooks";

interface AnimatedSVGProps {
  svgPath: string;
  animationDuration?: number;
  staggerDelay?: number;
  backgroundColor?: string; // color de fondo opcional
  width?: string; // ancho personalizado
  height?: string; // altura personalizada
  animateFill?: boolean; // animar el relleno (fill)
  fillDelay?: number; // retraso para comenzar la animación de relleno (en ms)
}

const AnimatedSVG = ({
  svgPath,
  animationDuration = 2,
  staggerDelay = 50,
  backgroundColor = "transparent",
  width = "100%",
  height = "100%",
  animateFill = true,
  fillDelay = 300,
}: AnimatedSVGProps) => {
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [svgLoaded, setSvgLoaded] = useState<boolean>(false);
  const loadStartTime = useRef<number>(0);

  useEffect(() => {
    const loadAndAnimateSVG = async () => {
      try {
        setLoading(true);
        setSvgLoaded(false);
        loadStartTime.current = Date.now();

        const response = await fetch(svgPath);
        if (!response.ok) {
          throw new Error(`Error al cargar el SVG: ${response.statusText}`);
        }

        const svgText = await response.text();

        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
        const svgElement = svgDoc.documentElement;

        const textElements = svgElement.querySelectorAll("text");
        textElements.forEach((el) => el.remove());

        if (svgContainerRef.current) {
          svgContainerRef.current.innerHTML = "";
          svgContainerRef.current.appendChild(svgElement);

          svgElement.setAttribute("width", "100%");
          svgElement.setAttribute("height", "100%");
          svgElement.style.display = "block";
          svgElement.style.margin = "0 auto";
          svgElement.style.maxWidth = "100%";
          svgElement.style.maxHeight = "100vh";
          svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");

          const elements = svgElement.querySelectorAll(
            "path, line, polyline, polygon, rect, circle, ellipse"
          );

          const styleElement = document.createElement("style");
          styleElement.setAttribute("data-svg-animation", "true");
          styleElement.textContent = `
            @keyframes drawStroke {
              to {
                stroke-dashoffset: 0;
              }
            }
            
            @keyframes fillIn {
              from {
                fill-opacity: 0;
              }
              to {
                fill-opacity: 1;
              }
            }
          `;
          document.head.appendChild(styleElement);

          elements.forEach((element, index) => {
            const originalFill = element.getAttribute("fill");
            const hasFill = originalFill && originalFill !== "none";

            if (!element.getAttribute("stroke")) {
              element.setAttribute(
                "stroke",
                element.getAttribute("fill") || "black"
              );
            }

            let length = 1000; // valor por defecto

            if (
              element.tagName === "path" ||
              element.tagName === "line" ||
              element.tagName === "polyline" ||
              element.tagName === "polygon"
            ) {
              const svgElement = element as SVGGeometryElement;
              if (typeof svgElement.getTotalLength === "function") {
                length = svgElement.getTotalLength();
              }
            }

            const styledElement = element as SVGElement;

            styledElement.style.strokeDasharray = `${length}`;
            styledElement.style.strokeDashoffset = `${length}`;
            styledElement.style.animation = `drawStroke ${animationDuration}s ease-in-out forwards`;
            styledElement.style.animationDelay = `${(index * staggerDelay) / 1000}s`;

            if (animateFill && hasFill) {
              styledElement.style.fillOpacity = "0";

              const strokeAnimationDuration = animationDuration * 1000; // convertir a ms
              const elementDelay = index * staggerDelay;
              const fillAnimationDelay =
                strokeAnimationDuration * 0.7 + elementDelay + fillDelay;

              styledElement.style.animation = `drawStroke ${animationDuration}s ease-in-out forwards, 
                 fillIn 0.8s ease-in-out forwards ${fillAnimationDelay / 1000}s`;
            }

            styledElement.style.opacity = "0";

            setTimeout(() => {
              styledElement.style.opacity = "1";
            }, index * staggerDelay);
          });

          setSvgLoaded(true);

          // Ensure loader shows for at least 500ms
          const loadingTime = Date.now() - loadStartTime.current;
          const remainingTime = Math.max(0, 500 - loadingTime);

          if (remainingTime > 0) {
            setTimeout(() => {
              setLoading(false);
            }, remainingTime);
          } else {
            setLoading(false);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        setLoading(false);
      }
    };

    loadAndAnimateSVG();

    return () => {
      const styleElement = document.querySelector("style[data-svg-animation]");
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, [svgPath, animationDuration, staggerDelay, animateFill, fillDelay]);

  return (
    <div
      className="animated-svg-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: width,
        height: height,
        margin: "0 auto",
        position: "relative",
        backgroundColor: backgroundColor,
        overflow: "hidden",
      }}
    >
      {loading && (
        <div
          className="modern-loader-container"
          style={{
            position: "absolute",
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
                : backgroundColor,
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
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: "3px solid rgba(0,0,0,0.1)",
                  borderTopColor:
                    backgroundColor === "#000000" ? "#ffffff" : "#000000",
                  animation: "spin 1s linear infinite",
                  position: "relative",
                }}
              ></div>
            </div>
            <div
              className="loading-text"
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: backgroundColor === "#000000" ? "#ffffff" : "#000000",
                opacity: 0.8,
                animation: "pulse 1.5s ease-in-out infinite",
                textAlign: "center",
              }}
            >
              Cargando SVG
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
          </div>
        </div>
      )}

      {error && (
        <div
          className="error"
          style={{
            color: "red",
            textAlign: "center",
            margin: "20px auto",
            padding: "10px 15px",
            borderRadius: "8px",
            backgroundColor: "rgba(255, 0, 0, 0.1)",
            border: "1px solid rgba(255, 0, 0, 0.3)",
            fontSize: "14px",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="red"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {error}
        </div>
      )}

      <div
        ref={svgContainerRef}
        className="svg-wrapper"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          margin: "0 auto",
          opacity: loading ? 0 : 1,
          transition: "opacity 0.3s ease-in-out",
        }}
      ></div>

      <style>{`
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
        
        @keyframes ripple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }
        
        .spinner-rings {
          position: relative;
          width: 40px;
          height: 40px;
        }
      `}</style>
    </div>
  );
};

export default AnimatedSVG;
