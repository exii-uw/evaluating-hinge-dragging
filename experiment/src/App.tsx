import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ExperimentRunner from "./components/ExperimentRunner";
import LoginScreen from "./components/LoginScreen";
import TestDrag from "./components/TestDrag";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/testdrag" element={<TestDrag />} />
          <Route path="/:pid" element={<ExperimentRunner />} />
          <Route
            path="/"
            element={<LoginScreen getLink={(pid) => `/${pid}`} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
