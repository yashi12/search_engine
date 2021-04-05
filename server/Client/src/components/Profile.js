import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getCurrentProfile } from '../action/profile'
import { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import Spinner from '../components/spinner'


const Profile = ({getCurrentProfile,
     auth: { user }, 
     profile:{profile, loading}}) => {

    useEffect(() => {
        getCurrentProfile()
    }, [])

    let details = {
        'Github':user.name,
        'Linked In':'hell',
        'twitter':'yoy',
        'bio':'none',
        'skills':'python',
        'experience':'5'
      }

    return loading && profile === null ? <Spinner />:(<Fragment>
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
    </Fragment>)
    
}

Profile.prototype = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps, { getCurrentProfile })(Profile)
