import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { searchDoubt } from '../action/doubt';
import Spinner from './Spinner';
import Doubts from "./Doubts";
import { BiErrorCircle } from 'react-icons/bi'

const SearchDoubtByTag = ({ searchDoubt, doubt : {searchDoubtArr} , auth}) => {

	const [price, setPrice] = useState(0)

    const [tag, setTag] = useState('')

	useEffect(() => {
		searchDoubt(tag);
		axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr')
        .then((data)=>{
            setPrice(data.data.ethereum.inr)
        })
	}, [searchDoubt]);
	return (
		<div>
			{
				searchDoubtArr ? <Fragment>
						<br />
						<h1 className="large text-primary">Doubts you've asked</h1>
						<div >
							{
                                searchDoubtArr.length == 0 ? <div className="row">
                                <div className="col-4"></div>
                                <div className="col-6">
                                    <br /><br />
                                    <h4 className="text text-danger">NO DOUBTS ASKED <BiErrorCircle/></h4>
                                </div>
                                <div className="col"></div>
                                </div> :<div>Here</div>
                            }
							{/* passing data from get all question api to Questions component */}
							{searchDoubtArr.map((doubt) => (
								<Doubts key={doubt._id} doubt={doubt} price={price} />
							))}
						</div>
					</Fragment> :
					<Spinner />
			}
		</div>
	);
};

SearchDoubtByTag.propTypes = {
	searchDoubt: PropTypes.func.isRequired,
	searchDoubtArr: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	doubt: state.doubt,
	auth: state.auth
});

export default connect(mapStateToProps, { searchDoubt })(SearchDoubtByTag);
