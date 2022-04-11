import classNames from 'classnames';
import React, { useState, useRef } from 'react';
import { usePopper } from 'react-popper';
import { useDispatch } from 'react-redux';

import { simpleEmojiReact } from 'soapbox/actions/emoji_reacts';
import { openModal } from 'soapbox/actions/modals';
import EmojiSelector from 'soapbox/components/ui/emoji-selector/emoji-selector';
import { useAppSelector, useOwnAccount, useSoapboxConfig } from 'soapbox/hooks';

interface IEmojiButtonWrapper {
  statusId: string,
  children: JSX.Element,
}

/** Provides emoji reaction functionality to the underlying button component */
const EmojiButtonWrapper: React.FC<IEmojiButtonWrapper> = ({ statusId, children }): JSX.Element | null => {
  const dispatch = useDispatch();
  const ownAccount = useOwnAccount();
  const status = useAppSelector(state => state.statuses.get(statusId));
  const soapboxConfig = useSoapboxConfig();

  const [visible, setVisible] = useState(false);
  // const [focused, setFocused] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);

  const { styles, attributes } = usePopper(ref.current, popperRef.current, {
    placement: 'top-start',
    strategy: 'fixed',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [-10, 0],
        },
      },
    ],
  });

  if (!status) return null;

  const handleMouseEnter = () => {
    setVisible(true);
  };

  const handleMouseLeave = () => {
    setVisible(false);
  };

  const handleReact = (emoji: string): void => {
    if (ownAccount) {
      dispatch(simpleEmojiReact(status, emoji));
    } else {
      dispatch(openModal('UNAUTHORIZED', {
        action: 'FAVOURITE',
        ap_id: status.url,
      }));
    }

    setVisible(false);
  };

  // const handleUnfocus: React.EventHandler<React.KeyboardEvent> = () => {
  //   setFocused(false);
  // };

  const selector = (
    <div
      className={classNames('fixed z-50 transition-opacity duration-100', {
        'opacity-0 pointer-events-none': !visible,
      })}
      ref={popperRef}
      style={styles.popper}
      {...attributes.popper}
    >
      <EmojiSelector
        emojis={soapboxConfig.allowedEmoji}
        onReact={handleReact}
        // focused={focused}
        // onUnfocus={handleUnfocus}
      />
    </div>
  );

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {React.cloneElement(children, {
        ref,
      })}

      {selector}
    </div>
  );
};

export default EmojiButtonWrapper;
