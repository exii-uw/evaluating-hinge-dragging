import React from "react";

interface Dimensions {
  width: number;
  height: number;
}

const getDimensions = (): Dimensions => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

const useWindowDimensions = (): Dimensions => {
  const [dims, setDims] = React.useState(getDimensions());
  React.useEffect(() => {
    const onResize = () => setDims(getDimensions());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return dims;
};

export default useWindowDimensions;
