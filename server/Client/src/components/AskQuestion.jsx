import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import { addPost } from '../action/post'
import PropTypes from 'prop-types'
import Axios from 'axios'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const AskQuestion = ({addPost}) => {

    const [formData, setFormData] = useState({
        text: '',
        title:""
    })
    const [image,setImage] = useState()
    const [value, setValue] = useState('')

    const {text,title} = formData

    const onChange = e => setFormData({...formData, [e.target.id] : e.target.value})

    useEffect(() => {
        setFormData({...formData,"text":value})
    }, [value])

    const onSubmit = e => {
        e.preventDefault()
        //setFormData({...formData,"text":value})
        console.log("data",formData)
        const data = new FormData();
        data.append("text",formData.text);
        const tags = formData.title.split(',')
        tags.forEach(item => {
            data.append(
                "title",item
            ); });
        data.append("image",image);

        // Axios.post("https://httpbin.org/anything",data)
        //     .then(res =>console.log("res",res))
        //     .catch(err =>console.log("err",err))
        console.log("buffer",data);
        addPost(data)
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
                                    <ReactQuill theme="snow" value={value} onChange={setValue}/>
                                </div>
                                <div className="mb-3">
                                    <label>Description</label>
                                    <small>(Max 200 words)</small>
                                    {/* <textarea onChange={e => onChange(e)} className="form-control" id="text" rows="3"></textarea> */}
                                    <ReactQuill theme="snow" value={value} onChange={setValue}/>
                                </div>
                                <div className="mb-3">
                                <label>Add Tags</label>
                                <small>(Please don't add more than 30 tags)</small>
                                <textarea onChange={e => onChange(e)} className="form-control" id="title" rows="3"></textarea>
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
    addPost: PropTypes.func.isRequired
}

export default connect(null, {addPost})(AskQuestion)