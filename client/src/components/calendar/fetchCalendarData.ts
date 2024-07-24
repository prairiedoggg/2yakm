export function fetchCalendarData() {
  return fetch('http://localhost:3000').then((response) => response.json());
}
