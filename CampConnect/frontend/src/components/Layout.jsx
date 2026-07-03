import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * CampConnect - App Layout Shell
 * Wraps page content with Navbar and Footer.
 */
const Layout = ({ children, alerts }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar alerts={alerts} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
