import React from 'react';

interface IProps {
  color: string;
}

function Cross({ color }: IProps) {
  return (
    <svg
      viewBox="0 0 12.061 12.063"
      xmlns="http://www.w3.org/2000/svg"
      width="0.8rem"
      height="0.8rem"
    >
      <g
        transform="translate(-1476.2 -734.99)"
        fill="none"
        stroke={color}
        strokeWidth="1.2"
        data-name="cross"
      >
        <path
          transform="translate(1487.7 735.52) rotate(45)"
          d="m0 0v15.555"
          data-name="Path 687"
        />
        <path
          transform="translate(1487.7 746.52) rotate(135)"
          d="m0 0v15.555"
          data-name="Path 688"
        />
      </g>
    </svg>
  );
}

export default Cross;
