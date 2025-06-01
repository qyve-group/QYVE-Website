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
      className={`font-myFontLight2 w-min-[20%] rounded-full bg-primary hover:bg-primary/80 disabled:bg-primary/70 lg:text-xl ${className}`}
      {...args}
    />
  );
};

export default ButtonPrimary;
