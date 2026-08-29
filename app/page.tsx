import Disclosure from "@/components/Disclosure";
import Flow from "@/components/Flow";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Leak from "@/components/Leak";
import Nav from "@/components/Nav";
import SmoothScroll from "@/components/SmoothScroll";
import ThemeScroll from "@/components/ThemeScroll";
import Waitlist from "@/components/Waitlist";

export default function Page() {
  return (
    <>
      <SmoothScroll />
      <ThemeScroll>
        <Nav />
        <main>
          <Hero />
          <Leak />
          <Flow />
          <Disclosure />
          <Waitlist />
        </main>
        <Footer />
      </ThemeScroll>
    </>
  );
}
