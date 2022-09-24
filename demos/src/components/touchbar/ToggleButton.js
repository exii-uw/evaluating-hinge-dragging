import React from "react";
import BarButton from "./BarButton";

function ToggleButton({ onImg, offImg, hideIcon }) {
  const [isOn, setIsOn] = React.useState(false);
  return (
    <BarButton
      hideIcon={hideIcon}
      onClick={() => setIsOn(on => !on)}
      src={isOn ? onImg : offImg}
    />
  );
}

export default ToggleButton;
