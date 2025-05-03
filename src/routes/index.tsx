import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import Pagination from '~/containers/home/Pagination';
import AboutSection from '~/containers/home/sections/AboutSection';
import BlogSection from '~/containers/home/sections/BlogSection';
import FooterSection from '~/containers/home/sections/FooterSection';
import HeroSection from '~/containers/home/sections/HeroSection';
import ProductsSection from '~/containers/home/sections/ProductsSection';
import Navbar from '~/layout/navbar';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  const navigate = useNavigate();

  // States
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Get current page
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = Number(params.get('currentPageNumber'));
    if (!isNaN(page)) {
      setCurrentPage(page);
      // Scroll to the correct section on initial load
      setTimeout(() => {
        containerRef.current?.children[page]?.scrollIntoView({
          behavior: 'auto',
        });
      }, 0);
    }
  }, []);

  // Handle page change
  const goToPage = (pageNumber: number) => {
    navigate({
      search: (prev: any) => ({ ...prev, currentPageNumber: pageNumber }),
    } as any);
    containerRef.current?.children[pageNumber]?.scrollIntoView({
      behavior: 'smooth',
    });
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
      <HeroSection key="hero" goToPage={goToPage} />,
      <AboutSection key="about" />,
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
        }}
      >
        {sections.map((section, index) => (
          <div
            key={index}
            style={{
              height: '100vh',
              scrollSnapAlign: 'start',
              opacity: currentPage === index ? 1 : 0,
              transform: currentPage === index ? 'translateY(0)' : 'translateY(50px)',
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
