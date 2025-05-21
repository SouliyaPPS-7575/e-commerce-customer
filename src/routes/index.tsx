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
              height: 'auto',
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
    </>
  );
}
