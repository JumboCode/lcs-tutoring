import elephantLogo from "../assets/images/elephant.svg";

export default function HeaderAdmin() {
  return (
    <header className="border-gray-200 border-b flex py-3 px-20 justify-between items-center bg-white sticky top-0 z-50">
      <img className="h-12 w-12" src={elephantLogo} alt="Elephant Logo" />
      <ul className="flex flex-row space-x-8">
        <button className="cursor-pointer border-b-2 border-transparent hover:border-black">
          Notifs
        </button>
        <button className="cursor-pointer border-b-2 border-transparent hover:border-black">
          Profile
        </button>
      </ul>
    </header>
  );
}
