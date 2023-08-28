import { FC, HTMLAttributes, useCallback, useEffect, useState } from 'react';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import classNames from 'classnames';
import classes from './Header.module.scss';
import { useRouter } from 'next/router';

const Header: FC<HTMLAttributes<HTMLDivElement>> = () => {
  const router = useRouter();
  const [drawerOpened, setDrawerOpened] = useState<boolean>(false);

  const handleDrawerLinkClick = useCallback(() => {
    setDrawerOpened(false);
    router.push('/contact/new');
  }, [router]);

  useEffect(() => {
    const bodyEl = document.querySelector('body');
    bodyEl.style.overflow = drawerOpened ? 'hidden' : 'auto';
  }, [drawerOpened]);

  return (
    <div className={classes.root}>
      <button
        className={classNames(classes.drawerBtn, 'iconBtn')}
        type="button"
        title="Open Drawer"
        aria-label="Open Drawer"
        onClick={() => setDrawerOpened(true)}
      >
        <FontAwesomeIcon className={classes.icon} icon={faBars} />
      </button>
      <Link className={classes.contactList} href="/">
        Contact List
      </Link>
      <Link className={classes.addContact} href="/contact/new">
        Add Contact
      </Link>
      {/* Drawer */}
      <div
        className={classNames(classes.drawer, drawerOpened && classes.opened)}
      >
        <div className={classes.header}>
          <button
            className={classNames(classes.closeBtn, 'iconBtn')}
            type="button"
            aria-label="Close Drawer"
            title="Close Drawer"
            onClick={() => setDrawerOpened(false)}
          >
            <FontAwesomeIcon className={classes.icon} icon={faXmark} />
          </button>
        </div>
        <div className={classes.body}>
          <button
            className={classes.drawerLink}
            type="button"
            aria-label="Add Contact"
            title="Add Contact"
            onClick={handleDrawerLinkClick}
          >
            Add Contact
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
