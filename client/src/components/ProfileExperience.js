import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment';

const ProfileExperience = ({experience: { company, title, to, from, current }}) => {
    return (

            <tbody>
                <tr>
                    <td><b>{company}</b></td>
                    <td>{title}</td>
                    <td><Moment format="YYYY/MM/DD" date={from}  /></td>
                    <td >{ current ?  <p> - </p>  : <Moment format="YYYY/MM/DD" date={to}/>}</td>
                    <td className="form-check" style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" readOnly checked={current ? 'checked' : ''}/>
                    </td>
                </tr>
            </tbody>

    )
}

ProfileExperience.propTypes = {
    experience: PropTypes.object.isRequired
};

export default ProfileExperience
