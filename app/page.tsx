import Disclosure from "@/components/Disclosure";
import Flow from "@/components/Flow";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Leak from "@/components/Leak";
import Limits from "@/components/Limits";
import Research from "@/components/Research";
import Nav from "@/components/Nav";
import SmoothScroll from "@/components/SmoothScroll";
import ThemeScroll from "@/components/ThemeScroll";
import Waitlist from "@/components/Waitlist";

export default function Page() {
  return (
    <>
      <SmoothScroll />
      <div className="grain" aria-hidden />
      <ThemeScroll>
        <Nav />
        <main>
          <Hero />
          <Leak />
          <Research />
          <Disclosure />
          <Flow />
          <Limits />
          <Waitlist />
        </main>
        <Footer />
      </ThemeScroll>
    </>
  );
}
