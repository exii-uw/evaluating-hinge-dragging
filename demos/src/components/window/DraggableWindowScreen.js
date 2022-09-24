import DraggableWindow from "./DraggableWindow";
import BgImage from "../util/BgImage";
import Screen from "../util/Screen";
import img from "./screenshots/bg.jpg";

function DraggableWindowScreen() {
  return (
    <Screen>
      <BgImage src={img} draggable={false} />
      <DraggableWindow />
    </Screen>
  );
}

export default DraggableWindowScreen;
