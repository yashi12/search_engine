import React, { Fragment, useState,useEffect } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Questions from './Questions';
import { searchQuestions } from '../action/question';
import data from '../Data/data.json'
import './SearchBar.css'
import Fuse from 'fuse.js'

const SearchItem = ({ searchQuestions, question: { searchQuestionArr, loading }}) => {

    const [category, setCategory] = useState('')

    const fuse = new Fuse(data, {
	    keys: ['tagName']
    })

    useEffect(() => {
        searchQuestions();
        console.log("call get question");
    }, [searchQuestions]);

    const Submit = e => {
        console.log("call submit : ",wordEntered)
        e.preventDefault()
        searchQuestions(wordEntered);
        console.log("call get question");
    };

    const [filteredData, setFilteredData] = useState([]);
    const [wordEntered, setWordEntered] = useState("");

    const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const result = fuse.search(searchWord)
    const characterResults = result.map(character => character.item.tagName)

    if (searchWord === "") {
        setFilteredData([]);
    } else {
        setFilteredData(characterResults);
    }
    };

    return (
    <div className="container-fluid align-items-center">
        <div className="row">
            <div className="col-2"></div>
            <div className="col-4">
                <h1 className="large text-primary">Enter Category</h1>
                <br/>
                <form className="">
                    <input
                        type="text"
                        placeholder="Search"
                        value={wordEntered}
                        onChange={handleFilter}
                        className="form-control"
                    />
                    <br/>
                    <button className="btn btn-primary" onClick={e => Submit(e)}>Search</button>
                    {/* <div className="searchIcon">
                        {filteredData.length === 0 ? (
                        <p>Search</p>
                        ) : (
                        <button onClick={clearInput}>Clear</button>
                        )} 
                    </div>*/}
                </form>
                
            </div>
            <div className="col-4">
                {filteredData.length != 0 && (
                    <div className="dataResult">
                    {filteredData.slice(0, 25).map((value, key) => {
                        return (
                        <div className="dataItem" onClick={()=>setWordEntered(value)} >
                            <p>{value}</p>
                        </div>
                        );
                    })}
                    </div>
                )}
            </div>
            <div className="col-2"></div>
        </div>
        <div >
            { loading || searchQuestionArr === [] ? <div></div> : searchQuestionArr.map((question) => (
                <Questions key={question._id} question={question} />
            ))}
        </div>
    </div>
    );
}

SearchItem.propTypes = {
    searchQuestions: PropTypes.func.isRequired,
    question: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    question: state.question
});

export default connect(mapStateToProps, { searchQuestions })(SearchItem);