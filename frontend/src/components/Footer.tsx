// Footer.tsx
import GrayLogo from "../assets/images/gray_logo.svg";
const Footer = () => {
  return (
    <div>
      <div className="flex w-screen flex-row bg-blue-100">
        <div className="w-1/2 flex flex-col justify-between justify-items-start m-4">
          <img src={GrayLogo} alt="Your SVG" className="w-10 h-10" />
          <p className="text-gray-500 text-xs ">Tufts LCS Tutoring © 2024</p>
        </div>
        <div className="w-1/2 flex flex-col justify-items-end">
          <div className="flex flex-col">
            <p className="text-gray-500 text-xs font-bold">Pages</p>
            <p className="text-gray-500 text-xs">Home</p>
            <p className="text-gray-500 text-xs">About</p>
            <p className="text-gray-500 text-xs">Team</p>
            <p className="text-gray-500 text-xs">Forms</p>
          </div>
          <p className="text-gray-500 text-xs">Find us on instagram</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;

// rgb(218,233,249)
