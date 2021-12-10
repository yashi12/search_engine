import React, {useState, useEffect} from 'react'
import { useHistory } from 'react-router'
import {connect} from 'react-redux'
import { updateQuestion, getQuestionDiscussion } from '../action/question'
import PropTypes from 'prop-types'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const UpdateQuestion = ({updateQuestion, question: {question}, getQuestionDiscussion, match}) => {

    useEffect(()=>{
        getQuestionDiscussion(match.params.id)
    }, [getQuestionDiscussion])

    const [formData, setFormData] = useState({
        title: '',
        description:"",
        tags:"",
        category:""
    })

    var tagList = ""
    question.result.tags.map((tag) => (
        tagList += tag + ", "
    ))

    const [image,setImage] = useState()
    const [title, setQuestion] = useState(question.result.title)
    const [description, setDescription] = useState(question.result.description)
    const [category, setCategory] = useState(question.result.category)
    const [tags, setTag] = useState(tagList)

    const onChangeCategory = e => setCategory(e.target.value)

    const onChangeTag = e => setTag(e.target.value)

    useEffect(() => {
        setFormData({...formData,"title":title,"description":description,"category":category,"tags":tags})
    }, [title,description,category,tags])

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

        // Redirecting to the question after updating
        updateQuestion(match.params.id,data,history)
        // history.push(`/question/${match.params.id}`)
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
                                <textarea onChange={e => onChangeTag(e)} value={tags} className="form-control" id="tags" rows="3"></textarea>
                                </div>
                                <div className="mb-3">
                                <label>Add Category</label>
                                <textarea onChange={e=>onChangeCategory(e)} value={category} className="form-control" id="category" rows="3"></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
                <br />
            </div>
        </div>
        
    )
}

UpdateQuestion.propTypes = {
    updateQuestion: PropTypes.func.isRequired,
    getQuestionDiscussion: PropTypes.func.isRequired,
    question: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    question: state.question
})

export default connect(mapStateToProps, {updateQuestion, getQuestionDiscussion})(UpdateQuestion)