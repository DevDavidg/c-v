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

  useEffect(() => {
    const loadAndAnimateSVG = async () => {
      try {
        setLoading(true);

        // Cargar el SVG como texto
        const response = await fetch(svgPath);
        if (!response.ok) {
          throw new Error(`Error al cargar el SVG: ${response.statusText}`);
        }

        const svgText = await response.text();

        // Crear un elemento SVG para parsear el contenido
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
        const svgElement = svgDoc.documentElement;

        // Eliminar elementos de texto dentro del SVG
        const textElements = svgElement.querySelectorAll("text");
        textElements.forEach((el) => el.remove());

        // Insertar el SVG en el DOM
        if (svgContainerRef.current) {
          svgContainerRef.current.innerHTML = "";
          svgContainerRef.current.appendChild(svgElement);

          // Asegurar que el SVG ocupe todo el espacio disponible manteniendo su proporción
          svgElement.setAttribute("width", "100%");
          svgElement.setAttribute("height", "100%");
          svgElement.style.display = "block";
          svgElement.style.margin = "0 auto";
          svgElement.style.maxWidth = "100%";
          svgElement.style.maxHeight = "100vh";
          svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");

          // Seleccionar todos los elementos que pueden tener stroke o fill
          const elements = svgElement.querySelectorAll(
            "path, line, polyline, polygon, rect, circle, ellipse"
          );

          // Crear y aplicar estilos para la animación
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

          // Configurar cada elemento para la animación
          elements.forEach((element, index) => {
            // Obtener el color de relleno original
            const originalFill = element.getAttribute("fill");
            const hasFill = originalFill && originalFill !== "none";

            // Asegurarse de que el elemento tenga un stroke
            if (!element.getAttribute("stroke")) {
              element.setAttribute(
                "stroke",
                element.getAttribute("fill") || "black"
              );
            }

            // Obtener la longitud del trazo - manejar correctamente los tipos
            let length = 1000; // valor por defecto

            // Intentar obtener la longitud real del trazo para elementos que admiten getTotalLength
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

            // Convertir a SVGElement o HTMLElement para acceder a style
            const styledElement = element as SVGElement;

            // Configurar la animación del trazo
            styledElement.style.strokeDasharray = `${length}`;
            styledElement.style.strokeDashoffset = `${length}`;
            styledElement.style.animation = `drawStroke ${animationDuration}s ease-in-out forwards`;
            styledElement.style.animationDelay = `${(index * staggerDelay) / 1000}s`;

            // Configurar la animación del relleno si el elemento tiene relleno
            if (animateFill && hasFill) {
              // Guardar el color de relleno original
              styledElement.style.fillOpacity = "0";

              // Calcular el retraso para la animación del relleno después del trazo
              const strokeAnimationDuration = animationDuration * 1000; // convertir a ms
              const elementDelay = index * staggerDelay;
              const fillAnimationDelay =
                strokeAnimationDuration * 0.7 + elementDelay + fillDelay;

              // Configurar la animación del relleno
              styledElement.style.animation = `drawStroke ${animationDuration}s ease-in-out forwards, 
                 fillIn 0.8s ease-in-out forwards ${fillAnimationDelay / 1000}s`;
            }

            // Hacer el elemento inicialmente invisible
            styledElement.style.opacity = "0";

            // Agregar evento para hacer visible el elemento cuando comience su animación
            setTimeout(() => {
              styledElement.style.opacity = "1";
            }, index * staggerDelay);
          });

          setLoading(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        setLoading(false);
      }
    };

    loadAndAnimateSVG();

    // Limpieza
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
        <p
          style={{
            textAlign: "center",
            fontWeight: "500",
            margin: "20px auto",
          }}
        >
          Cargando SVG...
        </p>
      )}

      {error && (
        <p
          className="error"
          style={{
            color: "red",
            textAlign: "center",
            margin: "20px auto",
          }}
        >
          {error}
        </p>
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
        }}
      ></div>
    </div>
  );
};

export default AnimatedSVG;
