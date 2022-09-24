import rib from "./paths/concaveRib";
import SVGViewer from "./SVGViewer";

const RibViewer = props => {
  const paths = rib(props);
  return <SVGViewer height={28} {...paths} {...props} />;
};

export default RibViewer;
