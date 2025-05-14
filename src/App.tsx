import AnimatedSVG from "./components/SVGCanvas";
import "./style.scss";

const App = () => {
  return (
    <div className="app-container">
      <h1 className="title">¡Manipulador de SVG con Canvas!</h1>
      <AnimatedSVG
        svgPath="./assets/img.svg"
        animationDuration={1}
        staggerDelay={10}
      />
      <AnimatedSVG
        svgPath="./assets/lineamodular.svg"
        animationDuration={1}
        staggerDelay={10}
      />
      <AnimatedSVG
        svgPath="./assets/negativo.svg"
        animationDuration={1}
        staggerDelay={100}
      />
      <AnimatedSVG
        svgPath="./assets/positivo.svg"
        animationDuration={2}
        staggerDelay={10}
      />
      <AnimatedSVG
        svgPath="./assets/escaladegrises.svg"
        animationDuration={3}
        staggerDelay={15}
      />
      <AnimatedSVG
        svgPath="./assets/planosblancoynegro.svg"
        animationDuration={5}
        staggerDelay={20}
      />
      <AnimatedSVG
        svgPath="./assets/lineasyplanos.svg"
        animationDuration={1}
        staggerDelay={15}
      />
      <AnimatedSVG
        svgPath="./assets/trama.svg"
        animationDuration={5}
        staggerDelay={20}
      />
    </div>
  );
};

export default App;
