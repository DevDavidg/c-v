import Presentation from "./components/Presentation";
import "./style.scss";

interface AppProps {
  baseUrl: string;
}

const App = ({ baseUrl }: AppProps) => {
  return (
    <div className="app-container">
      <h1 className="title">Análisis Visual de Sevilla</h1>
      <Presentation baseUrl={baseUrl} />
    </div>
  );
};

export default App;

