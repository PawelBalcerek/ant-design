---
order: 99
title:
  zh-CN: 前缀
  en-US: prefixCls
debug: true
---

## zh-CN

修改组件和图标前缀。

## en-US

Config component and icon prefixCls.

```tsx
import { SmileOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Select } from 'antd';
import React, { useState } from 'react';

// Ant Design site use `es` module for view
// but do not replace related lib `lib` with `es`
// which do not show correct in site.
// We may need do convert in site also.
const App = () => {
  const [prefixCls, setPrefixCls] = useState('light');

  return (
    <div>
      <Button style={{ marginBottom: '12px' }} type="primary" onClick={() => setPrefixCls('dark')}>
        toggle prefixCls
      </Button>
      <div>
        <ConfigProvider prefixCls={prefixCls} iconPrefixCls="bamboo">
          <SmileOutlined />
          <Select />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default App;
```
