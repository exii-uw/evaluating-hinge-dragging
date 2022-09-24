import React from "react";
import BarButton from "./BarButton";
import AirplaneOn from "./icons/airplane.svg";
import AirplaneOff from "./icons/airplane_off.svg";
import MediaRev from "./icons/media_reverse.svg";
import MediaPlay from "./icons/play.svg";
import MediaPause from "./icons/pause.svg";
import MediaFw from "./icons/media_forward.svg";
import VolumeUp from "./icons/volume_up.svg";
import VolumeMute from "./icons/volume_mute.svg";
import BrightnessHigh from "./icons/brightness_high.svg";
import BrightnessLow from "./icons/brightness_low.svg";
import WifiOn from "./icons/wifi.svg";
import WifiOff from "./icons/wifi_off.svg";
import ToggleButton from "./ToggleButton";
import Slider from "./slider/Slider";
import DragMenu from "./dragMenu/DragMenu";
import { wifiOptions } from "./dragMenu/constants";
import HiddenBar from "./HiddenBar";

function Touchbar() {
  const [hideIcons, setHideIcons] = React.useState(false);
  return (
    <HiddenBar>
      <BarButton src={MediaRev} hideIcon={hideIcons} />
      <ToggleButton
        onImg={MediaPlay}
        offImg={MediaPause}
        hideIcon={hideIcons}
      />
      <BarButton src={MediaFw} hideIcon={hideIcons} />
      <Slider
        onImg={VolumeUp}
        offImg={VolumeMute}
        setHideIcons={setHideIcons}
        hideIcon={hideIcons}
      />
      <Slider
        onImg={BrightnessHigh}
        offImg={BrightnessLow}
        setHideIcons={setHideIcons}
        hideIcon={hideIcons}
      />
      <ToggleButton
        onImg={AirplaneOn}
        offImg={AirplaneOff}
        hideIcon={hideIcons}
      />
      <DragMenu
        onImg={WifiOn}
        offImg={WifiOff}
        setHideIcons={setHideIcons}
        hideIcon={hideIcons}
        options={wifiOptions}
      />
    </HiddenBar>
  );
}

export default Touchbar;
