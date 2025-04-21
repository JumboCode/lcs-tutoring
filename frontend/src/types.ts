export type tuteeBoxProps = {
  id: string;
  date: string;
  history_date: string | null;
  tutee_first_name: string;
  tutee_last_name: string;
  parent_email: string;
  subjects: string[];
  grade: string;
  special_needs: string;
  gender: string;
  tutoring_mode: string;
  parent_first_name: string;
  parent_last_name: string;
  parent_phone: string;
  notes?: string;
  priority: boolean;
  flagged: boolean;
};

export type tutorBoxProps = {
  id: string;
  date: string;
  history_date: string | null;
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
  num_tutees: number;
  notes: string;
  priority: boolean;
};

export interface tutorInfo {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  subject: string[];
  grade_level_pref: string[];
  disability_pref: boolean;
  flagged: boolean;
  tutoring_mode: string;
  notes: string;
}

export interface tuteeInfo {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  subjects: string[];
  grade: string;
  special_needs: string;
  tutoring_mode?: string;
  flagged: boolean;
  notes: string;
}
