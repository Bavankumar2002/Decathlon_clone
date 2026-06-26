import { Header } from "../components/Header/Header";
import { Hero } from "../components/Hero/Hero";
import { Categories } from "../components/Categories/Categories";
import { Products } from "../components/Products/Products";
import { Footer } from "../components/Footer/Footer";
import { CartDrawer } from "../components/Common/CartDrawer";
import { WishlistDrawer } from "../components/Common/WishlistDrawer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 text-zinc-900 font-sans">
      {/* Global E-commerce Header */}
      <Header />

      {/* Main E-commerce Layout Content */}
      <main className="flex-1 w-full">
        {/* Alerts and Sliding Campaigns banner */}
        <Hero />

        {/* Categories scroll grids */}
        <Categories />

        {/* Custom Section lists or live Search lists */}
        <Products />
      </main>

      {/* Multi-column Guaranteed Footer */}
      <Footer />

      {/* Client-side Interaction overlays */}
      <CartDrawer />
      <WishlistDrawer />
    </div>
  );
}
