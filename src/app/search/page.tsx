import { getCuisines } from '@/services/cuisines';

export default async function SearchPage() {
  const cuisines = await getCuisines();

  // return <SearchPageClient cuisines={cuisines} />;
  return <div>Teste</div>;
}
