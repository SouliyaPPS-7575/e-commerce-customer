import { Box } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useRef, useState, lazy, Suspense } from 'react';
import Pagination from '~/containers/home/Pagination';
import Navbar from '~/layout/navbar';

const HeroSection = lazy(() => import('~/containers/home/sections/HeroSection'));
const AboutSection = lazy(() => import('~/containers/home/sections/AboutSection'));
const ProductsSection = lazy(() => import('~/containers/home/sections/ProductsSection'));
const BlogSection = lazy(() => import('~/containers/home/sections/BlogSection'));
const FooterSection = lazy(() => import('~/containers/home/sections/FooterSection'));

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  const [currentPage, setCurrentPage] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const goToPage = (pageNumber: number) => {
    containerRef.current?.children[pageNumber]?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const height = container.clientHeight;
    const newIndex = Math.round(scrollTop / height);

    if (newIndex !== currentPage) {
      setCurrentPage(newIndex);
    }
  };

  const sections = useMemo(
    () => [
      <HeroSection key="hero" />,
      <AboutSection key="about" />,
      <ProductsSection key="products" />,
      <BlogSection key="blog" />,
      <FooterSection key="footer" />,
    ],
    [],
  );

  return (
    <>
      <Navbar currentPage={currentPage} goToPage={goToPage} />
      <Pagination
        currentPage={currentPage + 1}
        pageCount={sections.length}
        onPageChange={goToPage}
      />
      <Box
        ref={containerRef}
        onScroll={handleScroll}
        sx={{
          height: '100vh',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
        }}
      >
        <Suspense fallback={<div>Loading...</div>}>
          {sections.map((section, index) => (
            <Box key={index} sx={{ height: '100vh', scrollSnapAlign: 'start' }}>
              {section}
            </Box>
          ))}
        </Suspense>
      </Box>
    </>
  );
}
