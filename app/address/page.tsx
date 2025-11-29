import { AddressForm } from "@/components/forms/AddressForm";
import { StepWrapper } from "@/components/StepWrapper";
import Image from "next/image";

export default function Page() {
  return (
    <StepWrapper
      title="Address Information"
      icon={
        <Image src="/address.png" width={40} height={40} alt="address detail" />
      }
    >
      <AddressForm />
    </StepWrapper>
  );
}
