interface TestimonialProps {
  name: string;
  message: string;
  major: string;
  year: string;
}

export default function TestimonialCard({
  name,
  message,
  major,
  year,
}: TestimonialProps) {
  return (
    <div className="w-[350px] h-[450px] bg-[#F5F5F5] p-6 flex flex-col justify-between">
      <p className="font-inter text-[#555454] text-base">"{message}"</p>
      <div className="mt-auto text-left font-inter text-[#253965]">
        <h4 className="mt-2 font-semibold text-lg">{name}</h4>
        <div className="mt-1">
          <p className="text-base">MAJOR: {major}</p>
          <p className="text-base">YEAR: {year}</p>
        </div>
      </div>
    </div>
  );
}
