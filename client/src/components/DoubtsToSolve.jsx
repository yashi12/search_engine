import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getDoubtsToSolve } from '../action/doubt';
import Spinner from './Spinner';
import Doubts from "./Doubts";
import { BiErrorCircle } from 'react-icons/bi'

const DoubtsToSolve = ({ getDoubtsToSolve, doubt : {doubtsToSolve} , auth}) => {

	const [price, setPrice] = useState(0)

	useEffect(() => {
		getDoubtsToSolve();
		axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr')
        .then((data)=>{
            setPrice(data.data.ethereum.inr)
        })
	}, [getDoubtsToSolve]);
	return (
		<div>
			{
				doubtsToSolve ? <Fragment>
						<br />
						<h1 className="large text-primary">Doubts to solve</h1>
						<div >
                            {
                                doubtsToSolve.length == 0 ? <div className="row">
                                <div className="col-4"></div>
                                <div className="col-6">
                                    <br /><br />
                                    <h4 className="text text-danger">NO DOUBTS FOUND  <BiErrorCircle/></h4>
                                </div>
                                <div className="col"></div>
                                </div> :<div>Here</div>
                            }
							{/* passing data from get all question api to Questions component */}
							{doubtsToSolve.map((doubt) => (
								<Doubts key={doubt._id} doubt={doubt.Doubt[0]} price={price} />
							))}
						</div>
					</Fragment> :
					<Spinner />
			}
		</div>
	);
};

DoubtsToSolve.propTypes = {
	getDoubtsToSolve: PropTypes.func.isRequired,
	doubtsToSolve: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	doubt: state.doubt,
	auth: state.auth
});

export default connect(mapStateToProps, { getDoubtsToSolve })(DoubtsToSolve);
