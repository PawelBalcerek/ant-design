import classNames from 'classnames';
import debounce from 'lodash/debounce';
import omit from 'rc-util/lib/omit';
import * as React from 'react';
import type { ConfigConsumerProps } from '../config-provider';
import { ConfigConsumer, ConfigContext } from '../config-provider';
import { cloneElement, isValidElement } from '../_util/reactNode';
import { tuple } from '../_util/type';

const SpinSizes = tuple('small', 'default', 'large');
export type SpinSize = typeof SpinSizes[number];
export type SpinIndicator = React.ReactElement<HTMLElement>;

export interface SpinProps {
  prefixCls?: string;
  className?: string;
  spinning?: boolean;
  style?: React.CSSProperties;
  size?: SpinSize;
  tip?: React.ReactNode;
  delay?: number;
  wrapperClassName?: string;
  indicator?: SpinIndicator;
  children?: React.ReactNode;
}

export interface SpinClassProps extends SpinProps {
  spinPrefixCls: string;
}

export interface SpinState {
  spinning?: boolean;
  notCssAnimationSupported?: boolean;
}

// Render indicator
let defaultIndicator: React.ReactNode = null;

function renderIndicator(prefixCls: string, props: SpinClassProps): React.ReactNode {
  const { indicator } = props;
  const dotClassName = `${prefixCls}-dot`;

  // should not be render default indicator when indicator value is null
  if (indicator === null) {
    return null;
  }

  if (isValidElement(indicator)) {
    return cloneElement(indicator, {
      className: classNames(indicator.props.className, dotClassName),
    });
  }

  if (isValidElement(defaultIndicator)) {
    return cloneElement(defaultIndicator as SpinIndicator, {
      className: classNames((defaultIndicator as SpinIndicator).props.className, dotClassName),
    });
  }

  return (
    <span className={classNames(dotClassName, `${prefixCls}-dot-spin`)}>
      <i className={`${prefixCls}-dot-item`} />
      <i className={`${prefixCls}-dot-item`} />
      <i className={`${prefixCls}-dot-item`} />
      <i className={`${prefixCls}-dot-item`} />
    </span>
  );
}

function shouldDelay(spinning?: boolean, delay?: number): boolean {
  return !!spinning && !!delay && !isNaN(Number(delay));
}

class Spin extends React.Component<SpinClassProps, SpinState> {
  static defaultProps = {
    spinning: true,
    size: 'default' as SpinSize,
    wrapperClassName: '',
  };

  originalUpdateSpinning: () => void;

  constructor(props: SpinClassProps) {
    super(props);

    const { spinning, delay } = props;
    const shouldBeDelayed = shouldDelay(spinning, delay);
    this.state = {
      spinning: spinning && !shouldBeDelayed,
    };
    this.originalUpdateSpinning = this.updateSpinning;
    this.debouncifyUpdateSpinning(props);
  }

  componentDidMount() {
    this.updateSpinning();
  }

  componentDidUpdate() {
    this.debouncifyUpdateSpinning();
    this.updateSpinning();
  }

  componentWillUnmount() {
    this.cancelExistingSpin();
  }

  debouncifyUpdateSpinning = (props?: SpinClassProps) => {
    const { delay } = props || this.props;
    if (delay) {
      this.cancelExistingSpin();
      this.updateSpinning = debounce(this.originalUpdateSpinning, delay);
    }
  };

  updateSpinning = () => {
    const { spinning } = this.props;
    const { spinning: currentSpinning } = this.state;
    if (currentSpinning !== spinning) {
      this.setState({ spinning });
    }
  };

  cancelExistingSpin() {
    const { updateSpinning } = this;
    if (updateSpinning && (updateSpinning as any).cancel) {
      (updateSpinning as any).cancel();
    }
  }

  isNestedPattern() {
    return !!(this.props && typeof this.props.children !== 'undefined');
  }

  renderSpin = ({ direction }: ConfigConsumerProps) => {
    const {
      spinPrefixCls: prefixCls,
      className,
      size,
      tip,
      wrapperClassName,
      style,
      ...restProps
    } = this.props;
    const { spinning } = this.state;

    const spinClassName = classNames(
      prefixCls,
      {
        [`${prefixCls}-sm`]: size === 'small',
        [`${prefixCls}-lg`]: size === 'large',
        [`${prefixCls}-spinning`]: spinning,
        [`${prefixCls}-show-text`]: !!tip,
        [`${prefixCls}-rtl`]: direction === 'rtl',
      },
      className,
    );

    // fix https://fb.me/react-unknown-prop
    const divProps = omit(restProps, ['spinning', 'delay', 'indicator', 'prefixCls']);

    const spinElement = (
      <div
        {...divProps}
        style={style}
        className={spinClassName}
        aria-live="polite"
        aria-busy={spinning}
      >
        {renderIndicator(prefixCls, this.props)}
        {tip ? <div className={`${prefixCls}-text`}>{tip}</div> : null}
      </div>
    );
    if (this.isNestedPattern()) {
      const containerClassName = classNames(`${prefixCls}-container`, {
        [`${prefixCls}-blur`]: spinning,
      });
      return (
        <div {...divProps} className={classNames(`${prefixCls}-nested-loading`, wrapperClassName)}>
          {spinning && <div key="loading">{spinElement}</div>}
          <div className={containerClassName} key="container">
            {this.props.children}
          </div>
        </div>
      );
    }
    return spinElement;
  };

  render() {
    return <ConfigConsumer>{this.renderSpin}</ConfigConsumer>;
  }
}

const SpinFC = (props: SpinProps) => {
  const { prefixCls: customizePrefixCls } = props;
  const { getPrefixCls } = React.useContext(ConfigContext);

  const spinPrefixCls = getPrefixCls('spin', customizePrefixCls);

  const spinClassProps: SpinClassProps = {
    ...props,
    spinPrefixCls,
  };
  return <Spin {...spinClassProps} />;
};

SpinFC.setDefaultIndicator = (indicator: React.ReactNode) => {
  defaultIndicator = indicator;
};

if (process.env.NODE_ENV !== 'production') {
  SpinFC.displayName = 'Spin';
}

export default SpinFC;
