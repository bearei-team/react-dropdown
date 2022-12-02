# react-dropdown

Base dropdown components that support React and React native

## Installation

> yarn add @bearei/react-dropdown --save

## Parameters

#### Dropdown options

| Name | Type | Required | Description |
| :-- | --: | --: | :-- |
| visible | `boolean` | ✘ | Dropdown the visible status |
| event | `React.MouseEvent` `React.TouchEvent` `GestureResponderEvent` | ✘ | Event that triggers a dropdown visible state change |

#### Dropdown

| Name | Type | Required | Description |
| :-- | --: | --: | :-- |
| defaultVisible | `boolean` | ✘ | Set the default visible state of the dropdown |
| visible | `boolean` | ✘ | Dropdown the visible status |
| menu | `MenuProps` | ✘ | Dropdown menu configuration options -- [Menu](https://github.com/bear-ei/react-menu) |
| disabled | `boolean` | ✘ | Whether or not to disable the dropdown |
| loading | `boolean` | ✘ | Whether or not the dropdown is loading |
| onVisible | `(options: DropdownOptions) => void` | ✘ | Call this function when the dropdown closes |
| onClose | `(options: DropdownOptions) => void` | ✘ | Call this function when the dropdown closes |
| onClick | `(e: MouseEvent) => void` | ✘ | Call this function back when you click the dropdown |
| onTouchEnd | `(e: TouchEvent) => void` | ✘ | Call this function after pressing the dropdown |
| onPress | `(e: GestureResponderEvent) => void` | ✘ | Call this function after pressing the dropdown -- react native |
| renderMain | `(props: props: DropdownMainProps) => ReactNode` | ✘ | Render the dropdown main |
| renderContainer | `(props: props: DropdownContainerProps) => ReactNode` | ✘ | Render the dropdown container |

## Use

```typescript
import React from 'React';
import ReactDOM from 'react-dom';
import Dropdown from '@bearei/react-dropdown';

const dropdown = (
  <Dropdown<HTMLDivElement>
    renderMain={({...props}) => (
      <div {...pickHTMLAttributes(props)} data-cy="dropdown">
        "dropdown"
      </div>
    )}
    renderContainer={({id, children}) => (
      <div data-cy="container" data-id={id} tabIndex={1}>
        {children}
      </div>
    )}
  />
);

ReactDOM.render(dropdown, container);
```
