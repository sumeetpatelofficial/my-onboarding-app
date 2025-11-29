import { PersonalForm } from "@/components/forms/PersonalForm";
import { StepWrapper } from "@/components/StepWrapper";
import Image from "next/image";

export default function Page() {
  return (
    <StepWrapper
      title="Personal Information"
      icon={
        <Image
          src="/personal-detail.png"
          width={40}
          height={40}
          alt="personal-detail"
        />
      }
    >
      <PersonalForm />
    </StepWrapper>
  );
}
