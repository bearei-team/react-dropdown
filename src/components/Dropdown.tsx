import type {BaseMenuProps} from '@bearei/react-menu';
import {bindEvents, handleDefaultEvent} from '@bearei/react-util/lib/event';
import {
  DetailedHTMLProps,
  HTMLAttributes,
  ReactNode,
  Ref,
  TouchEvent,
  useCallback,
  useEffect,
  useId,
  useState,
} from 'react';
import type {GestureResponderEvent, ViewProps} from 'react-native';

/**
 * Dropdown options
 */
export interface DropdownOptions<E = unknown> {
  /**
   * Dropdown the visible status
   */
  visible?: boolean;

  /**
   * Event that triggers a dropdown visible state change
   */
  event?: E;
}

/**
 * Base dropdown props
 */
export interface BaseDropdownProps<T = HTMLElement>
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<T>, T> & ViewProps & Pick<DropdownOptions, 'visible'>,
    'onClick' | 'onTouchEnd' | 'onPress'
  > {
  /**
   * Custom ref
   */
  ref?: Ref<T>;

  /**
   * Set the default visible state of the dropdown
   */
  defaultVisible?: boolean;

  /**
   * Dropdown menu configuration options
   */
  menu?: BaseMenuProps<T>;

  /**
   * Whether or not to disable the dropdown
   */
  disabled?: boolean;

  /**
   * Whether or not the dropdown is loading
   */
  loading?: boolean;

  /**
   * Call back this function when the dropdown visible state changes
   */
  onVisible?: <E>(options: DropdownOptions<E>) => void;

  /**
   * Call this function when the dropdown closes
   */
  onClose?: <E>(options: DropdownOptions<E>) => void;

  /**
   * Call this function back when you click the card
   */
  onClick?: (e: React.MouseEvent<T, MouseEvent>) => void;

  /**
   * Call this function after pressing the card
   */
  onTouchEnd?: (e: TouchEvent<T>) => void;

  /**
   * Call this function after pressing the card -- react native
   */
  onPress?: (e: GestureResponderEvent) => void;
}

/**
 * Dropdown props
 */
export interface DropdownProps<T> extends BaseDropdownProps<T> {
  /**
   * Render the dropdown main
   */
  renderMain?: (props: DropdownMainProps<T>) => ReactNode;

  /**
   * Render the dropdown container
   */
  renderContainer?: (props: DropdownContainerProps<T>) => ReactNode;
}

/**
 * Dropdown children props
 */
export interface DropdownChildrenProps<T> extends Omit<BaseDropdownProps<T>, 'ref'> {
  /**
   * Component unique ID
   */
  id: string;
  children?: ReactNode;
}

export type DropdownMainProps<T> = DropdownChildrenProps<T>;
export type DropdownContainerProps<T> = DropdownChildrenProps<T> &
  Pick<BaseDropdownProps<T>, 'ref'>;

const Dropdown = <T extends HTMLElement>(props: DropdownProps<T>) => {
  const {
    ref,
    disabled,
    loading,
    visible,
    defaultVisible,
    onClick,
    onPress,
    onTouchEnd,
    onVisible,
    onClose,
    renderMain,
    renderContainer,
    ...args
  } = props;

  const id = useId();
  const [status, setStatus] = useState('idle');
  const [dropdownOptions, setDropDownOptions] = useState<DropdownOptions>({visible: false});
  const events = Object.keys(props).filter(key => key.startsWith('on'));
  const childrenProps = {...args, visible: dropdownOptions.visible, id};
  const handleDropdownOptionsChange = useCallback(
    <E,>(options: DropdownOptions<E>) => {
      onVisible?.(options);
      !options.visible && onClose?.(options);
    },
    [onClose, onVisible],
  );

  const handleResponse = <E,>(e: E, callback?: (e: E) => void) => {
    const response = !loading && !disabled;

    if (response) {
      const nextVisible = !dropdownOptions.visible;
      const options = {event: e, visible: nextVisible};

      setDropDownOptions(options);
      handleDropdownOptionsChange(options);
      callback?.(e);
    }
  };

  const handleCallback = (key: string) => {
    const event = {
      onClick: handleDefaultEvent((e: React.MouseEvent<T, MouseEvent>) =>
        handleResponse(e, onClick),
      ),
      onTouchEnd: handleDefaultEvent((e: TouchEvent<T>) => handleResponse(e, onTouchEnd)),
      onPress: handleDefaultEvent((e: GestureResponderEvent) => handleResponse(e, onPress)),
    };

    return event[key as keyof typeof event];
  };

  useEffect(() => {
    const nextVisible = status !== 'idle' ? visible : defaultVisible ?? visible;

    typeof nextVisible === 'boolean' &&
      setDropDownOptions(currentOptions => {
        const change = currentOptions.visible !== nextVisible && status === 'succeeded';

        change && handleDropdownOptionsChange({visible: nextVisible});

        return {visible: nextVisible};
      });

    status === 'idle' && setStatus('succeeded');
  }, [defaultVisible, handleDropdownOptionsChange, status, visible]);

  const main = renderMain?.({...childrenProps});
  const content = <>{main}</>;
  const container = renderContainer?.({
    ...childrenProps,
    ref,
    children: content,
    ...bindEvents(events, handleCallback),
  });

  return <>{container}</>;
};

export default Dropdown;
