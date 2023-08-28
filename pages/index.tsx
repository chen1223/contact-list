import { FC, useContext } from 'react';
import {
  faArrowDownAZ,
  faArrowDownZA,
} from '@fortawesome/free-solid-svg-icons';

import ContactCard from 'components/Contact/ContactCard/ContactCard';
import { ContactContext } from 'store/ContactContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SortDirection } from 'common/type/Contact';
import classNames from 'classnames';
import classes from './Index.module.scss';
import { useLifecycles } from 'react-use';

const Home: FC = () => {
  /* Context */
  const { contacts, getContacts, changeSortDirs, sortDirection } =
    useContext(ContactContext);

  useLifecycles(
    // mount
    () => {
      getContacts();
    },
    // unmount
    () => {}
  );

  return (
    <>
      <main className={classes.root}>
        <div className={classes.titleRow}>
          <h1 className={classes.title}> Contacts</h1>
          <button
            className={classNames('iconBtn', classes.sortBtn)}
            onClick={changeSortDirs}
            aria-label="sort contact"
            title="sort contact"
          >
            {sortDirection === SortDirection.ASC && (
              <FontAwesomeIcon icon={faArrowDownAZ} />
            )}
            {sortDirection === SortDirection.DESC && (
              <FontAwesomeIcon icon={faArrowDownZA} />
            )}
          </button>
        </div>
        <ul className={classes.contactList}>
          {contacts.map((c) => (
            <li className={classes.contactItem} key={c.id}>
              <ContactCard data={c} />
            </li>
          ))}
        </ul>
      </main>
    </>
  );
};

export default Home;
