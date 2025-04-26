import { Link } from "react-router-dom";
import elephant from "../assets/images/elephant.svg";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img src={elephant} alt="Not Found" className="mb-6" />
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-6">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="bg-[#4857a1] text-white px-4 py-2 rounded hover:bg-[#333a88]"
      >
        Go Home
      </Link>
    </div>
  );
}
