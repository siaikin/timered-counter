import { css } from 'lit';

export const timeredCounterStyles = css`
  :host {
    display: inline-flex;
    white-space: nowrap;
  }

  //.timered-counter {
  //  position: relative;
  //  display: inline-flex;
  //  overflow: hidden;
  //
  //  /**
  //      inline-block 和 overflow-hidden 同时存在会使得基线为下边缘. 手动设置 align-bottom 以修正这个问题.
  //      @see https://stackoverflow.com/questions/22421782/css-overflow-hidden-increases-height-of-container
  //      @see https://www.w3.org/TR/CSS2/visudet.html#propdef-vertical-align
  //  */
  //  vertical-align: bottom;
  //}

  .timered-counter.debug {
    overflow: visible;
  }

  //.timered-counter-datetime-duration .duration-unit {
  //  font-size: 0.4em;
  //  line-height: 1;
  //}
`;
