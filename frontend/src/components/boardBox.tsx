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
        "flex w-[80vw] h-[300px] lg:w-[60vw] xl:w-[50vw] bg-[#FBFDFE] rounded-lg border-2 border-[#BFDBF7] p-2 mx-8"
      }
    >
      <img
        src={photo}
        alt={`${name}'s photo`}
        className="rounded-md w-auto h-[280px] object-cover"
      />
      <div className={"flex flex-col mx-2"}>
        <p className={"font-semibold text-2xl"}>{name}</p>
        <p className={"font-normal text-lg"}>{title}</p>
        <p className={"font-light italic text-base"}>Class of {year}</p>
        <p className={"font-light text-base leading-5 mt-3"}>{bio}</p>
      </div>
    </div>
  );
}
