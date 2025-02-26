import React from 'react';
import type { RefAttributes } from 'react';
import type { RadioGroupProps } from '..';
import { render, fireEvent } from '../../../tests/utils';
import Radio from '..';

describe('Radio Group', () => {
  function createRadioGroup(props?: RadioGroupProps & RefAttributes<HTMLDivElement>) {
    return (
      <Radio.Group {...props}>
        <Radio value="A">A</Radio>
        <Radio value="B">B</Radio>
        <Radio value="C">C</Radio>
      </Radio.Group>
    );
  }

  function createRadioGroupByOption(props?: RadioGroupProps & RefAttributes<HTMLDivElement>) {
    const options = [
      { label: 'A', value: 'A' },
      { label: 'B', value: 'B' },
      { label: 'C', value: 'C' },
    ];
    return <Radio.Group {...props} options={options} />;
  }

  it('responses hover events', () => {
    const onMouseEnter = jest.fn();
    const onMouseLeave = jest.fn();

    const { container } = render(
      <Radio.Group onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <Radio />
      </Radio.Group>,
    );

    fireEvent.mouseEnter(container.querySelector('div')!);
    expect(onMouseEnter).toHaveBeenCalled();

    fireEvent.mouseLeave(container.querySelector('div')!);
    expect(onMouseLeave).toHaveBeenCalled();
  });

  it('fire change events when value changes', () => {
    const onChange = jest.fn();

    const { container, rerender } = render(
      createRadioGroup({
        onChange,
      }),
    );
    const radios = container.querySelectorAll('input');

    // controlled component
    rerender(
      createRadioGroup({
        onChange,
        value: 'A',
      }),
    );
    fireEvent.click(radios[1]);
    expect(onChange.mock.calls.length).toBe(1);
  });

  it('both of radio and radioGroup will trigger onchange event when they exists', () => {
    const onChange = jest.fn();
    const onChangeRadioGroup = jest.fn();

    const RadioGroup = (
      props: RadioGroupProps & { onChangeRadioGroup: RadioGroupProps['onChange'] },
    ) => (
      <Radio.Group onChange={props.onChangeRadioGroup}>
        <Radio value="A" onChange={props.onChange}>
          A
        </Radio>
        <Radio value="B" onChange={props.onChange}>
          B
        </Radio>
        <Radio value="C" onChange={props.onChange}>
          C
        </Radio>
      </Radio.Group>
    );

    const { container, rerender } = render(
      <RadioGroup onChangeRadioGroup={onChangeRadioGroup} onChange={onChange} />,
    );
    const radios = container.querySelectorAll('input');

    // controlled component
    rerender(<RadioGroup value="A" onChangeRadioGroup={onChangeRadioGroup} onChange={onChange} />);
    fireEvent.click(radios[1]);
    expect(onChange.mock.calls.length).toBe(1);
    expect(onChangeRadioGroup.mock.calls.length).toBe(1);
  });

  it('Trigger onChange when both of radioButton and radioGroup exists', () => {
    const onChange = jest.fn();

    const RadioGroup = (props: RadioGroupProps) => (
      <Radio.Group {...props}>
        <Radio.Button value="A">A</Radio.Button>
        <Radio.Button value="B">B</Radio.Button>
        <Radio.Button value="C">C</Radio.Button>
      </Radio.Group>
    );

    const { container, rerender } = render(<RadioGroup onChange={onChange} />);
    const radios = container.querySelectorAll('input');

    // controlled component
    rerender(<RadioGroup value="A" onChange={onChange} />);
    fireEvent.click(radios[1]);
    expect(onChange.mock.calls.length).toBe(1);
  });

  it('should only trigger once when in group with options', () => {
    const onChange = jest.fn();
    const options = [{ label: 'Bamboo', value: 'Bamboo' }];
    const { container } = render(<Radio.Group options={options} onChange={onChange} />);

    fireEvent.click(container.querySelector('input')!);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("won't fire change events when value not changes", () => {
    const onChange = jest.fn();

    const { container, rerender } = render(
      createRadioGroup({
        onChange,
      }),
    );
    const radios = container.querySelectorAll('input');

    // controlled component
    rerender(
      createRadioGroup({
        onChange,
        value: 'A',
      }),
    );
    fireEvent.click(radios[0]);
    expect(onChange.mock.calls.length).toBe(0);
  });

  it('optional should correct render', () => {
    const { container } = render(createRadioGroupByOption());
    const radios = container.querySelectorAll('input');

    expect(radios.length).toBe(3);
  });

  it('all children should have a name property', () => {
    const GROUP_NAME = 'GROUP_NAME';
    const { container } = render(createRadioGroup({ name: GROUP_NAME }));

    container.querySelectorAll<HTMLInputElement>('input[type="radio"]').forEach(el => {
      expect(el.name).toEqual(GROUP_NAME);
    });
  });

  it('passes prefixCls down to radio', () => {
    const options = [
      { label: 'Apple', value: 'Apple' },
      { label: 'Orange', value: 'Orange', style: { fontSize: 12 } },
    ];
    const { container } = render(<Radio.Group prefixCls="my-radio" options={options} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should forward ref', () => {
    let radioGroupRef: HTMLDivElement;
    const { container } = render(
      createRadioGroupByOption({
        ref(ref: HTMLDivElement) {
          radioGroupRef = ref;
        },
      }),
    );

    expect(radioGroupRef!).toBe(container.querySelector<HTMLDivElement>('.ant-radio-group'));
  });

  it('should support data-* or aria-* props', () => {
    const { container } = render(
      createRadioGroup({
        'data-radio-group-id': 'radio-group-id',
        'aria-label': 'radio-group',
      } as RadioGroupProps),
    );
    expect((container.firstChild as HTMLDivElement)?.getAttribute('data-radio-group-id')).toBe(
      'radio-group-id',
    );
    expect((container.firstChild as HTMLDivElement)?.getAttribute('aria-label')).toBe(
      'radio-group',
    );
  });

  it('Radio type should not be override', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Radio.Group onChange={onChange}>
        <Radio value={1} type="1">
          A
        </Radio>
        <Radio value={2} type="2">
          B
        </Radio>
        <Radio value={3} type="3">
          C
        </Radio>
        <Radio value={4} type="4">
          D
        </Radio>
      </Radio.Group>,
    );
    const radios = container.querySelectorAll('input');
    fireEvent.click(radios[0]);
    expect(onChange).toHaveBeenCalled();
    expect(radios[1].type).toBe('radio');
  });

  describe('value is null or undefined', () => {
    it('use `defaultValue` when `value` is undefined', () => {
      const options = [{ label: 'Bamboo', value: 'bamboo' }];
      const { container } = render(
        <Radio.Group defaultValue="bamboo" value={undefined} options={options} />,
      );
      expect(container.querySelectorAll('.ant-radio-wrapper-checked').length).toBe(1);
    });

    [undefined, null].forEach(newValue => {
      it(`should set value back when value change back to ${newValue}`, () => {
        const options = [{ label: 'Bamboo', value: 'bamboo' }];
        const { container, rerender } = render(<Radio.Group value="bamboo" options={options} />);
        expect(container.querySelectorAll('.ant-radio-wrapper-checked').length).toBe(1);
        rerender(<Radio.Group value={newValue} options={options} />);
        expect(container.querySelectorAll('.ant-radio-wrapper-checked').length).toBe(0);
      });
    });
  });

  it('onBlur & onFocus should work', () => {
    const handleBlur = jest.fn();
    const handleFocus = jest.fn();
    const { container } = render(
      <Radio.Group options={['1', '2', '3']} onBlur={handleBlur} onFocus={handleFocus} />,
    );
    fireEvent.focus(container.firstChild!);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    fireEvent.blur(container.firstChild!);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });
});
