import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getDoubts } from '../action/doubt';
import Spinner from './Spinner';
import Doubts from "./Doubts";

const DoubtFeed = ({ getDoubts, doubt : {doubts}, auth}) => {

	const [price, setPrice] = useState(0)

	useEffect(() => {
		getDoubts();
		axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr')
        .then((data)=>{
            setPrice(data.data.ethereum.inr)
        })
	}, [getDoubts]);

	return (
		<div>
			{
				doubts ? <Fragment>
						<br />
						<h1 className="large text-primary">Doubts Feed</h1>
						<div >
							{/* passing data from get all question api to Questions component */}
							{doubts.map((doubt) => (
								<Doubts key={doubt._id} doubt={doubt} price={price} />
							))}
						</div>
					</Fragment> :
					<Spinner />
			}
		</div>


	);
};

DoubtFeed.propTypes = {
	getDoubts: PropTypes.func.isRequired,
	doubt: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	doubt: state.doubt,
	auth: state.auth
});

export default connect(mapStateToProps, { getDoubts })(DoubtFeed);
