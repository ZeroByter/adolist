import { FC, ReactNode } from "react";
import css from "./container.module.scss";
import classNames from "classnames";

type Props = {
  children: ReactNode;
  className?: string;
};

const LayoutContainer: FC<Props> = ({ children, className }) => {
  return (
    <div className={css.root}>
      <div className={classNames(css.container, className)}>{children}</div>
    </div>
  );
};

export default LayoutContainer;
