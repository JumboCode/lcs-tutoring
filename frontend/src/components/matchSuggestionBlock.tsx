"use client";

import TuteeSuggestionBox from "./tuteeSuggestionBox";

const MatchSuggestionBlock = () => {
    const boxProps = {
        first_name: "",
        last_name: "",
        email: "",
        subject: "",
        grade: "",
        special_needs: "",
        tutoring_mode: "",
    };

    return(
        <div>
            <TuteeSuggestionBox box_props={boxProps}/>
        </div>
    )
}

export default MatchSuggestionBlock;