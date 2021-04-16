import React, {useState} from 'react'
import {connect} from 'react-redux'
import { addPost } from '../action/post'

const AddPost = () => {

    const [text, setText] = useState({
        caption: '',
        tags: []
    })

    return (
        <div class="row">
            <div class="col-3"></div>
            <div class="col-6">
                <br/><br/>
                <div class="card">
                    <div class="card-body">
                        <form onSubmit={e => {
                            e.preventDefault()
                            addPost({text})
                            setText('')
                        }}>
                            <div class="form-group">
                                <div class="mb-3">
                                    <label for="formFile" class="form-label">Add Image</label>
                                    <input class="form-control" type="file" id="formFile"></input>
                                </div>
                                <div class="mb-3">
                                    <label>Add Caption</label>
                                    <small>(Max 200 words)</small>
                                    <textarea onClick={e => setText({...text, caption:e.target.value})} class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                                </div>
                                <div class="mb-3">
                                <label>Add Tags</label>
                                <small>(Please don't add more than 30 tags)</small>
                                <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
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
