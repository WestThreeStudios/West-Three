import Accolades from "@/components/Accolades";
import Cover from "@/components/Cover";
import GrainFilters from "@/components/GrainFilters";
import Story from "@/components/Story";
import StudioWork from "@/components/StudioWork";

export default function Home() {
  return (
    <>
      <GrainFilters />
      <Cover />
      <Story />
      <StudioWork />
      <Accolades />
    </>
  );
}
