export function generateCampICS(camp: { title: string; startDate: Date; endDate: Date; address: string | null; city: string }) {
  const formatDate = (date: Date) => date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//VolleyDzen//Camp//EN",
    "BEGIN:VEVENT",
    `SUMMARY:Волейбольный кэмп: ${camp.title}`,
    `DTSTART:${formatDate(camp.startDate)}`,
    `DTEND:${formatDate(camp.endDate)}`,
    `LOCATION:${camp.address || camp.city}`,
    "DESCRIPTION:Ждем вас на кэмпе VolleyDzen!",
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  return Buffer.from(icsContent);
}
