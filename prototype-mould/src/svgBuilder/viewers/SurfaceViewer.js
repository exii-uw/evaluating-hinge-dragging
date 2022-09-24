import surface from "./paths/surface";
import SVGViewer from "./SVGViewer";

const SurfaceViewer = props => {
  const paths = surface(props);
  return <SVGViewer height={30} {...paths} {...props} />;
};

export default SurfaceViewer;
