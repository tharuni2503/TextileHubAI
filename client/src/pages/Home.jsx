import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";
import WhyChooseUs from "../components/WhyChooseUs";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import FloatingAI from "../components/FloatingAI";

export default function Home() {
  return (
    <>
      <Navbar />
      
      <main className="pt-20">
        <Hero />
        <Categories />
        <FeaturedProducts />
        <WhyChooseUs />
        <Testimonials />
        <Footer />
      </main>

      <FloatingAI />
    </>
  );
}