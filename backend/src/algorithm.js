/**
 * @typedef {Object} Tutor
 * @property {string} id
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} pronouns
 * @property {string} major
 * @property {string} year_grad
 * @property {string} phone
 * @property {string} email
 * @property {number[]} grade_level_pref
 * @property {boolean} disability_pref
 * @property {string[]} subject_pref
 * @property {string} tutoring_mode
 * @property {boolean} previous_tutee
 * @property {string} continuing_tutee_name
 * @property {number} num_tutees
 * @property {string} notes
 * @property {string} language_proficiencies
 */

/**
 * @typedef {Object} Tutee
 * @property {string} id
 * @property {string} tutee_first_name
 * @property {string} tutee_last_name
 * @property {string} gender
 * @property {number} grade
 * @property {boolean} has_special_needs
 * @property {string} special_needs
 * @property {string} parent_first_name
 * @property {string} parent_last_name
 * @property {string} parent_phone
 * @property {string} parent_email
 * @property {string[]} subjects
 * @property {string} tutoring_mode
 * @property {string} notes
 * @property {string} date
 * @property {string} history_date
 */

export default class TutorMatcher { 
  // url = ""
  url = "http://localhost:3000";
  constructor() {
    /**
     * @type {Tutor[]}
     */
    this.tutors = [];
    /**
     * @type {Tutee[]}
     */
    this.tutees = [];
  }


  addTutor(tutor) {
    this.tutors.push(tutor);
  }

  addTutee(tutee) {
    this.tutees.push(tutee);
  }


  async fetchData() {
    await Promise.all([this.fetchTutors(), this.fetchTutees()]);
  }

  async fetchTutors() {
    console.log("fetching tutors");
    const response = await fetch(`${this.url}/unmatched-tutors`);
    const {unmatchedTutors} = await response.json();
    // console.log(unmatchedTutors);
    for (const unmatchedTutor of unmatchedTutors) {
      this.addTutor(unmatchedTutor);
    }
    // console.log("All tutees: ", this.tutees);
  }

  async fetchTutees() {
    console.log("fetching tutees");
    const response = await fetch(`${this.url}/unmatched-tutees`);
    const {unmatchedTutees} = await response.json();
    // console.log(unmatchedTutees);
    for (const unmatchedTutee of unmatchedTutees) {
      this.addTutee(unmatchedTutee);
    }
  }
  
  findMatches() {
    console.log("FINDING MATCHES")
    const matches = [];
  
    for (const tutor of this.tutors) {
      // Build an array of candidate matches with scores

      // console.log("TUTOR: ", tutor)

      const candidateMatches = [];
      for (const tutee of this.tutees) {
        // Skip if tutee has special needs and tutor's disability preference conflicts


        // if (tutee.has_special_needs && tutor.disability_pref) continue;
        const score = this._calculateMatchScore(tutor, tutee);
        candidateMatches.push({ tutee, score });
      }
  
      // Sort candidate matches by score descending
      candidateMatches.sort((a, b) => b.score - a.score);

      // console.log("CANDIDATE MATCHES: ", candidateMatches);
  
      // Select the top 3 matches (or fewer if capacity is reached)
      let assignedCount = 0;
      let tuteeIds = [null, null, null];
      let tuteeIndex = 0;

      for (const candidate of candidateMatches) {
        if (assignedCount >= 3) break;
  
        tuteeIds[tuteeIndex++] = candidate.tutee.id;
        assignedCount++;
      }
      matches.push({
        tutorId: tutor.id, 
        tuteeId1: tuteeIds[0],
        tuteeId2: tuteeIds[1],
        tuteeId3: tuteeIds[2]});
    }
    // console.log("Matches: ", matches);
    return matches;
  }

    _calculateSpecialNeedsScore(tutor, tutee) {
      // TODO: fix for diverse range of needs
      let needsScore = 0
      // tutor can tutor with special needs and tutee has
      if (tutor.disability_pref && tutee.has_special_needs) {
        needsScore = 1
      // tutor can tutor with special needs and tutee doesn't have
      } else if (tutor.disability_pref && tutee.has_special_needs) {
        needsScore = 0.8
      // tutor can't tutor with special needs and tutee doesn't have
      } else if (!tutee.has_special_needs && !tutor.disability_pref) {
        needsScore = 1
      }
      return needsScore;
    }

    _calculateTutoringModeScore(tutor, tutee) {
      let modeScore = 0;
      if (tutor.tutoring_mode === tutee.tutoring_mode) {
        // console.log("SAME MODE: ", tutor, tutee)
        modeScore = 1;
      } else if (tutor.tutoring_mode === "Anything" || tutee.tutoring_mode === "Anything") {
        modeScore = 1;
      }
      return modeScore; 
    }
  
    _calculateGradeScore(tutor, tutee) {
      let gradeScore = 0;
      if (tutor.grade_level_pref.includes(tutee.grade)) {
        gradeScore = 1;
      } else {
        const minGradeDiff = Math.min(
          ...Array.from(tutor.grade_level_pref).map((grade) =>
            Math.abs(grade - tutee.grade)
          )
        );
        gradeScore = Math.exp(-0.3 * minGradeDiff);
      }
      return gradeScore;
    }
  
    _calculateMatchScore(tutor, tutee) {

      const commonSubjects = new Set(
        [...tutee.subjects].filter((subject) => tutor.subject_pref.includes(subject))
      );

      // console.log("Tutee and tutor common: ", commonSubjects);

      const subjectScore = commonSubjects.size / tutee.subjects.length;
      // console.log("subject score: ", subjectScore)

      // TODO: implement availability stuff
      // const availabilityScore = 1 - tutor.current_tutees / tutor.max_tutees;
  
      const gradeScore = this._calculateGradeScore(tutor, tutee);
      const modeScore = this._calculateTutoringModeScore(tutor, tutee);
      const needsScore = this._calculateSpecialNeedsScore(tutor, tutee);
  
      return 0.4 * subjectScore + 0.3 * gradeScore + 0.5 * modeScore + 0.8 * needsScore;
    }
  }
