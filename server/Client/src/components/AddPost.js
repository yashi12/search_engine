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
        <div class="row">
            <div class="col-3"></div>
            <div class="col-6">
                <br/><br/>
                <div class="card">
                    <div class="card-body">
                        <form onSubmit={e => onSubmit(e)}>
                            <div class="form-group">
                                {/*<div class="mb-3">*/}
                                {/*    <label for="formFile" class="form-label">Add Image</label>*/}
                                {/*    <input class="form-control" type="file" id="image"></input>*/}
                                {/*</div>*/}
                                <div class="mb-3">
                                    <label>Add Caption</label>
                                    <small>(Max 200 words)</small>
                                    <textarea onChange={e => onChange(e)} class="form-control" id="text" rows="3"></textarea>
                                </div>
                                <div class="mb-3">
                                <label>Add Tags</label>
                                <small>(Please don't add more than 30 tags)</small>
                                <textarea onChange={e => onChange(e)} class="form-control" id="title" rows="3"></textarea>
                                </div>
                                <button type="submit" class="btn btn-primary">Post</button>
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
