export type tuteeBoxProps = {
  date: string;
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  grade: string;
  special_needs: string;
  gender: string;
  tutoring_mode: string;
  parent_first_name: string;
  parent_last_name: string;
  phone: string;
  matched: boolean;
};

export interface tutorInfo {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  subject: string[]
  grade: string[];
  open_to_disability: boolean;
  tutoring_mode: string;
}

export interface tuteeInfo {
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  grade: string;
  special_needs: string;
  tutoring_mode: string;
}
