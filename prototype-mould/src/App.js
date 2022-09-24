import styled from "@emotion/styled";
import SVGBuilder from "./svgBuilder/SVGBuilder";

const Box = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
`;

function App() {
  return (
    <Box>
      <SVGBuilder />
    </Box>
  );
}

export default App;
