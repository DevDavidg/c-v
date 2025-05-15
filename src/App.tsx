import Presentation from "./components/Presentation";
import "./style.scss";

const App = () => {
  return (
    <div className="app-container">
      <h1 className="title">Análisis Visual de Sevilla</h1>
      <Presentation />
    </div>
  );
};

export default App;
