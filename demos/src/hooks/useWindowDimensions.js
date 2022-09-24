import React from "react";

const getDimensions = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

function useWindowDimensions() {
  const [dims, setDims] = React.useState(getDimensions());
  React.useEffect(() => {
    const onResize = () => setDims(getDimensions());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return dims;
}

export default useWindowDimensions;
