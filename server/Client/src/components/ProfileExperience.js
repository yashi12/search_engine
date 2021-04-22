import React from 'react'
import PropTypes from 'prop-types'

const ProfileExperience = ({
                               experience: { company, title, to, from, current }
                           }) => {
    return (
        <div>
            <table class="table">
                <tbody>
                <tr>
                    <th>{company}</th>
                    <td>{title}</td>
                    <td>{from}</td>
                    <td >{ current ? <td> - </td> : <td>{to}</td>}</td>
                    <td class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="defaultCheck1" checked={current ? 'checked':''}></input>
                    </td>

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
