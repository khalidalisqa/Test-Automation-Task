// Utility data for flight automation
export const validDepartureCities: string[] = [
  "Paris",
  "Philadelphia",
  "Boston",
  "Portland",
  "San Diego",
  "Mexico City",
  "São Paolo",
];

// Map of departure → valid destinations
export const flightsMap: Record<string, string[]> = {
  Paris: ["Buenos Aires", "Rome", "Berlin"],
  Philadelphia: ["Buenos Aires", "Rome", "Berlin"],
  Boston: ["Buenos Aires", "Rome", "Berlin"],
  Portland: ["Buenos Aires", "Rome", "Berlin"],
  "San Diego": ["Buenos Aires", "Rome"],
  "Mexico City": ["Buenos Aires", "Rome"],
  "São Paolo": ["Buenos Aires", "Rome"],
};

// Random element from array
export function randomFrom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}
