import { FC, HTMLAttributes, useCallback, useContext } from 'react';

import { AppContext } from 'store/AppContext';
import { Contact } from 'common/type/Contact';
import { ContactContext } from 'store/ContactContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MessageType } from 'common/type/Message';
import classNames from 'classnames';
import classes from './ContactCard.module.scss';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { v4 as uuid } from 'uuid';

export interface ContactCardProps {
  data: Contact;
}

const ContactCard: FC<ContactCardProps & HTMLAttributes<HTMLDivElement>> = ({
  data,
}) => {
  /* Router */
  const router = useRouter();

  /* Context */
  const { message$ } = useContext(AppContext);
  const { deleteContact } = useContext(ContactContext);

  /* Props */
  const { id, first_name, last_name, job, description } = data;

  const handleEditClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      router.push(`/contact/update/${id}`);
    },
    [id, router]
  );

  const handleDeleteConfirm = useCallback(
    () => deleteContact(id),
    [id, deleteContact]
  );

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      message$.next({
        id: uuid(),
        type: MessageType.CONFIRM,
        msg: 'Delete cannot be undone',
        okCallback: handleDeleteConfirm,
      });
    },
    [message$, handleDeleteConfirm]
  );

  const handleContactClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      router.push(`/contact/${id}`);
    },
    [router, id]
  );

  return (
    <div
      className={classes.root}
      title="View Detail"
      onClick={handleContactClick}
    >
      <div className={classes.basicInfo}>
        <div className={classes.user}>
          <FontAwesomeIcon
            className={classes.avatar}
            aria-label="avatar icon"
            icon={faUser}
          />
          <span
            className={classes.name}
            aria-label="name"
          >{`${first_name} ${last_name}`}</span>
        </div>
        <div className={classes.actions}>
          <button
            className={classes.actionBtn}
            type="button"
            aria-label="Edit Contact"
            title="Edit Contact"
            onClick={handleEditClick}
          >
            Edit
          </button>
          <button
            className={classNames(classes.actionBtn, classes.deleteBtn)}
            type="button"
            aria-label="Delete Contact"
            title="Delete Contact"
            onClick={handleDeleteClick}
          >
            Delete
          </button>
        </div>
      </div>
      <div className={classes.detailInfo}>
        <div className={classes.detailRow}>
          <span className={classes.detailTitle}>Job</span>
          <span className={classes.detail}>{job}</span>
        </div>
        <div className={classes.detailRow}>
          <span className={classes.detailTitle}>Description</span>
          <span className={classes.detail}>{description}</span>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
