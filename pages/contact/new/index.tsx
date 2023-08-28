import { FC, useCallback, useContext } from 'react';

import { Contact } from 'common/type/Contact';
import { ContactContext } from 'store/ContactContext';
import ContactForm from 'components/Contact/ContactForm/ContactForm';
import classes from './NewContact.module.scss';
import { useRouter } from 'next/router';

const NewContact: FC = () => {
  /* Context */
  const { createContact } = useContext(ContactContext);

  /* Router */
  const router = useRouter();

  const handleCancelClick = useCallback(() => {
    router.push('/');
  }, [router]);

  const handleSaveSuccess = useCallback(() => {
    router.push('/');
  }, [router]);

  const handleSaveClick = useCallback(
    (c: Contact) => {
      createContact(c, handleSaveSuccess);
    },
    [createContact, handleSaveSuccess]
  );

  return (
    <div className={classes.root}>
      <h1 className={classes.title}>New Contact</h1>
      <ContactForm onCancel={handleCancelClick} onSave={handleSaveClick} />
    </div>
  );
};

export default NewContact;
