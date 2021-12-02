import React, { Fragment, useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Questions from './Questions';
import { searchQuestions } from '../action/question';
import { SearchItem } from './SearchItem';
import data from '../Data/file.json'
import './SearchBar.css'

const SearchQuestionByCategory = ({ searchQuestions, question: { searchQuestionArr }}) => {
    useEffect(() => {
        searchQuestions();
        console.log("call get question");
    }, [searchQuestions]);

    const onSubmit = e => {
        console.log("call submit",category)
        e.preventDefault()
        searchQuestions(category.title);
        console.log("call get question");
    };

    // handling the list appearing on the left with results from fuzzy
    const [filteredData, setFilteredData] = useState([]);
    const [wordEntered, setWordEntered] = useState("");
    const [category, setCategory] = useState('')

    const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    setCategory(searchWord)
    const newFilter = data.filter((value) => {
        return value.tagName.toLowerCase().includes(searchWord.toLowerCase());
    });

    if (searchWord === "") {
        setFilteredData([]);
    } else {
        setFilteredData(newFilter);
    }
    };

    //const onChange = e => setTopic({ ...category,[e.target.id]: e.target.value })

    return (
        <Fragment>
            <div className="container-fluid row align-items-center">
            
                <div className="col">
                <br/>
                <form className="bar" method="get" >
                    <div>
                        <h1 className="large text-primary">Enter Category</h1>
                        <input value={wordEntered}
                        onChange={handleFilter} type="text" className="form-control" id="title" placeholder="Search Question"/>
                        <br/>
                        <button onClick={e => onSubmit(e)} type="submit" className="btn btn-primary" id="searchQuery">Search</button>
                    </div>
                </form>
                {filteredData.length != 0 && (
                    <div className="dataResult">
                        {filteredData.slice(0, 15).map((value, key) => {
                        return (
                            <p onClick={setCategory(value.tagName)}>{value.tagName} </p>
                            
                        );
                        })}
                    </div>
                )}
                </div>
                <div className="col"/>
                <div className="col"/>
                
            </div>
            {/* <p className="text-primary">jasdjkansk</p>
            <SearchItem data={Data}/> */}
            <div >
                {searchQuestionArr.map((question) => (
                    <Questions key={question._id} question={question} />
                ))}
            </div>
        </Fragment>
    );
};

SearchQuestionByCategory.propTypes = {
    searchQuestions: PropTypes.func.isRequired,
    question: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    question: state.question
});

export default connect(mapStateToProps, { searchQuestions })(SearchQuestionByCategory);