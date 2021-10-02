import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import { askQuestion } from '../action/question'
import PropTypes from 'prop-types'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const AskQuestion = ({askQuestion}) => {

    const [formData, setFormData] = useState({
        title: '',
        description:"",
        tags:"",
        category:""
    })
    const [image,setImage] = useState()
    const [title, setQuestion] = useState('')
    const [description, setDescription] = useState('')

    const onChange = e => setFormData({...formData, [e.target.id] : e.target.value})

    useEffect(() => {
        setFormData({...formData,"title":title,"description":description})
    }, [title,description])

    const onSubmit = e => {
        e.preventDefault()
        //setFormData({...formData,"text"[title})
        
        const data = new FormData();
        data.append("title",formData.title)
        data.append("description",formData.description)
        data.append("tags",formData.tags)
        data.append("category",formData.category)
        data.append("image",image);

        askQuestion(data)
    }

    return (
        <div className="row">
            <div className="col-3"></div>
            <div className="col-6">
                <br/><br/>
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={e => onSubmit(e)} id="add-post-form" encType="multipart/form-data">
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
                                <textarea onChange={e => onChange(e)} className="form-control" id="category" rows="3"></textarea>
                                </div>
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