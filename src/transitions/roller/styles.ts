import { css } from 'lit';

export const rollerStyles = css`
  .counter-parts {
    display: inline-flex;
    flex: 1 1 auto;
  }

  .roller-part {
    white-space: nowrap;
  }

  .roller__prefix,
  .roller__suffix {
    flex: none;
  }

  .roller-part .roller-part__wrapper {
    display: inline-block;
  }

  .roller-part .roller-part__unit {
    //display: inline-block;
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
