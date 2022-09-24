import React from "react";
import HiddenBar from "../HiddenBar";
import MultitaskWindow from "./MultitaskWindow";

function MultitaskBar({ onMove }) {
  const cb = React.useCallback(
    isBottom => {
      // Do something to close hiddenbar if possible
      onMove(isBottom);
    },
    [onMove]
  );
  return (
    <HiddenBar isLeft height="10rem">
      <MultitaskWindow onMove={cb} />
      <MultitaskWindow onMove={cb} />
      <MultitaskWindow onMove={cb} />
    </HiddenBar>
  );
}

export default MultitaskBar;
