import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined';
import classNames from 'classnames';
import * as React from 'react';
import type { ColProps } from '../grid/col';
import Col from '../grid/col';
import { useLocaleReceiver } from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale/default';
import type { TooltipProps } from '../tooltip';
import Tooltip from '../tooltip';
import type { FormContextProps } from './context';
import { FormContext } from './context';
import type { RequiredMark } from './Form';
import type { FormLabelAlign } from './interface';

export type WrapperTooltipProps = TooltipProps & {
  icon?: React.ReactElement;
};

export type LabelTooltipType = WrapperTooltipProps | React.ReactNode;

function toTooltipProps(tooltip: LabelTooltipType): WrapperTooltipProps | null {
  if (!tooltip) {
    return null;
  }

  if (typeof tooltip === 'object' && !React.isValidElement(tooltip)) {
    return tooltip as WrapperTooltipProps;
  }

  return {
    title: tooltip,
  };
}

export interface FormItemLabelProps {
  colon?: boolean;
  htmlFor?: string;
  label?: React.ReactNode;
  labelAlign?: FormLabelAlign;
  labelCol?: ColProps;
  requiredMark?: RequiredMark;
  tooltip?: LabelTooltipType;
}

const FormItemLabel = ({
  prefixCls,
  label,
  htmlFor,
  labelCol,
  labelAlign,
  colon,
  required,
  requiredMark,
  tooltip,
}: FormItemLabelProps & { required?: boolean; prefixCls: string }) => {
  const [formLocale] = useLocaleReceiver('Form');

  if (!label) return null;

  return (
    <FormContext.Consumer key="label">
      {({
        vertical,
        labelAlign: contextLabelAlign,
        labelCol: contextLabelCol,
        labelWrap,
        colon: contextColon,
      }: FormContextProps) => {
        const mergedLabelCol: ColProps = labelCol || contextLabelCol || {};

        const mergedLabelAlign: FormLabelAlign | undefined = labelAlign || contextLabelAlign;

        const labelClsBasic = `${prefixCls}-item-label`;
        const labelColClassName = classNames(
          labelClsBasic,
          mergedLabelAlign === 'left' && `${labelClsBasic}-left`,
          mergedLabelCol.className,
          {
            [`${labelClsBasic}-wrap`]: !!labelWrap,
          },
        );

        let labelChildren = label;
        // Keep label is original where there should have no colon
        const computedColon = colon === true || (contextColon !== false && colon !== false);
        const haveColon = computedColon && !vertical;
        // Remove duplicated user input colon
        if (haveColon && typeof label === 'string' && (label as string).trim() !== '') {
          labelChildren = (label as string).replace(/[:|：]\s*$/, '');
        }

        // Tooltip
        const tooltipProps = toTooltipProps(tooltip);
        if (tooltipProps) {
          const { icon = <QuestionCircleOutlined />, ...restTooltipProps } = tooltipProps;
          const tooltipNode = (
            <Tooltip {...restTooltipProps}>
              {React.cloneElement(icon, { className: `${prefixCls}-item-tooltip`, title: '' })}
            </Tooltip>
          );

          labelChildren = (
            <>
              {labelChildren}
              {tooltipNode}
            </>
          );
        }

        // Add required mark if optional
        if (requiredMark === 'optional' && !required) {
          labelChildren = (
            <>
              {labelChildren}
              <span className={`${prefixCls}-item-optional`} title="">
                {formLocale?.optional || defaultLocale.Form?.optional}
              </span>
            </>
          );
        }

        const labelClassName = classNames({
          [`${prefixCls}-item-required`]: required,
          [`${prefixCls}-item-required-mark-optional`]: requiredMark === 'optional',
          [`${prefixCls}-item-no-colon`]: !computedColon,
        });

        return (
          <Col {...mergedLabelCol} className={labelColClassName}>
            <label
              htmlFor={htmlFor}
              className={labelClassName}
              title={typeof label === 'string' ? label : ''}
            >
              {labelChildren}
            </label>
          </Col>
        );
      }}
    </FormContext.Consumer>
  );
};

export default FormItemLabel;
