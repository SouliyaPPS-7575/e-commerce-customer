import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useRef, useState } from 'react';
import HeroSection from '~/containers/home/sections/HeroSection';
import ProductsSection from '~/containers/home/sections/ProductsSection';
import { bannersQueryOption } from '~/hooks/banner/useBanners';
import { productsQueryOption } from '~/hooks/shop/useProducts';
import Navbar from '~/layout/navbar';

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    const products = context.queryClient.ensureQueryData(productsQueryOption());
    const banners = context.queryClient.ensureQueryData(bannersQueryOption());
    return { products, banners };
  },
  component: Home,
});


function Home() {
  // States
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [currentPage, setCurrentPage] = useState(0);


  // Handle page change
  const goToPage = (pageNumber: number) => {
    // Allow navigation state to update before scrolling
    setTimeout(() => {
      if (containerRef.current?.children[pageNumber]) {
        const element = containerRef.current.children[
          pageNumber
        ] as HTMLElement;
        element.getBoundingClientRect(); // force reflow
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  //  Handle scroll
  let lastScrollTop = 0;

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const direction = scrollTop > lastScrollTop ? 'down' : 'up';
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

    if (direction === 'down' && currentPage === 0) {
      setCurrentPage(1);
    } else if (direction === 'up' && scrollTop <= 10 && currentPage === 1) {
      setCurrentPage(0);
    }
  };
  // Get sections: render only the appropriate sections based on current page
  const sections = useMemo(() => {
    return [
      <HeroSection
        key="hero"
        goToPage={goToPage}
        handleScroll={handleScroll}
      />,
      <ProductsSection key="products" />,
    ];
  }, []);

  return (
    <>
      {/* <Navbar /> */}
      <Navbar currentPage={currentPage} goToPage={goToPage} />

      {/* Scrollable container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{
          height: '100vh', // Full viewport height
          overflowY: 'auto', // Enable vertical scrolling
          scrollSnapType: 'y mandatory', // Optional if you want snap scrolling
          scrollBehavior: 'smooth',
        }}
      >
        {sections.map((section, index) => (
          <div
            key={index}
            style={{
              minHeight: 'auto',
              scrollSnapAlign: 'none',
              opacity: currentPage === index || 1 === 1 ? 1 : 0,
              transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
            }}
          >
            {section}
          </div>
        ))}
      </div>

      {/* Alternative Design with Custom WhatsApp SVG */}
      <a
        href="https://wa.me/1234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-3 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 z-50 group"
        aria-label="Contact us on WhatsApp"
      >
        {/* Custom WhatsApp SVG Icon */}
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.63" />
        </svg>

        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 group-hover:animate-ping"></div>
      </a>
    </>
  );
}
