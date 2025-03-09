declare class TutorMatcher {
    constructor();
    addTutor(tutor: any): void;
    addTutee(tutee: any): void;
    fetchMatches(): void;
    fetchData(): void;
    fetchTutors(): void;
    fetchTutees(): void;
    findMatches(): Array;
    _calculateGradeScore(tutor: any, tutee: any): number;
    _calculateMatchScore(tutor: any, tutee: any): number;
}

export default TutorMatcher;