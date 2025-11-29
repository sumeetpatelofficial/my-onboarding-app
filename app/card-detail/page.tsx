import CardDetailsForm from "@/components/forms/CardDetailForm";
import { StepWrapper } from "@/components/StepWrapper";
import Image from "next/image";
export default function Page() {
  return (
    <StepWrapper
      title="Add your card deatils"
      icon={
        <Image src="/card.png" width={40} height={40} alt="card detail" />
      }
    >
      <CardDetailsForm />
    </StepWrapper>
  );
}
