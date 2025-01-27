export type tuteeBoxProps = {
  date: string;
  tutee_first_name: string;
  tutee_last_name: string;
  parent_email: string;
  subject: string;
  grade: string;
  special_needs: string;
  gender: string;
  tutoring_mode: string;
  parent_first_name: string;
  parent_last_name: string;
  parent_phone: string;
  notes?: string;
};

export type tutorBoxProps = {
  id: string;
  date: string;
  first_name: string;
  last_name: string;
  email: string;
  subject_pref: string[];
  pronouns: string;
  major: string;
  year_grad: string;
  phone: string;
  grade_level_pref: string[];
  disability_pref: boolean;
  tutoring_mode: string;
  previous_tutee: boolean;
  num_tutees: number;
};

export interface tutorInfo {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  subject: string[];
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
  tutoring_mode?: string;
}
