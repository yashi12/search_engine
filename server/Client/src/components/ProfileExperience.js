import React from 'react'
import PropTypes from 'prop-types'

const ProfileExperience = ({
                               experience: { company, title, to, from, current }
                           }) => {
    return (
        <div>
            <table className="table">
                <tbody>
                <tr>
                    <th>{company}</th>
                    <td>{title}</td>
                    <td>{from}</td>
                    <td >{ current ? <td> - </td> : <td>{to}</td>}</td>
                    <td className="form-check">
                        <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" checked={current ? 'checked':''}></input>
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
