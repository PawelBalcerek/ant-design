import React, { memo, useContext } from 'react';
import { fireEvent, pureRender } from '../../../tests/utils';
import LocaleProvider from '..';
import LocaleContext from '../context';

let innerCount = 0;
let outerCount = 0;

const handleClick = () => {
  outerCount++;
};

// we use'memo' here in order to only render inner component while context changed.
const CacheInner = memo(() => {
  innerCount++;
  // subscribe locale context
  useContext(LocaleContext);
  return null;
});

const CacheOuter = memo(() => (
  <>
    <button type="button" onClick={handleClick} id="parent_btn">
      Click
    </button>
    <LocaleProvider locale={{ locale: 'locale' }}>
      <CacheInner />
    </LocaleProvider>
  </>
));
it("Rendering on LocaleProvider won't trigger rendering on child component.", () => {
  const { container } = pureRender(<CacheOuter />);
  expect(outerCount).toBe(0);
  expect(innerCount).toBe(1);
  fireEvent.click(container.querySelector('#parent_btn')!);
  expect(outerCount).toBe(1);
  expect(innerCount).toBe(1);
});
