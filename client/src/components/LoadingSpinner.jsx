import React from 'react';
import { css } from '@emotion/react';
import { BeatLoader } from 'react-spinners';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: transparent; /* Ustawienie koloru granic kółka na transparentny */
`;

const LoadingSpinner = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-opacity-50 bg-gray-500">
      <div className=" bg-opacity-100 p-8 rounded-full">
        <BeatLoader css={override} size={15} color={'white'} loading={true} />
      </div>
    </div>
  );
};

export default LoadingSpinner;
