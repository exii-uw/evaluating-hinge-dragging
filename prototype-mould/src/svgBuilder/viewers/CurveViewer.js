import curve from "./paths/curve";
import SVGViewer from "./SVGViewer";

const CurveViewer = props => {
  const paths = curve(props);
  return <SVGViewer height={10} {...paths} {...props} />;
};

export default CurveViewer;
