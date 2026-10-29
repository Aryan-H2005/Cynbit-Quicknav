// Destinations live on cynbit.in, so they open in a new tab and the prototype stays put.
export function openDestination(destination) {
  window.open(destination.url, '_blank', 'noopener,noreferrer');
}
