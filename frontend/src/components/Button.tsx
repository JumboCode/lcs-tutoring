export default function Button() {
  const fetchWeather = async () => {
    const response = await fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=b6907d289e10d714a6e88b30761fae22"
    );
    const data = await response.json();
    console.log(data);
  };
  return (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Button
    </button>
  );
}
