import classNames from 'classnames';
import * as React from 'react';
import type { ConfigConsumerProps } from '../config-provider';
import { ConfigConsumer } from '../config-provider';

export interface CardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  prefixCls?: string;
  className?: string;
  hoverable?: boolean;
  style?: React.CSSProperties;
}

const Grid = ({ prefixCls, className, hoverable = true, ...props }: CardGridProps) => (
  <ConfigConsumer>
    {({ getPrefixCls }: ConfigConsumerProps) => {
      const prefix = getPrefixCls('card', prefixCls);
      const classString = classNames(`${prefix}-grid`, className, {
        [`${prefix}-grid-hoverable`]: hoverable,
      });

      return <div {...props} className={classString} />;
    }}
  </ConfigConsumer>
);

export default Grid;
