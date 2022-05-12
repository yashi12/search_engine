import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { searchDoubt } from '../action/doubt';
import Spinner from './Spinner';
import Doubts from "./Doubts";
import { BiErrorCircle } from 'react-icons/bi'

const SearchDoubtByTag = ({ searchDoubt, doubt : {searchDoubtArr, loading} , auth}) => {

	const [price, setPrice] = useState(0)

    const [tag, setTag] = useState('')

    const [toggle, setToggle] = useState(false)

	useEffect(() => {
		searchDoubt(tag);
		axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr')
        .then((data)=>{
            setPrice(data.data.ethereum.inr)
        })
	}, [searchDoubt]);

    const onChange = e => setTag(e.target.value)

    const onSubmit = e => {
        e.preventDefault()
        searchDoubt(tag);
        setToggle(true)
    };

	return (
		<Fragment>
            <div className="container-fluid row align-items-center">
            
                <div className="col">
                <br/>
                <form className="bar" method="get" >
                    <div>
                        <h1 className="large text-primary">Enter Tag</h1>
                        <input onChange={e => onChange(e)} type="text" className="form-control" id="title" placeholder="Search Doubt" name="title"/>
                        <br/>
                        <button onClick={e => onSubmit(e)} type="submit" className="btn btn-primary" id="searchQuery">Search</button>
                    </div>
                </form>
                </div>
                <div className="col"/>
                <div className="col"/>
            </div>
            <div >
                { toggle ? 
                <div>
                    {searchDoubtArr.map((doubt) => (
                        <Doubts key={doubt._id} doubt={doubt} price={price} />
                    ))}
                </div> :
                <div>
                    </div>
                }
            </div>
        </Fragment>
	);
};

SearchDoubtByTag.propTypes = {
	searchDoubt: PropTypes.func.isRequired,
	searchDoubtArr: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
	doubt: state.doubt,
	auth: state.auth
});

export default connect(mapStateToProps, { searchDoubt })(SearchDoubtByTag);
