import type { BaseMenuProps } from '@bearei/react-menu';
import {
  bindEvents,
  handleDefaultEvent,
} from '@bearei/react-util/lib/commonjs/event';
import {
  DetailedHTMLProps,
  HTMLAttributes,
  MouseEvent,
  ReactNode,
  Ref,
  TouchEvent,
  useCallback,
  useEffect,
  useId,
  useState,
} from 'react';
import type { GestureResponderEvent, ViewProps } from 'react-native';

/**
 * Dropdown options
 */
export interface DropdownOptions<T, E = unknown>
  extends Pick<BaseDropdownProps<T>, 'visible'> {
  /**
   * Triggers an event when a dropdown option changes
   */
  event?: E;
}

/**
 * Base dropdown props
 */
export interface BaseDropdownProps<T>
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<T>, T> & ViewProps,
    'onClick' | 'onTouchEnd' | 'onPress'
  > {
  /**
   * Custom ref
   */
  ref?: Ref<T>;

  /**
   * Dropdown visible state
   */
  visible?: boolean;

  /**
   * The default visible state for the dropdown
   */
  defaultVisible?: boolean;

  /**
   * Dropdown content
   */
  content?: ReactNode;

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
   * This function is called when the dropdown visible state changes
   */
  onVisible?: <E>(options: DropdownOptions<T, E>) => void;

  /**
   * This function is called when the dropdown is closed
   */
  onClose?: <E>(options: DropdownOptions<T, E>) => void;

  /**
   * This function is called when dropdown is clicked
   */
  onClick?: (e: MouseEvent<T>) => void;

  /**
   * This function is called when the dropdown is pressed
   */
  onTouchEnd?: (e: TouchEvent<T>) => void;

  /**
   * This function is called when the dropdown is pressed -- react native
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
  renderMain: (props: DropdownMainProps<T>) => ReactNode;

  /**
   * Render the dropdown container
   */
  renderContainer: (props: DropdownContainerProps<T>) => ReactNode;
}

/**
 * Dropdown children props
 */
export interface DropdownChildrenProps<T>
  extends Omit<BaseDropdownProps<T>, 'ref'> {
  /**
   * Component unique ID
   */
  id: string;
  children?: ReactNode;
}

export type DropdownMainProps<T> = DropdownChildrenProps<T> &
  Pick<BaseDropdownProps<T>, 'ref'>;

export type DropdownContainerProps<T> = DropdownChildrenProps<T>;
export type EventType = 'onClick' | 'onPress' | 'onTouchEnd';

const Dropdown = <T extends HTMLElement = HTMLElement>(
  props: DropdownProps<T>,
) => {
  const {
    ref,
    loading,
    visible,
    disabled,
    defaultVisible,
    onClick,
    onPress,
    onClose,
    onVisible,
    onTouchEnd,
    renderMain,
    renderContainer,
    ...args
  } = props;

  const id = useId();
  const [status, setStatus] = useState('idle');
  const [dropdownOptions, setDropDownOptions] = useState<DropdownOptions<T>>({
    visible: false,
  });

  const bindEvenNames = ['onClick', 'onPress', 'onTouchEnd'];
  const eventNames = Object.keys(props).filter(key =>
    bindEvenNames.includes(key),
  ) as EventType[];

  const childrenProps = { ...args, visible: dropdownOptions.visible, id };
  const handleDropdownOptionsChange = useCallback(
    <E,>(options: DropdownOptions<T, E>) => {
      onVisible?.(options);
      !options.visible && onClose?.(options);
    },
    [onClose, onVisible],
  );

  const handleResponse = <E,>(e: E, callback?: (e: E) => void) => {
    const isResponse = !loading && !disabled;

    if (isResponse) {
      const nextVisible = !dropdownOptions.visible;
      const options = { event: e, visible: nextVisible };

      setDropDownOptions(options);
      handleDropdownOptionsChange(options);
      callback?.(e);
    }
  };

  const handleCallback = (event: EventType) => {
    const eventFunctions = {
      onClick: handleDefaultEvent((e: MouseEvent<T>) =>
        handleResponse(e, onClick),
      ),
      onTouchEnd: handleDefaultEvent((e: TouchEvent<T>) =>
        handleResponse(e, onTouchEnd),
      ),
      onPress: handleDefaultEvent((e: GestureResponderEvent) =>
        handleResponse(e, onPress),
      ),
    };

    return eventFunctions[event];
  };

  useEffect(() => {
    const nextVisible = status !== 'idle' ? visible : defaultVisible ?? visible;

    typeof nextVisible === 'boolean' &&
      setDropDownOptions(currentOptions => {
        const isUpdate =
          currentOptions.visible !== nextVisible && status === 'succeeded';

        isUpdate && handleDropdownOptionsChange({ visible: nextVisible });

        return { visible: nextVisible };
      });

    status === 'idle' && setStatus('succeeded');
  }, [defaultVisible, handleDropdownOptionsChange, status, visible]);

  const main = renderMain({
    ...childrenProps,
    ref,
    ...(bindEvents(eventNames, handleCallback) as {
      onClick?: (e: MouseEvent<T>) => void;
      onTouchEnd?: (e: TouchEvent<T>) => void;
      onPress?: (e: GestureResponderEvent) => void;
    }),
  });

  const container = renderContainer({
    ...childrenProps,
    children: main,
  });

  return <>{container}</>;
};

export default Dropdown;
