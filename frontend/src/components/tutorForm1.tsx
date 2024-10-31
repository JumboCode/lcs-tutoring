export default function TutorForm1() {
    return (
        <div style={{paddingTop: '40px', backgroundColor: '#f9fafb', minHeight: '100vh'}}>
            <h1 className="text-center" style={{ fontSize: '2rem', fontWeight: 'bold' }}>Tutor Survey</h1>
            
            <div style={{
                backgroundColor: '#fff',
                padding: '30px',
                borderRadius: '8px',
                maxWidth: '1000px',
                margin: '40px auto',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                border: '1px solid #ddd'  // Add border to the container
            }}>

            <div style={{paddingTop: '40px', backgroundColor: 'white', padding: '20px'}}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'left', paddingBottom: '20px'}}>General Information</h2>
                <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column'}}>
                        <label for="firstName" style={{fontSize: '18px'}}>First Name </label>
                        <input type="text" id="firstName" name="firstName" placeholder="Enter a description..." required className="form_input"
                                style={{borderRadius: '8px', border: '1px solid #ddd', padding: '10px'}}/>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column'}}>
                        <label for="lastName" style={{fontSize: '18px'}}>Last Name </label>
                        <input type="text" id="lastName" name="lasttName" placeholder="Enter a description..." required
                                style={{borderRadius: '8px', border: '1px solid #ddd', padding: '10px'}}/>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column'}}>
                        <label for="pronouns" style={{fontSize: '18px'}}>Pronouns </label>
                        <input type="text" id="pronouns" name="pronouns" placeholder="Enter a description..." required
                                style={{borderRadius: '8px', border: '1px solid #ddd', padding: '10px'}}/>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column'}}>
                        <label for="studentId" style={{fontSize: '18px'}}>Student ID Number </label>
                        <input type="text" id="studentId" name="studentId" placeholder="Enter a description..." required
                                style={{borderRadius: '8px', border: '1px solid #ddd', padding: '10px'}}/>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column'}}>
                        <label for="major" style={{fontSize: '18px'}}>Major </label>
                        <input type="text" id="major" name="major" placeholder="Enter a description..." required
                                style={{borderRadius: '8px', border: '1px solid #ddd', padding: '10px'}}/>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column'}}>
                        <label for="gradYear" style={{fontSize: '18px'}}>Year of Graduation </label>
                        <input type="text" id="gradYear" name="gradYear" placeholder="Enter a description..." required
                                style={{borderRadius: '8px', border: '1px solid #ddd', padding: '10px'}}/>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column'}}>
                        <label for="number" style={{fontSize: '18px'}}>Phone No. </label>
                        <div style={{display: "flex", gap: '10px'}}>
                            <input type="number" id="numberCountryCode" name="numberCountryCode" placeholder="Country Code" required
                                    style={{borderRadius: '8px', border: '1px solid #ddd', width: '120px'}}/>
                            <input type="number" id="number" name="number" placeholder="Phone Number" required
                                    style={{borderRadius: '8px', border: '1px solid #ddd', padding: '10px', width:'300px'}}/>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column'}}>
                        <label for="email" style={{fontSize: '18px'}}>Email </label>
                        <input type="text" id="email" name="email" placeholder="Enter a description..." required
                                style={{borderRadius: '8px', border: '1px solid #ddd', padding: '10px'}}/>
                    </div>
                </form>
            </div>
        </div>

        <div style={{
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '8px',
                maxWidth: '1000px',
                margin: '40px auto',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                border: '1px solid #ddd'  // Add border to the container
            }}>

            <div style={{paddingTop: '40px', backgroundColor: 'white', padding: '20px'}}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'left', paddingBottom: '20px', padding: '10px'}}>LCS Tutee</h2>
                <form style={{ flexDirection: 'column', gap: '20px' }}>
                    
                <div style={{display: 'flex', flexDirection: 'column', padding: '10px'}}>
                    <label>Were you paired with a tutee last semester?</label>
                    <select required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
                        <option value="" disabled selected>Select an option</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>

                <div style={{display: 'flex', flexDirection: 'column', padding: '10px'}}>
                        <label>If you are continuing with a student(s) from last semester, please name them here</label>
                        <input type="text" placeholder="Enter a description..." style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}/> 
                </div>       
                
                <div style={{display: 'flex', flexDirection: 'column', padding: '10px'}}>
                <label>How many students do you want to tutor? (Not including the student if stated above)</label>
                <input
                    type="number"
                    placeholder="Insert a number"
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
                </div>

                <div style={{display: 'flex', flexDirection: 'column', padding: '10px'}}>
                <label>What grade levels are you comfortable working with?</label>
                <select required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
                    <option value="" disabled selected>Select an option</option>
                    <option value="elementary">Elementary</option>
                    <option value="middle">Middle School</option>
                    <option value="high">High School</option>
                    <option value="college">College</option>
                </select>
                </div>

                <div style={{display: 'flex', flexDirection: 'column', padding: '10px'}}>
                <label>Do you feel comfortable working with students with special needs (including but not limited to learning disabilities, ADD/ADHD, Autism, etc)? We will provide resources to assist while tutoring.</label>
                <div style={{ display: 'flex', gap: '10px', padding: '10px' }}>
                    <label>
                        <input type="radio" name="specialNeeds" value="yes" required /> Yes
                    </label>
                    <label>
                        <input type="radio" name="specialNeeds" value="no" /> No
                    </label>
                </div>
                </div>

                </form>
            </div>
            </div>
        </div>

        
    )
}