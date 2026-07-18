import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { Services } from "@/components/home/Services";
import { Barbers } from "@/components/home/Barbers";
import { WhyUs } from "@/components/home/WhyUs";
import { Process } from "@/components/home/Process";
import { About } from "@/components/home/About";
import { SocialProof } from "@/components/home/SocialProof";
import { Locations } from "@/components/home/Locations";
import { FinalCTA } from "@/components/home/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Services />
      <Barbers />
      <WhyUs />
      <Process />
      <About />
      <SocialProof />
      <Locations />
      <FinalCTA />
    </>
  );
}
