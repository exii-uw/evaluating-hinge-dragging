import cross from "./paths/cross";
import SVGViewer from "./SVGViewer";

const CrossViewer = props => {
  const paths = cross(props);
  return <SVGViewer height={10} {...paths} {...props} />;
};

export default CrossViewer;
