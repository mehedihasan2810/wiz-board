import { useRef, useEffect, useState, ReactNode, FC } from "react";
import { createPortal } from "react-dom";

interface Props {
  children: ReactNode;
  selector?: string;
}

const ClientOnlyPortal: FC<Props> = ({ children, selector }) => {
//   const ref = useRef();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // ref.current = document.querySelector(selector);
    setMounted(true);
  }, []);

  return mounted ? createPortal(children, document.body) : null;
};

export default ClientOnlyPortal;
