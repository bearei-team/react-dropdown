# react-dropdown

Base dropdown components that support React and React native

## Installation

> yarn add @bearei/react-dropdown --save

## Parameters

#### Dropdown options

| Name | Type | Required | Description |
| :-- | --: | --: | :-- |
| visible | `boolean` | ✘ | Dropdown visible state |
| event | `React.MouseEvent` `React.TouchEvent` `GestureResponderEvent` | ✘ | Triggers an event when a dropdown option changes |

#### Dropdown

| Name | Type | Required | Description |
| :-- | --: | --: | :-- |
| visible | `boolean` | ✘ | Dropdown visible state |
| defaultVisible | `boolean` | ✘ | The default visible state for the dropdown |
| menu | `MenuProps` | ✘ | Dropdown menu menu props -- [Menu](https://github.com/bear-ei/react-menu) |
| disabled | `boolean` | ✘ | Whether or not to disable the dropdown |
| loading | `boolean` | ✘ | Whether or not the dropdown is loading |
| onVisible | `(options: DropdownOptions) => void` | ✘ | This function is called when the dropdown visible state changes |
| onClose | `(options: DropdownOptions) => void` | ✘ | This function is called when the dropdown is closed |
| onClick | `(e: React.MouseEvent) => void` | ✘ | This function is called when dropdown is clicked |
| onTouchEnd | `(e: React.TouchEvent) => void` | ✘ | This function is called when the dropdown is pressed |
| onPress | `(e: GestureResponderEvent) => void` | ✘ | This function is called when the dropdown is pressed -- react native |
| renderMain | `(props: DropdownMainProps) => ReactNode` | ✘ | Render the dropdown main |
| renderContainer | `(props: props: DropdownContainerProps) => ReactNode` | ✘ | Render the dropdown container |

## Use

```typescript
import React from 'React';
import ReactDOM from 'react-dom';
import Dropdown from '@bearei/react-dropdown';

const dropdown = (
  <Dropdown
    renderMain={({...props}) => <div {...props}>"dropdown"</div>}
    renderContainer={({id, children}) => (
      <div data-id={id} tabIndex={1}>
        {children}
      </div>
    )}
  />
);

ReactDOM.render(dropdown, container);
```
