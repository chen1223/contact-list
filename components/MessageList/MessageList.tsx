import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {
  FC,
  HTMLAttributes,
  createRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Message, MessageType } from 'common/type/Message';

import { AppContext } from 'store/AppContext';
import { MESSAGE_DURATION } from 'common/Config';
import SingleMessage from 'components/MessageList/SingleMessage/SingleMessage';
import classes from './MessageList.module.scss';

const MessageList: FC<HTMLAttributes<HTMLDivElement>> = () => {
  /* Context */
  const { message$ } = useContext(AppContext);

  /* States */
  const [msgQueue, setMsgQueue] = useState<
    Array<Message & { nodeRef: React.MutableRefObject<HTMLDivElement | null> }>
  >([]);

  const removeMsg = useCallback((messageId: string) => {
    setMsgQueue((prevList) => prevList.filter((m) => m.id !== messageId));
  }, []);

  useEffect(() => {
    const s = message$.subscribe((m) => {
      setMsgQueue((prevList) => [...prevList, { ...m, nodeRef: createRef() }]);
      // remove message after a brief delay
      if (m.type !== MessageType.CONFIRM)
        setTimeout(() => removeMsg(m.id), MESSAGE_DURATION);
    });
    return () => {
      s.unsubscribe();
    };
  }, [message$, removeMsg]);

  const handleMsgConfirmed = useCallback(
    (messageId: string) => removeMsg(messageId),
    [removeMsg]
  );

  const handleMsgCancelled = useCallback(
    (messageId: string) => removeMsg(messageId),
    [removeMsg]
  );

  return (
    <>
      <TransitionGroup className={classes.root} component="div">
        {msgQueue.map(({ nodeRef, ...m }, i) => (
          <CSSTransition
            key={m.id}
            timeout={200}
            nodeRef={nodeRef}
            classNames={{
              enter: classes.msgEnter,
              enterActive: classes.msgEnterActive,
              exit: classes.msgExit,
              exitActive: classes.msgExitActive,
            }}
          >
            <SingleMessage
              message={m}
              onMessageConfirm={handleMsgConfirmed}
              onMessageCancel={handleMsgCancelled}
              ref={nodeRef}
              style={{
                transform:
                  m.type !== MessageType.CONFIRM
                    ? `translateY(calc((100% + 0.5rem) * ${i}))`
                    : 'translate3D(-50%, -50%, 0)',
              }}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </>
  );
};

export default MessageList;
