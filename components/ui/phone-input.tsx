"use client";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export function PhoneInputField({ value, onChange }: any) {
  return (
    <div className="w-full">
      <PhoneInput
        country={"in"}
        value={value}
        onChange={onChange}
        enableSearch={true}
        placeholder="Enter phone number"
        inputClass="!w-full !h-11 !text-sm !rounded-r-sm"
        buttonClass="!rounded-l-sm"
        dropdownClass="!rounded-sm"
      />
    </div>
  );
}
