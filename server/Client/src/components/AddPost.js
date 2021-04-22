import React, {useState} from 'react'
import {connect} from 'react-redux'
import { addPost } from '../action/post'
import PropTypes from 'prop-types'

const AddPost = ({addPost}) => {

    const [formData, setFormData] = useState({
        text: '',
        title:""
    })

    const {text,title} = formData

    const onChange = e => setFormData({...formData, [e.target.id] : e.target.value})

    const onSubmit = e => {
        e.preventDefault()
        // setFormData({...formData, tags : tags.split(' ')})
        console.log("formdata",formData)
        console.log("text",text,"tags",title);
        addPost({text, title})
    }

    return (
        <div className="row">
            <div className="col-3"></div>
            <div className="col-6">
                <br/><br/>
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={e => onSubmit(e)}>
                            <div className="form-group">
                                {/*<div className="mb-3">*/}
                                {/*    <label for="formFile" className="form-label">Add Image</label>*/}
                                {/*    <input className="form-control" type="file" id="image"></input>*/}
                                {/*</div>*/}
                                <div className="mb-3">
                                    <label>Add Caption</label>
                                    <small>(Max 200 words)</small>
                                    <textarea onChange={e => onChange(e)} className="form-control" id="text" rows="3"></textarea>
                                </div>
                                <div className="mb-3">
                                <label>Add Tags</label>
                                <small>(Please don't add more than 30 tags)</small>
                                <textarea onChange={e => onChange(e)} className="form-control" id="title" rows="3"></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary">Post</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        
    )
}

AddPost.propTypes = {
    addPost: PropTypes.func.isRequired
}

export default connect(null, {addPost})(AddPost)
