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
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const sections = container.children;

    // Check each section's top offset relative to the scroll position
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i] as HTMLElement;
      const offsetTop = section.offsetTop;
      const offsetHeight = section.offsetHeight;

      if (scrollTop >= offsetTop - offsetHeight / 2) {
        if (currentPage !== i) {
          setCurrentPage(i);
        }
      }
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
      <Navbar currentPage={currentPage} goToPage={goToPage} />∏
      {/* Scrollable container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{
          height: 'auto',
          overflowY: 'visible',
          scrollSnapType: 'none',
          scrollBehavior: 'smooth', // extra fallback
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
