import styled from "@emotion/styled";

const SVGBox = styled.div`
  border: 1px solid black;
`;

const SVGViewer = props => {
  return (
    <SVGBox>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${props.width || 50} ${props.height || 50}`}
      >
        {props.paths.map(p => (
          <path
            key={p}
            d={p}
            stroke={props.stroke}
            strokeWidth={props.strokeWidth}
            fill="none"
          />
        ))}
      </svg>
    </SVGBox>
  );
};

export default SVGViewer;
