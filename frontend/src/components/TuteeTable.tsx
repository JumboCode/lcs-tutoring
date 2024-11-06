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
      <TuteeInfoBox box_props={tutees[0]} />
      <Footer></Footer>
    </div>
  );
}
