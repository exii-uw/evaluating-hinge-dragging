import back from "./paths/back";
import SVGViewer from "./SVGViewer";

const BackViewer = props => {
  const paths = back(props);
  return <SVGViewer height={10} {...paths} {...props} />;
};

export default BackViewer;
