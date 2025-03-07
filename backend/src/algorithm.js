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
      // console.log(this.tutors);
      // console.log(this.tutees);
      // console.log("TUtees: ", this.tutees);
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
    const matches = [];
  
    // Group tutees by tutoring_mode
    const modeTuteeIndex = this.tutees.reduce((acc, tutee) => {
      if (!acc[tutee.tutoring_mode]) {
        acc[tutee.tutoring_mode] = [];
      }
      acc[tutee.tutoring_mode].push(tutee);
      return acc;
    }, {});
  
    for (const tutor of this.tutors) {
      // If tutor has reached their max capacity, skip
      tutor.currentTutees = tutor.currentTutees || 0;
      if (tutor.currentTutees >= tutor.maxTutees) continue;
  
      const eligibleTutees = modeTuteeIndex[tutor.tutoring_mode] || [];
  
      // Build an array of candidate matches with scores
      const candidateMatches = [];
      for (const tutee of eligibleTutees) {
        // Skip if tutee has special needs and tutor's disability preference conflicts
        if (tutee.has_special_needs && tutor.disability_pref) continue;
        const score = this._calculateMatchScore(tutor, tutee);
        candidateMatches.push({ tutee, score });
      }
  
      // Sort candidate matches by score descending
      candidateMatches.sort((a, b) => b.score - a.score);
  
      // Select the top 3 matches (or fewer if capacity is reached)
      let assignedCount = 0;
      let tuteeIds = [null, null, null];
      let tuteeIndex = 0;

      for (const candidate of candidateMatches) {
        if (assignedCount >= 3) break;
        if (tutor.currentTutees >= tutor.maxTutees) break;
  
        // matches.push({
        //   tuteeId: candidate.tutee.id,
        //   tutorId: tutor.id,
        //   matchScore: candidate.score,
        // });
        tuteeIds[tuteeIndex++] = candidate.tutee.id;
        tutor.currentTutees++;
        assignedCount++;
      }
      matches.push({
        tutorId: tutor.id, 
        tuteeId1: tuteeIds[0],
        tuteeId2: tuteeIds[1],
        tuteeId3: tuteeIds[2]});
    }
    console.log("Matches: ", matches);
    return matches;
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

      
      // console.log("Tutee subjects: ", tutee.subjects)
      const commonSubjects = new Set(
        [...tutee.subjects].filter((subject) => tutor.subject_pref.includes(subject))
      );
      // console.log("Tutee and tutor common: ", commonSubjects);
      const subjectScore = commonSubjects.size / tutee.subjects.length;
      // console.log("subject score: ", subjectScore)
      // TODO: implement availability stuff
      // const availabilityScore = 1 - tutor.current_tutees / tutor.max_tutees;
      const gradeScore = this._calculateGradeScore(tutor, tutee);
  
      return 0.4 * subjectScore + 0.2 * gradeScore;
    }
  }
  
  // const tutorMatcher = new TutorMatcher();
  // await tutorMatcher.fetchData();
  // await tutorMatcher.findMatches();