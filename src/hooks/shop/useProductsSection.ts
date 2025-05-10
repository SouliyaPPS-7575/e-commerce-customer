import { useProducts } from '~/hooks/shop/useProducts';
import { useRanking } from '~/hooks/shop/useRanking';
export const useProductsSection = () => {
  const { productsData } = useProducts();

  const { productsRankingData } = useRanking();

  // create function filter products by ranking refer from ranking.rank
  const filteredProductsRanking = productsRankingData
    .filter((ranking) => ranking?.rank <= 100)
    .sort((a, b) => a?.rank - b?.rank) // Sort by rank ascending
    .map((ranking) => {
      const product = productsData.find(
        (product) => product?.id === ranking?.product_id,
      );
      return {
        ...product,
        rank: ranking?.rank,
      };
    });
     
  return {
    filteredProductsRanking,
  };
};
