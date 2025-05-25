'use client';

import type { FC } from 'react';
import React, { useState } from 'react';
import { TbTruckDelivery } from 'react-icons/tb';

import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import ButtonSecondary from '@/shared/Button/ButtonSecondary';
import FormItem from '@/shared/FormItem';
import Input from '@/shared/Input/Input';
// import Radio from '@/shared/Radio/Radio';
import Select from '@/shared/Select/Select';
// import { ShippingAddress } from '@stripe/stripe-js';

type ShippingAddressData = {
  fname: string;
  lname: string;
  shippingAddress1: string;
  shippingAddress2: string;
  no: string;
  city: string;
  state: string;
  postalCode: string;
};

interface Props {
  isActive: boolean;
  onCloseActive: () => void;
  onOpenActive: () => void;
  onShippingChange: (shippingData: ShippingAddressData) => void;
}

const ShippingAddress: FC<Props> = ({
  isActive,
  onCloseActive,
  onOpenActive,
  onShippingChange,
}) => {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [shippingAddress1, setShippingAddress1] = useState('');
  const [shippingAddress2, setShippingAddress2] = useState('');
  const [no, setNo] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPcode] = useState('');
  const [savedAddress1, setSavedAddress1] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setSavedAddress2] = useState('');
  const [savedNo, setSavedNo] = useState('');
  const [savedPcode, setSavedPcode] = useState('');
  const [savedCity, setSavedCity] = useState('');
  const [savedState, setSavedState] = useState('');

  const handleSubmit = () => {
    onShippingChange({
      fname,
      lname,
      shippingAddress1,
      shippingAddress2,
      no,
      city,
      state,
      postalCode,
    });
  };

  const handleSave = () => {
    setSavedAddress1(shippingAddress1);
    setSavedAddress2(shippingAddress2);
    setSavedNo(no);
    setSavedPcode(postalCode);
    setSavedCity(city);
    setSavedState(state);
  };

  return (
    <div className="rounded-xl border border-neutral-300 ">
      <div className="flex flex-col items-start p-6 sm:flex-row">
        <span className="hidden sm:block">
          <TbTruckDelivery className="text-3xl text-primary" />
        </span>

        <div className="flex w-full items-center justify-between">
          <div className="sm:ml-8">
            <span className="uppercase">SHIPPING ADDRESS</span>
            <div className="mt-1 text-sm font-semibold">
              <span className="">
                {savedNo} {savedAddress1} {savedPcode} {savedCity}
                {savedState}
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
        {/* ============ */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
          <div>
            <FormItem label="First name">
              <Input
                rounded="rounded-lg"
                sizeClass="h-12 px-4 py-3"
                className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                placeholder="First name"
                value={fname}
                onChange={(e) => {
                  setFname(e.target.value);
                }}
              />
            </FormItem>
          </div>
          <div>
            <FormItem label="Last name">
              <Input
                rounded="rounded-lg"
                sizeClass="h-12 px-4 py-3"
                className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                placeholder="Last name"
                value={lname}
                onChange={(e) => {
                  setLname(e.target.value);
                }}
              />
            </FormItem>
          </div>
        </div>

        {/* ============ */}
        <div className="space-y-4 sm:flex sm:space-x-3 sm:space-y-0">
          <div className="flex-1">
            <FormItem label="Address Line 1">
              <Input
                rounded="rounded-lg"
                sizeClass="h-12 px-4 py-3"
                className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                placeholder="Address line 1"
                type="text"
                value={shippingAddress1}
                onChange={(e) => {
                  setShippingAddress1(e.target.value);
                }}
              />
            </FormItem>
          </div>

          <div className="sm:w-1/3">
            <FormItem label="No., Apt, Suite *">
              <Input
                rounded="rounded-lg"
                sizeClass="h-12 px-4 py-3"
                className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                placeholder="No., Apt, Suite *"
                value={no}
                onChange={(e) => {
                  setNo(e.target.value);
                }}
              />
            </FormItem>
          </div>
        </div>
        <div className="flex-1">
          <FormItem label="Address Line 2">
            <Input
              rounded="rounded-lg"
              sizeClass="h-12 px-4 py-3"
              className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
              placeholder="Address line 2"
              type="text"
              value={shippingAddress2}
              onChange={(e) => {
                setShippingAddress2(e.target.value);
              }}
            />
          </FormItem>
        </div>

        {/* ============ */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
          <div>
            <FormItem label="City">
              <Input
                rounded="rounded-lg"
                sizeClass="h-12 px-4 py-3"
                className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                placeholder="City"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                }}
              />
            </FormItem>
          </div>
          <div>
            <FormItem label="Country">
              <Input
                sizeClass="h-12 px-4 py-3"
                className="rounded-lg border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                defaultValue="Malaysia"
                readOnly
              />
              {/* <option value="United States">United States</option>
                <option value="United States">Canada</option>
                <option value="United States">Mexico</option>
                <option value="United States">Israel</option>
                <option value="United States">France</option>
                <option value="United States">England</option>
                <option value="United States">Laos</option>
                <option value="United States">China</option> */}
              {/* </Select> */}
            </FormItem>
          </div>
        </div>

        {/* ============ */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
          <div>
            <FormItem label="State">
              <Select
                sizeClass="h-12 px-4 py-3"
                className="rounded-lg border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                // defaultValue="-"
                value={state}
                // value={state}
                onChange={(e) => {
                  setState(e.target.value);
                }}
              >
                <option value="" disabled hidden>
                  Select a state
                </option>
                <option value="Sabah">Sabah</option>
                <option value="Negeri Sembilan">Negeri Sembilan</option>
                <option value="Johor">Johor</option>
                <option value="Kelantan">Kelantan</option>
                <option value="Pahang">Pahang</option>
                <option value="Kedah">Kedah</option>
                <option value="Sarawak">Sarawak</option>
                <option value="Terengganu">Terengganu</option>
                <option value="Melaka">Melaka</option>
                <option value="Selangor">Selangor</option>
                <option value="Perlis">Perlis</option>
                <option value="Perak">Perak</option>
                <option value="Pulau Pinang">Pulau Pinang</option>
                <option value="Kuala Lumpur">Kuala Lumpur</option>
                <option value="Putrajaya">Putrajaya</option>
              </Select>
              {/* <Input
                rounded="rounded-lg"
                sizeClass="h-12 px-4 py-3"
                className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                defaultValue="Arizona"
              /> */}
            </FormItem>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
          <FormItem label="Postal code">
            <Input
              rounded="rounded-lg"
              sizeClass="h-12 px-4 py-3"
              className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
              placeholder="Postal code"
              value={postalCode}
              onChange={(e) => {
                setPcode(e.target.value);
              }}
            />
          </FormItem>
        </div>
      </div>

      {/* ============ */}
      {/* <div className="px-6">
        <FormItem label="Address type">
          <div className="mt-1.5 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
            <Radio
              label="Home(All Day Delivery)"
              id="Address-type-home"
              name="Address-type"
              defaultChecked
            />
            <Radio
              label="Office(Delivery 9 AM - 5 PM)"
              id="Address-type-office"
              name="Address-type"
            />
          </div>
        </FormItem>
      </div> */}

      {/* ============ */}
      <div className="flex flex-col p-6 sm:flex-row">
        <ButtonPrimary
          className="shadow-none sm:!px-7"
          onClick={() => {
            handleSave();
            handleSubmit();
            onCloseActive();
          }}
        >
          Save and go to Payment
        </ButtonPrimary>
        <ButtonSecondary
          className="mt-3 sm:ml-3 sm:mt-0"
          onClick={onCloseActive}
        >
          Cancel
        </ButtonSecondary>
      </div>
    </div>
  );
};

export default ShippingAddress;
