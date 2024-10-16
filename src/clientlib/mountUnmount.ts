import { useEffect } from "react";

function useMountUnmount(name: string) {
  useEffect(() => {
    console.log(`${name} mount`);

    return () => {
      console.log(`${name} unmount`);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export default useMountUnmount;
