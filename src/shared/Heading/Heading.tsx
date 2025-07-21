import type { ReactNode } from 'react';
import React from 'react';

import type { NextPrevProps } from '../NextPrev/NextPrev';
import NextPrev from '../NextPrev/NextPrev';

export interface HeadingProps extends NextPrevProps {
  fontClass?: string;
  desc?: ReactNode;
  title?: ReactNode;
  hasNextPrev?: boolean;
  isCenter?: boolean;
  isMain?: boolean;
  children?: ReactNode;
}

const Heading: React.FC<HeadingProps> = ({
  children,
  // desc = '',
  title = '',
  className = 'font-myFont italic d',
  isCenter = false,
  isMain,
  hasNextPrev,
  ...args
}) => {
  return (
    <div
      className={`nc-Section-Heading relative flex flex-col justify-between sm:flex-row sm:items-end ${className}`}
    >
      <div
        className={
          isCenter ? 'mx-auto mb-2 w-3/4 max-w-3xl text-center' : 'max-w-4xl'
        }
      >
        {title && (
          <p className="text-2xl font-medium uppercase text-primary">{title}</p>
        )}
        <h2
          style={{ lineHeight: '1.2em' }}
          className={`${
            isMain ? 'lineHeight text-lg ' : 'text-2xl'
          }  font-medium`}
          {...args}
        >
          {children}
        </h2>
        {/* {desc && <p className="mt-5 font-myFont italic">{desc}</p>} */}
      </div>
      {hasNextPrev && !isCenter && (
        <div className="4 flex shrink-0 justify-end sm:ml-2 sm:mt-0">
          <NextPrev {...args} />
        </div>
      )}
    </div>
  );
};

export default Heading;
