import classNames from 'classnames';
import { Divider } from 'rc-menu';
import * as React from 'react';
import { ConfigContext } from '../config-provider';

export interface MenuDividerProps extends React.HTMLAttributes<HTMLLIElement> {
  className?: string;
  prefixCls?: string;
  style?: React.CSSProperties;
  dashed?: boolean;
}

const MenuDivider = ({
  prefixCls: customizePrefixCls,
  className,
  dashed,
  ...restProps
}: MenuDividerProps) => {
  const { getPrefixCls } = React.useContext(ConfigContext);

  const prefixCls = getPrefixCls('menu', customizePrefixCls);
  const classString = classNames(
    {
      [`${prefixCls}-item-divider-dashed`]: !!dashed,
    },
    className,
  );

  return <Divider className={classString} {...restProps} />;
};

export default MenuDivider;
