// Routing abstraction. If EXPO_PUBLIC_ROUTING_API_KEY is set, a real
// directions service can be plugged in here. Otherwise we return a
// straight-line preview so the map never crashes.
export async function getRoute(pickup, destination) {
  const apiKey = process.env.EXPO_PUBLIC_ROUTING_API_KEY;
  if (apiKey) {
    try {
      // NOTE: Plug your preferred directions API call here.
      // const res = await fetch(`https://api.example.com/directions?...&key=${apiKey}`);
      // const json = await res.json();
      // return json.coordinates;
    } catch {
      // fall through to straight line
    }
  }
  return [pickup, destination];
}
