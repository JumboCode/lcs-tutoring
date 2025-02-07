interface BoardBoxProps {
  photo: string;
  name: string;
  title: string;
  year: string;
  bio: string;
}

export default function BoardBox({
  photo,
  name,
  title,
  year,
  bio,
}: BoardBoxProps) {
  return (
    <div
      className={
        "flex w-6/12 h-72 bg-[#FBFDFE] rounded-lg border-2 border-[#BFDBF7] p-2 mx-8"
      }
    >
      <img src={photo} className={"rounded-md"} />
      <div className={"flex flex-col mx-2"}>
        <p className={"font-interBlack font-semibold text-2xl"}>{name}</p>
        <p className={"font-inter font-normal text-lg"}>{title}</p>
        <p className={"font-inter font-light italic text-base"}>
          Class of {year}
        </p>
        <p className={"font-inter font-light text-base leading-5 mt-3"}>
          {bio}
        </p>
      </div>
    </div>
  );
}