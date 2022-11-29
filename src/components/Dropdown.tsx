import type {BaseMenuProps} from '@bearei/react-menu';
import type {HandleEvent} from '@bearei/react-util/lib/event';
import handleEvent from '@bearei/react-util/lib/event';
import type {DetailedHTMLProps, HTMLAttributes, ReactNode, Ref, TouchEvent} from 'react';
import {useCallback, useEffect, useId, useState} from 'react';
import type {GestureResponderEvent, ViewProps} from 'react-native';

/**
 * Dropdown options
 */
export interface DropdownOptions<E> {
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
export interface BaseDropdownProps<T, E>
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<T>, T> & ViewProps & Pick<DropdownOptions<E>, 'visible'>,
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
  menu?: BaseMenuProps<T, E>;

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
  onVisible?: (options: DropdownOptions<E>) => void;

  /**
   * Call this function when the dropdown closes
   */
  onClose?: (options: DropdownOptions<E>) => void;

  /**
   * Call this function back when you click the dropdown
   */
  onClick?: (e: DropdownClickEvent<T>) => void;

  /**
   * Call this function after pressing the dropdown
   */
  onTouchEnd?: (e: DropdownTouchEvent<T>) => void;

  /**
   * Call this function after pressing the dropdown -- react native
   */
  onPress?: (e: DropdownPressEvent) => void;
}

/**
 * Dropdown props
 */
export interface DropdownProps<T, E> extends BaseDropdownProps<T, E> {
  /**
   * Render the dropdown main
   */
  renderMain?: (props: DropdownMainProps<T, E>) => ReactNode;

  /**
   * Render the dropdown container
   */
  renderContainer?: (props: DropdownContainerProps<T, E>) => ReactNode;
}

/**
 * Dropdown children props
 */
export interface DropdownChildrenProps<T, E>
  extends Omit<BaseDropdownProps<T, E>, 'ref' | 'onVisible' | 'onClose'> {
  /**
   * Component Unique ID
   */
  id: string;
  children?: ReactNode;

  /**
   * Used to handle some common default events
   */
  handleEvent: HandleEvent;
}

export type DropdownClickEvent<T> = React.MouseEvent<T, MouseEvent>;
export type DropdownTouchEvent<T> = TouchEvent<T>;
export type DropdownPressEvent = GestureResponderEvent;

export type DropdownMainProps<T, E> = DropdownChildrenProps<T, E>;
export type DropdownContainerProps<T, E> = DropdownChildrenProps<T, E> &
  Pick<BaseDropdownProps<T, E>, 'ref'>;

function Dropdown<T, E = React.MouseEvent<T, MouseEvent>>({
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
  ...props
}: DropdownProps<T, E>) {
  const id = useId();
  const [status, setStatus] = useState('idle');
  const [dropdownOptions, setDropDownOptions] = useState<DropdownOptions<E>>({visible: false});
  const childrenProps = {...props, visible: dropdownOptions.visible, id, handleEvent};
  const handleDropdownOptionsChange = useCallback(
    (options: DropdownOptions<E>) => {
      onVisible?.(options);
      !options.visible && onClose?.(options);
    },
    [onClose, onVisible],
  );

  function handleCallback<C>(callback: (e: C) => void) {
    const response = !disabled && !loading;

    return (e: C) => {
      if (response) {
        const nextVisible = !dropdownOptions.visible;
        const options = {event: e as C & E, visible: nextVisible};

        setDropDownOptions(options);
        handleDropdownOptionsChange(options);
        callback(e);
      }
    };
  }

  const handleClick = handleCallback((e: DropdownClickEvent<T>) => onClick?.(e));
  const handleTouchEnd = handleCallback((e: DropdownTouchEvent<T>) => onTouchEnd?.(e));
  const handPress = handleCallback((e: DropdownPressEvent) => onPress?.(e));

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

  const main = renderMain?.({
    ...childrenProps,
    ...(onClick ? {onClick: handleEvent(handleClick)} : undefined),
    ...(onTouchEnd ? {onTouchEnd: handleEvent(handleTouchEnd)} : undefined),
    ...(onPress ? {onPress: handleEvent(handPress)} : undefined),
  });

  const container = renderContainer?.({...childrenProps, ref, children: main}) ?? main;

  return <>{container}</>;
}

export default Dropdown;
