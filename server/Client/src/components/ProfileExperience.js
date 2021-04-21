import React from 'react'
import PropTypes from 'prop-types'

const ProfileExperience = ({
    experience: { company, title, to, from }
  }) => {
    return (
        <div>
            <table class="table">
            <thead>
                <tr>
                <th scope="col">Company</th>
                <th scope="col">Designation</th>
                <th scope="col">Start</th>
                <th scope="col">End</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <th>{company}</th>
                <td>{title}</td>
                <td>{from}</td>
                <td>{to}</td>
                </tr>
            </tbody>
            </table>
        </div>
    )
}

ProfileExperience.propTypes = {
    experience: PropTypes.object.isRequired
};

export default ProfileExperience
