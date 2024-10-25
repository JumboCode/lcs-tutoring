interface boxProps {
  name: string;
  message: string;
  major: string;
  year: string;
}

export default function box({ name, message, major, year }: boxProps) {
  return (
    <div className="w-[350px] h-[450px] font-inter bg-[#F5F5F5] flex flex-col justify-between text-left rounded-lg p-6">
      <p className="text-[#555454]">"{message}"</p>
      <div className="text-[#1F3A68]">
        <p className="font-bold text-2xl mt-2">{name}</p>
        <div className="mt-1">
          <p>MAJOR: {major}</p>
          <p>YEAR: {year}</p>
        </div>
      </div>
    </div>
  );
}
