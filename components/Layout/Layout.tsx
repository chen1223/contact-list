import { FC, HTMLAttributes } from 'react';

import classes from './Layout.module.scss';

const Layout: FC<HTMLAttributes<HTMLDivElement>> = ({ children }) => {
  return <div className={classes.root}>{children}</div>;
};

export default Layout;
