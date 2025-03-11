import { countries, cities } from 'countries-list';

// Convert countries object to array of location strings
const countryList = Object.entries(countries).map(([_, country]) => country.name);

// Create a function to get filtered locations based on search input
export function getFilteredLocations(search: string): string[] {
  const searchLower = search.toLowerCase();

  // Return all locations if no search term
  if (!search) {
    return countryList;
  }

  // Filter countries that match the search term
  return countryList.filter(location =>
    location.toLowerCase().includes(searchLower)
  );
}

// Export the full list for initial display
export const LOCATIONS = countryList;