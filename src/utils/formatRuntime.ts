export function formatRuntime(runtime: number): string {
  if (!runtime) return 'N/A';
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return `${hours}ساعت و ${minutes}خولەک`;
}
