import { css } from 'lit';

export const rollerStyles = css`
  :host {
    display: inline-flex;
    overflow: hidden;

    /**
        inline-block 和 overflow-hidden 同时存在会使得基线为下边缘. 手动设置 align-bottom 以修正这个问题.
        @see https://stackoverflow.com/questions/22421782/css-overflow-hidden-increases-height-of-container
        @see https://www.w3.org/TR/CSS2/visudet.html#propdef-vertical-align
    */
    vertical-align: bottom;
  }

  .counter-parts {
    display: inline-flex;
    flex: 1 1 auto;
  }

  .roller-part {
    display: inline-flex;
    white-space: nowrap;
  }

  .roller__prefix,
  .roller__suffix {
    flex: none;
  }

  .roller-part .roller-part__wrapper {
    display: inline-block;
    text-align: center;
  }

  .roller-part .roller-part__suffix {
    display: inline-block;
  }
`;

export const rollerDigitStyles = css`
  .roller-part-digit {
    position: relative;
    display: inline-block;
  }

  .placeholder {
    visibility: hidden;
    display: inline-block;
  }

  .roll-list {
    position: absolute;
    left: 0;
    display: inline-flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
  }

  .roll-list.roll-list__up {
    top: 0;
  }

  .roll-list.roll-list__down {
    bottom: 0;
  }

  .roll-list__shadow {
    visibility: hidden;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -10;
    display: inline-flex;
    flex-direction: column;
    white-space: nowrap;
  }

  .roll-item {
    display: inline-block;
    width: 100%;
  }

  .roll-item.roll-item__head {
    position: absolute;
    top: 100%;
  }

  .roll-item.roll-item__tail {
    position: absolute;
    bottom: 100%;
  }
`;
