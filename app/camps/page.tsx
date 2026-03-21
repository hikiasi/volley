import { getCamps, getUniqueCampCities } from "@/lib/camps";
import { CampList } from "@/components/camps/CampList";

export default async function CampsPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const activeCity = searchParams?.city;
  
  const [camps, cities] = await Promise.all([
    getCamps({ status: "published", city: activeCity }),
    getUniqueCampCities()
  ]);

  // Serialize data before passing to client component
  const serializedCamps = camps.map(camp => ({
    ...camp,
    startDate: camp.startDate.toISOString(),
    createdAt: camp.createdAt.toISOString(),
    updatedAt: camp.updatedAt.toISOString(),
    // Convert any other non-serializable fields if necessary
  }));

  return (
    <CampList 
      initialCamps={serializedCamps} 
      cities={cities}
      activeCity={activeCity} 
    />
  );
}
