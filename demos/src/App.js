import { BrowserRouter, Routes, Route } from "react-router-dom";
import DraggableWindowScreen from "./components/window/DraggableWindowScreen";
import DraggableCircleScreen from "./components/drawing/DraggableCircleScreen";
import Home from "./components/home/Home";
import {
  FILES_ROUTE,
  HOME_ROUTE,
  WINDOW_ROUTE,
  DRAW_ROUTE,
  TOUCHBAR_ROUTE,
} from "./routes";
import TouchbarScreen from "./components/touchbar/TouchbarScreen";
import FileManagerWindow from "./components/fileManager/FileManagerWindow";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={DRAW_ROUTE} element={<DraggableCircleScreen />} />
        <Route path={WINDOW_ROUTE} element={<DraggableWindowScreen />} />
        <Route path={TOUCHBAR_ROUTE} element={<TouchbarScreen />} />
        <Route path={FILES_ROUTE} element={<FileManagerWindow />} />
        <Route path={HOME_ROUTE} element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
