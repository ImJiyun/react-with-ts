export async function get(url: string) {
  const response = await fetch(url); // returns Promise<Response>

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = (await response.json()) as unknown;
  // response.json() returns Promise<any>
  // unknown is better than any
  return data;
}
