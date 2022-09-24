import React from "react";
import styled from "@emotion/styled";
import RibViewer from "./viewers/RibViewer";
import BackViewer from "./viewers/BackViewer";
import CurveViewer from "./viewers/CurveViewer";
import SurfaceViewer from "./viewers/SurfaceViewer";
import ParamChooser from "./ParamChooser";

const ViewerBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  padding: 20px;
`;

// Clarifications:
// 90 <= angle <= 180
// padding > 2 * notchDepth
// notchEdgeInset >= 2 * notchDepth (thickness of notch material)
const defaultProps = {
  stroke: "#F00",
  strokeWidth: 0.01,
  angle: 105, // Angle of the tilt
  notchDepth: 0.3, // Depth of notches for cross beams
  notchLength: 2, // Length of the notch
  insideRadius: 4, // Radius of the curve for the digitizer (mold will be bigger)
  plasticThickness: 0.3, // Thickness of plastic placed on the curve
  plasticWidth: 29, // Width of the digitizer
  plasticHeight: 55, // Height of the digitizer
  padding: 5, // Padding = max radius we can use and thickness of long parts of ribs
  notchEdgeInset: 2, // How far from the edges the notch gets inset
  notchCurveInset: 1, // How far from the curve the notch gets inset
  nRibs: 12, // Number of ribs to make (used for cross)
  boltRadius: 0.4, // Radius of the bolt connecting the main rib to the curve
  nNotches: 5, // Number of notches per side (2 or greater)
};

const SVGBuilder = () => {
  const [vals, setVals] = React.useState(defaultProps);
  return (
    <>
      <ViewerBox>
        <RibViewer {...vals} />
        <CurveViewer {...vals} />
        <BackViewer {...vals} />
        <SurfaceViewer {...vals} />
      </ViewerBox>
      <ParamChooser vals={vals} setVals={v => setVals(v)} />
    </>
  );
};

export default SVGBuilder;
