import type {BaseMenuProps} from '@bearei/react-menu';
import type {HandleEvent} from '@bearei/react-util/lib/event';
import handleEvent from '@bearei/react-util/lib/event';
import type {DetailedHTMLProps, HTMLAttributes, ReactNode, Ref, TouchEvent} from 'react';
import {useId, useState} from 'react';
import type {GestureResponderEvent, ViewProps} from 'react-native';
export interface VisibleOptions<E> {
  visible?: boolean;

  event: E;
}

/**
 * Base dropdown props
 */
export interface BaseDropdownProps<T, E>
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<T>, T> & ViewProps,
    'onClick' | 'onTouchEnd' | 'onPress'
  > {
  ref?: Ref<T>;
  menu?: BaseMenuProps<T>;

  disabled?: boolean;

  loading?: boolean;

  onVisible?: (options: VisibleOptions<E>) => void;

  onClose?: (options: VisibleOptions<E>) => void;

  /**
   * A callback when a dropdown is clicked
   */
  onClick?: (e: DropdownClickEvent<T>) => void;

  /**
   * A callback for pressing a dropdown
   */
  onTouchEnd?: (e: DropdownTouchEvent<T>) => void;

  /**
   * A callback for pressing a dropdown -- react native
   */
  onPress?: (e: DropdownPressEvent) => void;
}

/**
 * Dropdown props
 */
export interface DropdownProps<T, E = React.MouseEvent<T, MouseEvent>>
  extends BaseDropdownProps<T, E> {
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
export interface DropdownChildrenProps<T>
  extends Omit<
    DropdownProps<T>,
    'ref' | 'renderMain' | 'renderContainer' | 'onVisible' | 'onClose'
  > {
  /**
   * The unique ID of the component
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

export type DropdownMainProps<T> = DropdownChildrenProps<T>;
export type DropdownContainerProps<T> = DropdownChildrenProps<T> & Pick<DropdownProps<T>, 'ref'>;

function Dropdown<T, D = React.MouseEvent<T, MouseEvent>>({
  ref,
  disabled,
  loading,
  onClick,
  onPress,
  onTouchEnd,
  renderMain,
  renderContainer,
  onVisible,
  onClose,
  ...props
}: DropdownProps<T, D>) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const childrenProps = {...props, id, handleEvent};

  function handleCallback<E>(callback: (e: E) => void) {
    const response = !disabled && !loading;

    return (e: E) => {
      if (response) {
        const nextVisible = !visible;
        const options = {event: e as E & D, visible: nextVisible};

        setVisible(!nextVisible);
        callback(e);
        onVisible?.(options);
        !nextVisible && onClose?.(options);
      }
    };
  }

  const handleClick = handleCallback((e: DropdownClickEvent<T>) => onClick?.(e));
  const handleTouchEnd = handleCallback((e: DropdownTouchEvent<T>) => onTouchEnd?.(e));
  const handPress = handleCallback((e: DropdownPressEvent) => onPress?.(e));

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
