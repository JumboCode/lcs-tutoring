import { useEffect, useState } from "react";

export default function Demo() {
  const [text, setText] = useState<string>();
  useEffect(() => {
    const id = "Hello!!";

    const fetchMessage = async () => {
      const data = await fetch(`http://localhost:3000/demo/${id}`);
      const message = await data.text();
      setText(message);
    };

    fetchMessage();

    console.log("Rendering");
  }, []);
  return (
    <div className="flex justify-center">
      <div className="bg-red-200 w-[300px] sm:w-[500px] md:w-[800px] lg:w-[1000px] h-[500px] text-center">
        {text}
      </div>
    </div>
  );
}
