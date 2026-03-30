import { getCamps, getUniqueCampCities } from "@/lib/camps";
import { CampList } from "@/components/camps/CampList";

export default async function CampsPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const activeCity = searchParams?.city;
  
  const [camps, cities] = await Promise.all([
    getCamps({ status: "published", city: activeCity }),
    getUniqueCampCities()
  ]);

  const serializedCamps = camps.map(camp => ({
    ...camp,
    startDate: camp.startDate.toISOString(),
    endDate: camp.endDate ? camp.endDate.toISOString() : null,
    earlyBirdCutoff: camp.earlyBirdCutoff ? camp.earlyBirdCutoff.toISOString() : null,
  }));

  return (
    <CampList 
      initialCamps={serializedCamps} 
      cities={cities}
      activeCity={activeCity} 
    />
  );
}
