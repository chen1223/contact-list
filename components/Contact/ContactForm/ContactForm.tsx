import { FC, HTMLAttributes, useCallback, useContext, useRef } from 'react';

import { AppContext } from 'store/AppContext';
import { Contact } from 'common/type/Contact';
import { MessageType } from 'common/type/Message';
import classNames from 'classnames';
import classes from './ContactForm.module.scss';
import { v4 as uuid } from 'uuid';

export interface ContactFormProps {
  data?: Contact;
  onSave?: (_c: Contact) => void;
  onCancel?: () => void;
}

const ContactForm: FC<ContactFormProps & HTMLAttributes<HTMLFormElement>> = ({
  data,
  onSave,
  onCancel,
  className,
}) => {
  /* Context */
  const { message$ } = useContext(AppContext);

  /* Ref */
  const fnRef = useRef<HTMLInputElement | null>(null);
  const lnRef = useRef<HTMLInputElement | null>(null);
  const jobRef = useRef<HTMLInputElement | null>(null);
  const descRef = useRef<HTMLTextAreaElement | null>(null);

  const isValid = useCallback(() => {
    if (
      !fnRef ||
      !fnRef.current ||
      !lnRef ||
      !lnRef.current ||
      !jobRef ||
      !jobRef.current ||
      !descRef ||
      !descRef.current
    )
      return false;
    // first name validation
    if (!fnRef.current.value) return false;
    // last name validation
    if (!lnRef.current.value) return false;
    // job validation
    if (!jobRef.current.value) return false;
    // description can be empty
    return true;
  }, [fnRef, lnRef, jobRef, descRef]);

  const handleSaveDetail = useCallback(() => {
    if (!isValid()) {
      message$.next({
        id: uuid(),
        type: MessageType.INFO,
        msg: 'First Name, Last Name, and Job cannot be empty',
      });
      return;
    }
    const updatedContact: Contact = {
      first_name: fnRef.current.value,
      last_name: lnRef.current.value,
      job: jobRef.current.value,
      description: descRef.current.value || '',
    };
    if (data?.id) updatedContact.id = data.id;
    onSave?.(updatedContact);
  }, [data, message$, isValid, onSave]);

  const handleCancelDetail = useCallback(() => {
    onCancel?.();
  }, [onCancel]);

  return (
    <form className={classNames(classes.root, className)}>
      <div className={classes.body}>
        {/* First Name */}
        <div className={classes.detailRow}>
          <span className={classes.title}>First Name</span>
          <input
            className={classes.control}
            defaultValue={data?.first_name || ''}
            ref={fnRef}
          />
        </div>
        {/* Last Name */}
        <div className={classes.detailRow}>
          <span className={classes.title}>Last Name</span>
          <input
            className={classes.control}
            defaultValue={data?.last_name || ''}
            ref={lnRef}
          />
        </div>
        {/* Job */}
        <div className={classes.detailRow}>
          <span className={classes.title}>Job</span>
          <input
            className={classes.control}
            defaultValue={data?.job || ''}
            ref={jobRef}
          />
        </div>
        {/* Description */}
        <div className={classes.detailRow}>
          <span className={classes.title}>Description</span>
          <textarea
            className={classes.control}
            rows={4}
            defaultValue={data?.description || ''}
            ref={descRef}
          />
        </div>
      </div>
      <div className={classes.footer}>
        <button
          className={classes.saveBtn}
          type="button"
          onClick={handleSaveDetail}
        >
          Save
        </button>
        <button
          className={classes.cancelBtn}
          type="button"
          onClick={handleCancelDetail}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
