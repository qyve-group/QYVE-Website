import type { FC } from 'react';
import React, { useState } from 'react';
import { FaRegCircleUser } from 'react-icons/fa6';
import { useSelector } from 'react-redux';

import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import ButtonSecondary from '@/shared/Button/ButtonSecondary';
// import Checkbox from '@/shared/Checkbox/Checkbox';
import FormItem from '@/shared/FormItem';
import Input from '@/shared/Input/Input';
import type { RootState } from '@/store/store';

type ContactInfoData = {
  phone: string;
  email: string;
};

interface Props {
  isActive: boolean;
  onOpenActive: () => void;
  onCloseActive: () => void;
  onDataChange: (data: ContactInfoData) => void;
}

const ContactInfo: FC<Props> = ({
  isActive,
  onCloseActive,
  onOpenActive,
  onDataChange,
}) => {
  const user = useSelector((state: RootState) => state.auth.user?.name);
  const userEmail = useSelector((state: RootState) => state.auth.user?.email);

  const [email, setEmail] = useState<string>(userEmail || '');
  const [phone, setPhone] = useState('');
  // const [emailInput, setEmailInput] = useState(userEmail || '');
  // const [phoneInput, setPhoneInput] = useState('');
  const [savedEmail, setSavedEmail] = useState(userEmail);
  const [savedPhone, setSavedPhone] = useState('-');
  const [hasSubmit, setHasSubmit] = useState(false);

  const handleSubmit = () => {
    setHasSubmit(true);

    if (hasSubmit) {
      if (phone === '' || email === '') {
        return;
      }
    }

    onDataChange({ phone, email });
  };

  const handleSave = () => {
    setSavedEmail(email);
    setSavedPhone(phone);
  };

  return (
    <div className="z-0 overflow-hidden rounded-xl border border-neutral-300">
      <div className="flex flex-col items-start p-6 sm:flex-row ">
        <span className="hidden sm:block">
          <FaRegCircleUser className="text-3xl text-primary" />
        </span>
        <div className="flex w-full items-center justify-between">
          <div className="sm:ml-8">
            <div className="uppercase tracking-tight">CONTACT INFORMATION</div>
            <div className="mt-1 text-sm font-semibold">
              <span className="">{user}</span>
              <span className="ml-3 tracking-tighter">Email: {savedEmail}</span>
              <span className="ml-3 tracking-tighter">
                Phone number: {savedPhone}
              </span>
            </div>
          </div>
          <ButtonSecondary
            sizeClass="py-2 px-4"
            className="border-2 border-primary text-primary"
            onClick={onOpenActive}
          >
            Edit
          </ButtonSecondary>
        </div>
      </div>
      <div
        className={`space-y-4 border-t border-neutral-300 px-6 py-7 sm:space-y-6 ${
          isActive ? 'block' : 'hidden'
        }`}
      >
        <h3 className="text-lg font-semibold">Contact infomation</h3>
        <div className="max-w-lg">
          <FormItem label="Your phone number">
            <Input
              rounded="rounded-lg"
              sizeClass="h-12 px-4 py-3"
              className={`border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary ${hasSubmit && phone === '' ? 'border-red-500' : ''}`}
              placeholder="+60XXXXXXXXX"
              // defaultValue="+60XXXXXXXXX"
              value={phone}
              type="tel"
              onChange={(e) => {
                setPhone(e.target.value);
              }}
            />
          </FormItem>
        </div>
        <div className="max-w-lg">
          <FormItem label="Confirm email address">
            <Input
              rounded="rounded-lg"
              value={email}
              sizeClass="h-12 px-4 py-3"
              className={`border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary ${hasSubmit && email === '' ? 'border-red-500' : ''}`}
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </FormItem>
        </div>
        {/* <div>
          <Checkbox
            className="!text-sm"
            name="uudai"
            label="Email me news and offers"
            defaultChecked
          />
        </div> */}

        {/* ============ */}
        <div className="flex flex-col pt-6 sm:flex-row">
          <ButtonPrimary
            className="shadow-none sm:!px-7"
            onClick={() => {
              handleSubmit();
              handleSave();
              onCloseActive();
            }}
          >
            Save and go to Shipping
          </ButtonPrimary>
          <ButtonSecondary
            className="mt-3 sm:ml-3 sm:mt-0"
            onClick={() => onCloseActive()}
          >
            Cancel
          </ButtonSecondary>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
