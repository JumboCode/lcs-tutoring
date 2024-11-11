import TuteeInfoBox from "./TuteeInfoBox";
// import
// import { IBoxProps } from "../types";
import Header from "./header";
import Footer from "./Footer";

export default function TuteeTable() {
  const tutees = [
    {
      date: "10/31/2024",
      first_name: "Moya",
      last_name: "Techakalayatum",
      email: "hello@gmail.com",
      subject: "Math, English",
      grade: "8",
      special_needs: "Yes",
      gender: "Female",
      tutoring_mode: "Hybrid",
      parent_first_name: "Alice",
      parent_last_name: "Bob",
      phone: "(123) 456-7890",
    },
    {
      date: "10/31/2024",
      first_name: "Moya",
      last_name: "Techakalayatum",
      email: "hello@gmail.com",
      subject: "Math, English",
      grade: "8",
      special_needs: "Yes",
      gender: "Female",
      tutoring_mode: "Hybrid",
      parent_first_name: "Alice",
      parent_last_name: "Bob",
      phone: "(123) 456-7890",
    },
  ];

  // export type IBoxProps = {
  //     date: string;
  //     first_name: string;
  //     last_name: string;
  //     email: string;
  //     subject: string;
  //     grade: string;
  //     special_needs: string;
  //     gender: string;
  //     tutoring_mode: string;
  //     parent_first_name: string;
  //     parent_last_name: string;
  //     phone: string;
  //   };

  return (
    <div>
      <Header />
      Tutee Database
      <table className="w-full text-left table-auto min-w-max text-slate-800 border-collapse border border-gray-200">
        <tr className="">
          <th className="p-4 font-interBlack">Unmatched</th>
          <th className="p-4 font-interBlack">Matched</th>
          <th className="p-4 font-interBlack">Inactive</th>
        </tr>
        {/* <tr className="border-b border-gray-200">
          <th className="p-4 font-interBlack">Date</th>
          <th className="p-4 font-interBlack">Name</th>
          <th className="p-4 font-interBlack">Subjeect</th>
          <th className="p-4 font-interBlack">Grade</th>
        </tr> */}
        <tbody>
          {tutees.map((tutee) => (
            <TuteeInfoBox box_props={tutees[0]} />
          ))}
          {/* <TuteeInfoBox box_props={tutees[0]} />
          <TuteeInfoBox box_props={tutees[1]} /> */}
        </tbody>
      </table>
      <Footer></Footer>
    </div>
  );
}
