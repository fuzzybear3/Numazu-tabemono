interface PlaceDetails {
  name: string;
  address: string;
  lat: number;
  lng: number;
  place_id: string;
}

export async function getPlaceDetails(placeId: string): Promise<PlaceDetails> {
  const apiKey = process.env.GOOGLE_PLACES_SERVER_KEY;
  if (!apiKey) throw new Error("GOOGLE_PLACES_SERVER_KEY is not set");

  const fields = "name,formatted_address,geometry,place_id";
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}`;

  const response = await fetch(url, { cache: "no-store" });
  const data = await response.json();

  if (data.status !== "OK") {
    throw new Error(`Places API error: ${data.status}`);
  }

  const result = data.result;
  return {
    name: result.name,
    address: result.formatted_address,
    lat: result.geometry.location.lat,
    lng: result.geometry.location.lng,
    place_id: result.place_id,
  };
}
