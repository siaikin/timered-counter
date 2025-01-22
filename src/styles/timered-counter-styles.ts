import { css } from 'lit';

export const timeredCounterstyles = css`
  .timered-counter {
    position: relative;
    display: inline-flex;
    overflow: hidden;

    /**
        inline-block 和 overflow-hidden 同时存在会使得基线为下边缘. 手动设置 align-bottom 以修正这个问题.
        @see https://stackoverflow.com/questions/22421782/css-overflow-hidden-increases-height-of-container
        @see https://www.w3.org/TR/CSS2/visudet.html#propdef-vertical-align
    */
    vertical-align: bottom;
  }

  .timered-counter.debug {
    overflow: visible;
  }

  .timered-counter .counter__prefix,
  .timered-counter .counter__suffix {
    flex: none;
  }

  .counter-parts {
    display: inline-flex;
    flex: 1 1 auto;
  }

  //.timered-counter-datetime-duration .duration-unit {
  //  font-size: 0.4em;
  //  line-height: 1;
  //}
`;
