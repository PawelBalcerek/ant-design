import React from 'react';
import type { DrawerProps } from '..';
import Drawer from '..';
import { act, fireEvent, render } from '../../../tests/utils';

const DrawerTest = (props: DrawerProps) => (
  <Drawer open getContainer={false} {...props}>
    Here is content of Drawer
  </Drawer>
);

describe('Drawer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('render correctly', () => {
    const { container, asFragment, rerender } = render(<DrawerTest />);
    expect(container.querySelector('.ant-drawer-body')).toBeTruthy();

    rerender(<DrawerTest open={false} />);

    expect(container.querySelector('.ant-drawer-body')?.textContent).toEqual(
      'Here is content of Drawer',
    );

    expect(asFragment().firstChild).toMatchSnapshot();
  });

  it('mask trigger onClose', () => {
    const onClose = jest.fn();
    const { container } = render(<DrawerTest onClose={onClose} />);

    fireEvent.click(container.querySelector('.ant-drawer-mask')!);
    expect(onClose).toHaveBeenCalled();
  });

  it('close button trigger onClose', () => {
    const onClose = jest.fn();
    const { container } = render(<DrawerTest onClose={onClose} />);

    fireEvent.click(container.querySelector('.ant-drawer-close')!);
    expect(onClose).toHaveBeenCalled();
  });

  it('maskClosable no trigger onClose', () => {
    const onClose = jest.fn();
    const { container } = render(<DrawerTest onClose={onClose} maskClosable={false} />);

    fireEvent.click(container.querySelector('.ant-drawer-mask')!);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('dom should be removed after close when destroyOnClose is true', () => {
    const { container, rerender } = render(<DrawerTest destroyOnClose />);
    expect(container.querySelector('.ant-drawer')).toBeTruthy();

    rerender(<DrawerTest destroyOnClose open={false} />);
    act(() => {
      jest.runAllTimers();
    });

    expect(container.querySelector('.ant-drawer')).toBeFalsy();
  });

  it('dom should be existed after close when destroyOnClose is false', () => {
    const { container, rerender } = render(<DrawerTest />);
    expect(container.querySelector('.ant-drawer')).toBeTruthy();

    rerender(<DrawerTest open={false} />);
    act(() => {
      jest.runAllTimers();
    });
    fireEvent.animationEnd(container.querySelector('.ant-drawer-content')!);

    expect(container.querySelector('.ant-drawer')).toBeTruthy();
  });

  it('dom should be existed after close twice when getContainer is false', () => {
    const { container, rerender } = render(<DrawerTest open getContainer={false} />);
    expect(container.querySelector('.ant-drawer-content')).toBeTruthy();

    // Hide
    rerender(<DrawerTest open={false} getContainer={false} />);
    act(() => {
      jest.runAllTimers();
    });
    fireEvent.animationEnd(container.querySelector('.ant-drawer-content-wrapper')!);
    expect(container.querySelector('.ant-drawer-content-wrapper-hidden')).toBeTruthy();

    // Show
    rerender(<DrawerTest open getContainer={false} />);
    expect(container.querySelector('.ant-drawer-content-wrapper')).toBeTruthy();
    expect(container.querySelector('.ant-drawer-content-wrapper-hidden')).toBeFalsy();

    // Hide
    rerender(<DrawerTest open={false} getContainer={false} />);
    act(() => {
      jest.runAllTimers();
    });
    fireEvent.animationEnd(container.querySelector('.ant-drawer-content-wrapper')!);
    expect(container.querySelector('.ant-drawer-content-wrapper-hidden')).toBeTruthy();
  });

  it('test afterVisibleChange', async () => {
    const afterVisibleChange = jest.fn();
    const { container, rerender } = render(
      <DrawerTest open afterVisibleChange={afterVisibleChange} />,
    );
    rerender(<DrawerTest open={false} afterVisibleChange={afterVisibleChange} />);

    act(() => {
      jest.runAllTimers();
    });
    fireEvent.animationEnd(container.querySelector('.ant-drawer-content-wrapper')!);

    expect(afterVisibleChange).toHaveBeenCalledTimes(1);
  });

  it('should support children ref', () => {
    const fn = jest.fn();

    const refCallback = (ref: HTMLDivElement | null) => {
      expect(typeof ref).toBe('object');
      fn();
    };

    const RefDemo = () => {
      const ref = React.useRef<HTMLDivElement>(null);
      const [open, setOpen] = React.useState(false);

      React.useEffect(() => {
        if (open) {
          refCallback(ref.current!);
        }
      }, [open]);

      return (
        <>
          <a onClick={() => setOpen(true)}>open</a>
          <Drawer open={open}>
            <div ref={ref} />
          </Drawer>
        </>
      );
    };
    const { container } = render(<RefDemo />);
    fireEvent.click(container.querySelector('a')!);
    expect(fn).toHaveBeenCalled();
  });
});
