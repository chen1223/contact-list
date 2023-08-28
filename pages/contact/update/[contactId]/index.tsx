import { FC, useCallback, useContext, useEffect, useState } from 'react';

import { AppContext } from 'store/AppContext';
import { Contact } from 'common/type/Contact';
import { ContactContext } from 'store/ContactContext';
import ContactForm from 'components/Contact/ContactForm/ContactForm';
import { MessageType } from 'common/type/Message';
import classes from './ContactEdit.module.scss';
import { useRouter } from 'next/router';
import { v4 as uuid } from 'uuid';

const ContactEdit: FC = () => {
  /* useRoute */
  const router = useRouter();

  /* Context */
  const { message$ } = useContext(AppContext);
  const { currentContact, getContact, updateContact } =
    useContext(ContactContext);

  /* State */
  const [contactId, setContactId] = useState<string | undefined>();

  useEffect(() => {
    if (!router.isReady) return;
    const contactId = router.query.contactId as string;
    if (!contactId) {
      message$.next({
        id: uuid(),
        type: MessageType.ERROR,
        msg: 'Invalid path.\n Contact ID not found',
      });
      router.push('/');
    }
    setContactId(contactId);
  }, [router, message$]);

  useEffect(() => {
    if (!contactId) return;
    getContact(contactId);
  }, [contactId, getContact]);

  const handleCancleClick = useCallback(() => {
    router.push(`/contact/${contactId}`);
  }, [contactId, router]);

  const handleSaveSuccess = useCallback(() => {
    router.push(`/contact/${contactId}`);
  }, [contactId, router]);

  const handleSaveClick = useCallback(
    (c: Contact) => {
      updateContact(c, handleSaveSuccess);
    },
    [updateContact, handleSaveSuccess]
  );

  if (!currentContact) return null;

  return (
    <div className={classes.root}>
      <h1 className={classes.title}>Update Contact</h1>
      <ContactForm
        data={currentContact}
        onCancel={handleCancleClick}
        onSave={handleSaveClick}
      />
    </div>
  );
};

export default ContactEdit;
