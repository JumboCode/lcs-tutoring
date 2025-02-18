/**
 * @typedef {Object} Tutor
 * @property {string} id
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} phone
 * @property {string} email
 * @property {string[]} subject
 * @property {number[]} grade_level_pref
 * @property {boolean} disability_pref
 * @property {string} tutoring_mode
 */
class TutorMatcher {
  url = "http://localhost:3000";
  constructor() {
    /**
     * @type {Tutor[]}
     */
    this.tutors = [];
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
    console.log(this.tutors);
    console.log(this.tutees);
  }

  async fetchTutors() {
    console.log("fetching tutors");
    const response = await fetch(`${this.url}/unmatched-tutors`);
    const {unmatchedTutors} = await response.json();
    for (const unmatchedTutor of unmatchedTutors) {
      this.addTutor(unmatchedTutor.tutor);
    }
  }


  async fetchTutees() {
    console.log("fetching tutees");
    const response = await fetch(`${this.url}/unmatched-tutees`);
    const {unmatchedTutees} = await response.json();
    for (const unmatchedTutee of unmatchedTutees) {
      this.addTutee(unmatchedTutee.tutee);
    }
  }

  findMatches() {
    const matches = [];
    const sortedTutees = [...this.tutees].sort(
      (a, b) => b.disability_pref - a.disability_pref
    );
    const modeTutorIndex = this.tutors.reduce((acc, tutor) => {
      if (!acc[tutor.tutoring_mode]) {
        acc[tutor.tutoring_mode] = [];
      }
      acc[tutor.mode].push(tutor);
      return acc;
    }, {});

    for (const tutee of sortedTutees) {
      let bestMatch = null;
      let bestScore = -1;
      const eligibleTutors = modeTutorIndex[tutee.mode] || [];

      for (const tutor of eligibleTutors) {
        if (tutee.specialNeeds && !tutor.specialNeedsCertified) continue;
        if (tutor.currentTutees >= tutor.maxTutees) continue;

        const score = this._calculateMatchScore(tutor, tutee);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = tutor;
        }
      }

      if (bestMatch) {
        matches.push({
          tuteeId: tutee.id,
          tutorId: bestMatch.id,
          matchScore: bestScore,
        });
        bestMatch.currentTutees += 1;
      }
    }

    return matches;
  }

  _calculateGradeScore(tutor, tutee) {
    let gradeScore = 0;
    if (tutor.gradeLevels.has(tutee.gradeLevel)) {
      gradeScore = 1;
    } else {
      const minGradeDiff = Math.min(
        ...Array.from(tutor.gradeLevels).map((grade) =>
          Math.abs(grade - tutee.gradeLevel)
        )
      );
      gradeScore = Math.exp(-0.3 * minGradeDiff);
    }
    return gradeScore;
  }

  _calculateMatchScore(tutor, tutee) {
    const commonSubjects = new Set(
      [...tutee.subjects].filter((subject) => tutor.subjects.has(subject))
    );
    const subjectScore = commonSubjects.size / tutee.subjects.size;
    const availabilityScore = 1 - tutor.currentTutees / tutor.maxTutees;
    const gradeScore = this._calculateGradeScore(tutor, tutee);

    return 0.4 * subjectScore + 0.2 * availabilityScore + 0.4 * gradeScore;
  }
}

const tutorMatcher = new TutorMatcher();
tutorMatcher.fetchData();

