import { pickHTMLAttributes } from '@bearei/react-util';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Dropdown from '../../src/components/Dropdown';
import { render } from '../utils/test_utils';

describe('test/components/Dropdown.test.ts', () => {
  test('It should be a render dropdown', async () => {
    const { getByDataCy } = render(
      <Dropdown
        renderMain={({ ...props }) => (
          <div {...pickHTMLAttributes(props)} data-cy="dropdown">
            "dropdown"
          </div>
        )}
        renderContainer={({ id, children }) => (
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

    const { getByDataCy } = render(
      <Dropdown
        onVisible={({ visible }) => (result = visible)}
        onClick={() => {}}
        renderMain={({ onClick }) => (
          <div data-cy="dropdown" onClick={onClick}>
            "dropdown"
          </div>
        )}
        renderContainer={({ children, ...props }) => (
          <div {...pickHTMLAttributes(props)} data-cy="container">
            {children}
          </div>
        )}
      />,
    );

    await user.click(getByDataCy('dropdown'));
    expect(typeof result).toEqual('boolean');
  });

  test('It should be a disabled dropdown', async () => {
    const user = userEvent.setup();
    let result!: boolean | undefined;

    const { getByDataCy } = render(
      <Dropdown
        onVisible={({ visible }) => (result = visible)}
        onClick={() => {}}
        disabled
        renderMain={({ onClick }) => (
          <div data-cy="dropdown" onClick={onClick}>
            "dropdown"
          </div>
        )}
        renderContainer={({ children, ...props }) => (
          <div {...pickHTMLAttributes(props)} data-cy="container">
            {children}
          </div>
        )}
      />,
    );

    await user.click(getByDataCy('dropdown'));
    expect(result).toEqual(undefined);
  });

  test('It should be the dropdown loading', async () => {
    const user = userEvent.setup();
    let result!: boolean | undefined;

    const { getByDataCy } = render(
      <Dropdown
        onVisible={({ visible }) => (result = visible)}
        defaultVisible={true}
        onClick={() => {}}
        loading
        renderMain={({ onClick }) => (
          <div data-cy="dropdown" onClick={onClick}>
            "dropdown"
          </div>
        )}
        renderContainer={({ children, ...props }) => (
          <div {...pickHTMLAttributes(props)} data-cy="container">
            {children}
          </div>
        )}
      />,
    );

    await user.click(getByDataCy('dropdown'));
    expect(result).toEqual(undefined);
  });
});
