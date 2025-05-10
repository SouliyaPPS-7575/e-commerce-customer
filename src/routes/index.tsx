import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import Pagination from '~/containers/home/Pagination';
import BlogSection from '~/containers/home/sections/BlogSection';
import FooterSection from '~/containers/home/sections/FooterSection';
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
  const navigate = useNavigate();

  // States
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Get URL params
  const currentPageNumber = Route.useSearch();
  const params = new URLSearchParams(currentPageNumber);
  const pageNumber = params.get('currentPageNumber');
  const page = Number(pageNumber);

  // Get current page
  const [currentPage, setCurrentPage] = useState(page);

  useEffect(() => {
    if (!isNaN(page)) {
      setCurrentPage(page);
      // Scroll to the correct section on initial load
      setTimeout(() => {
        if (containerRef.current?.children[currentPage]) {
          const element = containerRef.current.children[
            currentPage
          ] as HTMLElement;
          element.getBoundingClientRect(); // force reflow
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    }
  }, []);

  // Handle page change
  const goToPage = (pageNumber: number) => {
    navigate({
      search: (prev: any) => ({ ...prev, currentPageNumber: pageNumber }),
    } as any);

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
    const height = container.clientHeight;
    const newIndex = Math.round(scrollTop / height);

    if (newIndex !== currentPage) {
      setCurrentPage(newIndex);

      // Update URL search params
      navigate({
        search: (prev: any) => ({ ...prev, currentPageNumber: newIndex }),
      } as any);
    }
  };

  // Get sections: render all at once to avoid remounting and improve UI rendering
  const sections = useMemo(
    () => [
      <HeroSection
        key="hero"
        goToPage={goToPage}
        handleScroll={handleScroll}
      />,
      <ProductsSection key="products" />,
      <BlogSection key="blog" />,
      <FooterSection key="footer" />,
    ],
    [],
  );

  return (
    <>
      {/* <Navbar /> */}
      <Navbar currentPage={currentPage} goToPage={goToPage} />

      {/* <Pagination /> */}
      <Pagination
        currentPage={currentPage + 1}
        pageCount={sections.length}
        onPageChange={goToPage}
      />

      {/* Scrollable container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{
          height: '100vh',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth', // extra fallback
        }}
      >
        {sections.map((section, index) => (
          <div
            key={index}
            style={{
              height: '100vh',
              minHeight: '100vh',
              scrollSnapAlign: 'start',
              opacity: currentPage === index ? 1 : 0,
             
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
