---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

最简单的用法。

## en-US

The most basic usage.

```tsx
import { BackTop } from 'antd';
import React from 'react';

const App = () => (
  <>
    <BackTop />
    Scroll down to see the bottom-right
    <strong className="site-back-top-basic"> gray </strong>
    button.
  </>
);

export default App;
```

```css
.site-back-top-basic {
  color: rgba(64, 64, 64, 0.6);
}
```

<style>
[data-theme="dark"] .site-back-top-basic {
  color: rgba(255,255,255,.45);
}
</style>
