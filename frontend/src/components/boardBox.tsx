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
        "flex w-[95vw] md:h-[300px] h-[220px] lg:w-[60vw] xl:w-[50vw] bg-[#FBFDFE] rounded-lg border-2 border-[#BFDBF7] p-2"
      }
    >
      <img
        src={photo}
        alt={`${name}'s photo`}
        className="rounded-md w-auto md:h-[280px] h-[200px] object-cover"
      />
      <div className={"flex flex-col mx-2"}>
        <p className={"font-semibold text-xl md:text-2xl"}>{name}</p>
        <p className={"font-normal text-sm md:text-lg"}>{title}</p>
        <p className={"font-light italic text-sm md:text-base"}>
          Class of {year}
        </p>
        <p
          className={
            "font-light xl:text-base lg:text-sm md:text-base sm:text-sm text-[0.625rem] md:leading-5 mt-1 md:mt-3"
          }
        >
          {bio}
        </p>
      </div>
    </div>
  );
}
