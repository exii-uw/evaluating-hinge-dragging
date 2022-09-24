import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import React from "react";
import styled from "@emotion/styled";
import exportSVG from "./exportSVG";
import rib from "./viewers/paths/concaveRib";
import curve from "./viewers/paths/curve";
import back from "./viewers/paths/back";
import surface from "./viewers/paths/surface";

const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 10px;
`;

const params = [
  "strokeWidth",
  "angle",
  "notchDepth",
  "notchLength",
  "insideRadius",
  "plasticThickness",
  "plasticWidth",
  "plasticHeight",
  "padding",
  "notchEdgeInset",
  "notchCurveInset",
  "nRibs",
  "boltRadius",
  "nNotches",
];
const ParamChooser = props => {
  const [vals, setVals] = React.useState(props.vals);
  return (
    <Box>
      {params.map(p => (
        <TextField
          key={p}
          label={p}
          variant="outlined"
          value={vals[p]}
          onChange={e => {
            props.setVals({
              ...props.vals,
              [p]: Number.parseFloat(e.target.value),
            });
            setVals({ ...vals, [p]: e.target.value });
          }}
        />
      ))}
      <Button onClick={() => exportSVG("rib.svg", rib(props.vals), props.vals)}>
        Download rib
      </Button>
      <Button
        onClick={() => exportSVG("curve.svg", curve(props.vals), props.vals)}
      >
        Download curve
      </Button>
      <Button
        onClick={() => exportSVG("back.svg", back(props.vals), props.vals)}
      >
        Download back
      </Button>
      <Button
        onClick={() => exportSVG("surface.svg", surface(props.vals), props.vals)}
      >
        Download surface
      </Button>
    </Box>
  );
};

export default ParamChooser;
