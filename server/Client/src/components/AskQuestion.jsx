import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import { askQuestion } from '../action/question'
import { useHistory } from 'react-router'
import PropTypes from 'prop-types'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import data from '../Data/data.json'
import './SearchBar.css'
import Fuse from 'fuse.js'
import { GrAdd } from 'react-icons/gr'

const AskQuestion = ({askQuestion}) => {

    const [Category, setCategory] = useState('')

    const fuse = new Fuse(data, {
	    keys: ['tagName']
    })

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

    //console.log(Category)

    const [formData, setFormData] = useState({
        title: '',
        description:"",
        tags:"",
        category:""
    })
    const [image,setImage] = useState(null)
    const [title, setQuestion] = useState('')
    const [description, setDescription] = useState('')

    const onChange = e => setFormData({...formData, [e.target.id] : e.target.value})

    // adding the selected category to the list of category
    const Add = () => {
        if (Category.length === 0){
            setCategory(Category.concat(wordEntered))
        }
        else {
            setCategory(Category.concat(",",wordEntered))
        }
        setFormData({...formData, "category": Category})
        //console.log(formData)
    }

    useEffect(() => {
        setFormData({...formData,"title":title,"description":description, "category": Category})
        //setFormData({...formData, "category": Category})
    }, [title,description,Category])

   
    const history = useHistory()

    const onSubmit = e => {
        e.preventDefault()
        //setFormData({...formData,"text"[title})
        
        const data = new FormData();
        data.append("title",formData.title)
        data.append("description",formData.description)
        data.append("tags",formData.tags)
        data.append("category",formData.category)
        data.append("media",image);
        console.log(formData)
        //askQuestion(data)
    }

    return (
        <div className="row">
            <div className="col-3"></div>
            <div className="col-6">
                <br/>
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={e => onSubmit(e)} id="add-post-form" encType="multipart/form-data">
                            {/* Taking inputs */}
                            <div className="form-group">
                                <div className="mb-3">
                                    <label for="formFile" className="form-label">Add Image</label>
                                    <input onChange={e => {
                                        const file = e.target.files[0];
                                        setImage(file);
                                    }
                                    } className="form-control" type="file" id="image"></input>
                                </div>
                                <div className="mb-3">
                                    <label>Question</label>
                                    <small>(Max 200 words)</small>
                                    {/* <textarea onChange={e => onChange(e)} className="form-control" id="text" rows="3"></textarea> */}
                                    <ReactQuill theme="snow" value ={title} onChange={setQuestion}/>
                                </div>
                                <div className="mb-3">
                                    <label>Description</label>
                                    <small>(Max 200 words)</small>
                                    {/* <textarea onChange={e => onChange(e)} className="form-control" id="text" rows="3"></textarea> */}
                                    <ReactQuill theme="snow" value = {description} onChange={setDescription}/>
                                </div>
                                <div className="mb-3">
                                    <label>Add Tags</label>
                                    <small>(Please don't add more than 30 tags)</small>
                                    <textarea onChange={e => onChange(e)} className="form-control" id="tags" rows="3"></textarea>
                                </div>
                                <div className="mb-3">
                                    <label>Add Category</label>
                                    <small>(Please don't add more than 30 categories)</small>
                                    <input
                                        type="text"
                                        value={wordEntered}
                                        onChange={handleFilter}
                                        className="form-control"
                                    />
                                </div>
                                <div className="mb-3">
                                    <button className="btn btn-primary" onClick={()=>Add()}><GrAdd  /></button>
                                </div>
                                {/* displaying the category list */}
                                {
                                    formData.category.length === 0 ? <p></p> : <p>Category : {formData.category}</p>
                                }
                                {/* displaying the list using fuzzy */}
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
                                {filteredData.length != 0 ? <br/> : <div></div>}
                                <button type="submit" className="btn btn-primary">Ask</button>
                            </div>
                        </form>
                    </div>
                </div>
                <br />
            </div>
        </div>
        
    )
}

AskQuestion.propTypes = {
    askQuestion: PropTypes.func.isRequired
}

export default connect(null, {askQuestion})(AskQuestion)