import { presetPrimaryColors } from '@ant-design/colors';
import * as React from 'react';
import type { DirectionType } from '../config-provider';
import type { ProgressGradient, ProgressProps, StringGradients } from './progress';
import { getSuccessPercent, validProgress } from './utils';

interface LineProps extends ProgressProps {
  prefixCls: string;
  direction?: DirectionType;
  children: React.ReactNode;
  strokeColor?: string | ProgressGradient;
}

/**
 * @example
 *   {
 *     "0%": "#afc163",
 *     "75%": "#009900",
 *     "50%": "green", // ====> '#afc163 0%, #66FF00 25%, #00CC00 50%, #009900 75%, #ffffff 100%'
 *     "25%": "#66FF00",
 *     "100%": "#ffffff"
 *   }
 */
export const sortGradient = (gradients: StringGradients) => {
  let tempArr: any[] = [];
  Object.keys(gradients).forEach(key => {
    const formattedKey = parseFloat(key.replace(/%/g, ''));
    if (!isNaN(formattedKey)) {
      tempArr.push({
        key: formattedKey,
        value: gradients[key],
      });
    }
  });
  tempArr = tempArr.sort((a, b) => a.key - b.key);
  return tempArr.map(({ key, value }) => `${value} ${key}%`).join(', ');
};

/**
 * Then this man came to realize the truth: Besides six pence, there is the moon. Besides bread and
 * butter, there is the bug. And... Besides women, there is the code.
 *
 * @example
 *   {
 *     "0%": "#afc163",
 *     "25%": "#66FF00",
 *     "50%": "#00CC00", // ====>  linear-gradient(to right, #afc163 0%, #66FF00 25%,
 *     "75%": "#009900", //        #00CC00 50%, #009900 75%, #ffffff 100%)
 *     "100%": "#ffffff"
 *   }
 */
export const handleGradient = (strokeColor: ProgressGradient, directionConfig?: DirectionType) => {
  const {
    from = presetPrimaryColors.blue,
    to = presetPrimaryColors.blue,
    direction = directionConfig === 'rtl' ? 'to left' : 'to right',
    ...rest
  } = strokeColor;
  if (Object.keys(rest).length !== 0) {
    const sortedGradients = sortGradient(rest as StringGradients);
    return { backgroundImage: `linear-gradient(${direction}, ${sortedGradients})` };
  }
  return { backgroundImage: `linear-gradient(${direction}, ${from}, ${to})` };
};

const Line = (props: LineProps) => {
  const {
    prefixCls,
    direction: directionConfig,
    percent,
    strokeWidth,
    size,
    strokeColor,
    strokeLinecap = 'round',
    children,
    trailColor = null,
    success,
  } = props;

  const backgroundProps =
    strokeColor && typeof strokeColor !== 'string'
      ? handleGradient(strokeColor, directionConfig)
      : {
          background: strokeColor,
        };

  const borderRadius = strokeLinecap === 'square' || strokeLinecap === 'butt' ? 0 : undefined;
  const trailStyle = {
    backgroundColor: trailColor || undefined,
    borderRadius,
  };

  const percentStyle = {
    width: `${validProgress(percent)}%`,
    height: strokeWidth || (size === 'small' ? 6 : 8),
    borderRadius,
    ...backgroundProps,
  };

  const successPercent = getSuccessPercent(props);

  const successPercentStyle = {
    width: `${validProgress(successPercent)}%`,
    height: strokeWidth || (size === 'small' ? 6 : 8),
    borderRadius,
    backgroundColor: success?.strokeColor,
  };

  const successSegment =
    successPercent !== undefined ? (
      <div className={`${prefixCls}-success-bg`} style={successPercentStyle} />
    ) : null;

  return (
    <>
      <div className={`${prefixCls}-outer`}>
        <div className={`${prefixCls}-inner`} style={trailStyle}>
          <div className={`${prefixCls}-bg`} style={percentStyle} />
          {successSegment}
        </div>
      </div>
      {children}
    </>
  );
};

export default Line;
