import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Toast from './Toast'

const Alert = ({ alerts }) => alerts !== null && alerts.map(alert => 
    <div key={alert.id}>
        {/* <div key={alert.id} className={`alert alert-${alert.alertType}`}>
            {alert.msg}
        </div> */}
        <Toast alert={alert}/>
    </div>
    
);

Alert.propTypes = {
    alerts: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
    alerts: state.alert
})

export default connect(mapStateToProps)(Alert)
