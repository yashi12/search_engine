import { Link } from 'react-router-dom'

const AccountDetails = () => {

    let details = {
        'Github':'abc',
        'Linked In':'hell',
        'twitter':'yoy',
        'bio':'none',
        'skills':'python',
        'experience':'5'
      }

    return (
        <div>
            <div class="row">
                <div class="col-3"></div>
                <div class="col-6 card">
                    
                    <br/><br/>
                    <div class="row">
                        <div class="col">
                            <h5>Github</h5>
                            <p>{details['Github']}</p>
                        </div>
                        <div class="col">
                            <h5>Linked In</h5>
                            <p>{details['Linked In']}</p>
                        </div>
                        
                        <div class="form-group">
                            <h5>Twitter</h5>
                            <p>{details['twitter']}</p>
                        </div>
                    </div>
                    <div class="form-group">
                        <h5 >Bio</h5>
                        <p>{details['bio']}</p>
                    </div>
                    <div class="form-group">
                        <h5 >Skills</h5>
                        <p>{details['skills']}</p>
                    </div>
                    <div class="form-group">
                        <h5 >Experience</h5>
                        <p>{details['experience']}</p>
                    </div>
                    <div className="row">
                        
                        <div className="col">
                        <Link to='/update'><button type="button" class="btn btn-primary">Update</button></Link>
                        </div>
                        <div className="col"></div>
                    </div>


                </div>
                
            </div>
            
        </div>
        
    )
}

export default AccountDetails
