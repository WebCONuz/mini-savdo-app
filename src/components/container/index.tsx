import { type ReactNode } from "react";

const Container = ({ children }: { children: ReactNode }) => {
  return <div className="px-4">{children}</div>;
};

export default Container;
