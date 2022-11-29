import {pickHTMLAttributes} from '@bearei/react-util';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Dropdown from '../../src/components/Dropdown';
import {render} from '../utils/testUtils';

describe('test/components/Dropdown.test.ts', () => {
  test('It should be a render dropdown', async () => {
    const {getByDataCy} = render(
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
      />,
    );

    expect(getByDataCy('container')).toHaveAttribute('tabIndex');
    expect(getByDataCy('dropdown')).toHaveTextContent('dropdown');
  });

  test('It should be a dropdown click', async () => {
    const user = userEvent.setup();
    let result!: boolean | undefined;

    const {getByDataCy} = render(
      <Dropdown<HTMLDivElement>
        onVisible={({visible}) => (result = visible)}
        onClick={() => {}}
        renderMain={({onClick, ...props}) => (
          <div {...pickHTMLAttributes(props)} data-cy="dropdown" onClick={onClick}>
            "dropdown"
          </div>
        )}
      />,
    );

    await user.click(getByDataCy('dropdown'));
    expect(typeof result).toEqual('boolean');
  });

  test('It should be a disabled dropdown', async () => {
    let result!: boolean | undefined;

    const {getByDataCy} = render(
      <Dropdown<HTMLDivElement>
        onVisible={({visible}) => (result = visible)}
        onClick={() => {}}
        disabled
        renderMain={({...props}) => (
          <div {...pickHTMLAttributes(props)} data-cy="dropdown">
            "dropdown"
          </div>
        )}
      />,
    );

    getByDataCy('dropdown');
    expect(result).toEqual(undefined);
  });

  test('It should be the dropdown loading', async () => {
    let result!: boolean | undefined;

    const {getByDataCy} = render(
      <Dropdown<HTMLButtonElement>
        onVisible={({visible}) => (result = visible)}
        onClick={() => {}}
        loading
        renderMain={({...props}) => (
          <div {...pickHTMLAttributes(props)} data-cy="dropdown">
            "dropdown"
          </div>
        )}
      />,
    );

    getByDataCy('dropdown');
    expect(result).toEqual(undefined);
  });
});
