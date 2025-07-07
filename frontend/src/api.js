export function fetchData() {
  return fetch(`${process.env.REACT_APP_API_URL}/api/route`)
    .then(res => res.json());
}
