import CloseOutlined from '@ant-design/icons/CloseOutlined';
import LeftOutlined from '@ant-design/icons/LeftOutlined';
import RightOutlined from '@ant-design/icons/RightOutlined';
import RotateLeftOutlined from '@ant-design/icons/RotateLeftOutlined';
import RotateRightOutlined from '@ant-design/icons/RotateRightOutlined';
import ZoomInOutlined from '@ant-design/icons/ZoomInOutlined';
import ZoomOutOutlined from '@ant-design/icons/ZoomOutOutlined';
import RcImage from 'rc-image';
import type { GroupConsumerProps } from 'rc-image/lib/PreviewGroup';
import * as React from 'react';
import { ConfigContext } from '../config-provider';
import { getTransitionName } from '../_util/motion';

export const icons = {
  rotateLeft: <RotateLeftOutlined />,
  rotateRight: <RotateRightOutlined />,
  zoomIn: <ZoomInOutlined />,
  zoomOut: <ZoomOutOutlined />,
  close: <CloseOutlined />,
  left: <LeftOutlined />,
  right: <RightOutlined />,
};

const InternalPreviewGroup = ({
  previewPrefixCls: customizePrefixCls,
  preview,
  ...props
}: GroupConsumerProps) => {
  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('image-preview', customizePrefixCls);
  const rootPrefixCls = getPrefixCls();

  const mergedPreview = React.useMemo(() => {
    if (preview === false) {
      return preview;
    }
    const _preview = typeof preview === 'object' ? preview : {};

    return {
      ..._preview,
      transitionName: getTransitionName(rootPrefixCls, 'zoom', _preview.transitionName),
      maskTransitionName: getTransitionName(rootPrefixCls, 'fade', _preview.maskTransitionName),
    };
  }, [preview]);

  return (
    <RcImage.PreviewGroup
      preview={mergedPreview}
      previewPrefixCls={prefixCls}
      icons={icons}
      {...props}
    />
  );
};

export default InternalPreviewGroup;
