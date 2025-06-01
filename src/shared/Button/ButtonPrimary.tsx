import React from 'react';

import type { ButtonProps } from '@/shared/Button/Button';
import Button from '@/shared/Button/Button';

export interface ButtonPrimaryProps extends ButtonProps {
  href?: any;
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  className = '',
  ...args
}) => {
  return (
    <Button
      className={`rounded-full bg-primary lg:text-xl font-myFontLight2 hover:bg-primary/80 disabled:bg-primary/70 w-min-[20%] ${className}`}
      {...args}
    />
  );
};

export default ButtonPrimary;
