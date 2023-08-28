import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { ContactContext } from 'store/ContactContext';
import classes from './ContactDetail.module.scss';
import { useRouter } from 'next/router';

const ContactDetail: FC = () => {
  /* useRoute */
  const router = useRouter();

  /* Context */
  const { currentContact, getContact } = useContext(ContactContext);

  /* State */
  const [contactId, setContactId] = useState<string | undefined>();

  const name = useMemo(
    () =>
      currentContact
        ? `${currentContact.first_name} ${currentContact.last_name}`
        : '',
    [currentContact]
  );

  useEffect(() => {
    if (!router.isReady) return;
    const contactId = router.query.contactId as string;
    if (!contactId) {
      router.push('/');
      return;
    }
    setContactId(contactId);
  }, [router]);

  useEffect(() => {
    if (!contactId) return;
    getContact(contactId);
  }, [contactId, getContact]);

  const handleEditContact = useCallback(() => {
    router.push(`/contact/update/${contactId}`);
  }, [contactId, router]);

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <h1 className={classes.title}>{name}</h1>
        <button
          className={classes.editBtn}
          type="button"
          onClick={handleEditContact}
        >
          Edit Contact
        </button>
      </div>
      <div className={classes.body}>
        {/* Job */}
        <div className={classes.detailRow}>
          <span className={classes.title}>Job</span>
          <span className={classes.detail}>{currentContact?.job}</span>
        </div>
        {/* Description */}
        <div className={classes.detailRow}>
          <span className={classes.title}>Description</span>
          <span className={classes.detail}>{currentContact?.description}</span>
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;
