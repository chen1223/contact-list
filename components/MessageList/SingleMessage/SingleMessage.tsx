import {
  HTMLAttributes,
  forwardRef,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { Message, MessageType } from 'common/type/Message';

import { Transition } from 'react-transition-group';
import classNames from 'classnames';
import classes from './SingleMessage.module.scss';

export interface MessageProps {
  message: Message;
  onMessageConfirm?: (messageId: string) => void;
  onMessageCancel?: (messageId: string) => void;
}

const SingleMessage = forwardRef<
  HTMLDivElement,
  MessageProps & HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  /* Props */
  const { message, onMessageConfirm, onMessageCancel, style } = props;
  const { id, type, msg, okCallback, cancelCallback } = message;

  const showBackdrop = useMemo(() => type === MessageType.CONFIRM, [type]);

  /* Ref */
  const backdropRef = useRef<HTMLDivElement | null>(null);

  const title = useMemo(() => {
    switch (type) {
      case MessageType.INFO:
        return 'Info';
      case MessageType.SUCCESS:
        return 'Success';
      case MessageType.ERROR:
        return 'Error';
      case MessageType.CONFIRM:
        return 'Are you sure?';
    }
  }, [type]);

  const handleConfirmClicked = useCallback(() => {
    okCallback?.();
    onMessageConfirm?.(id);
  }, [id, onMessageConfirm, okCallback]);

  const handleCancelClicked = useCallback(() => {
    cancelCallback?.();
    onMessageCancel?.(id);
  }, [id, cancelCallback, onMessageCancel]);

  return (
    <>
      <div
        className={classNames(
          classes.root,
          type === MessageType.SUCCESS && classes.success,
          type === MessageType.INFO && classes.info,
          type === MessageType.ERROR && classes.error,
          type === MessageType.CONFIRM && classes.confirm
        )}
        ref={ref}
        style={style}
      >
        {/* Message Header */}
        <div className={classes.header}>
          <span className={classes.title}>{title}</span>
        </div>
        {/* Message Body */}
        <div className={classes.body}>
          <p className={classes.msg}>{msg}</p>
        </div>
        {/* Message Footer */}
        <div className={classes.footer}>
          {type === MessageType.CONFIRM && (
            <button
              className={classes.confirmBtn}
              type="button"
              onClick={handleConfirmClicked}
            >
              OK
            </button>
          )}
          {type === MessageType.CONFIRM && (
            <button
              className={classes.cancelBtn}
              type="button"
              onClick={handleCancelClicked}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      {/* Backdrop for confirm message */}
      {showBackdrop && (
        <Transition
          in={showBackdrop}
          ref={backdropRef}
          timeout={200}
          classNames={{
            enter: classes.backdropEnter,
            enterActive: classes.backdropEnterActive,
            exit: classes.backdropExit,
            exitActive: classes.backdropExitActive,
          }}
        >
          <div className={classes.msgBackdrop} ref={backdropRef} />
        </Transition>
      )}
    </>
  );
});

SingleMessage.displayName = 'SingleMessage';

export default SingleMessage;
