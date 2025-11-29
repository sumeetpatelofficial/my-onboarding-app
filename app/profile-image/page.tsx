import { ImageForm } from "@/components/forms/ImageForm";
import { StepWrapper } from "@/components/StepWrapper";
import Image from "next/image";
export default function Page() {
  return (
    <StepWrapper
      title="Upload User Image"
      icon={
        <Image src="/image.png" width={40} height={40} alt="address detail" />
      }
    >
      <ImageForm />
    </StepWrapper>
  );
}
