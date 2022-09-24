import { useParams } from "react-router-dom";

const usePid = () => {
  const { pid } = useParams();
  return pid === undefined ? undefined : parseInt(pid);
};

export default usePid;
