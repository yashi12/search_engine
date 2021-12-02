import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { BsArrowReturnRight } from 'react-icons/bs'

const Comments = ({id}) => {

    const [data, setData] = useState(null)

    {/* fetching the answer details using it's id to get comments on that answer */}
    useEffect(()=>{
        axios.get(`http://localhost:3000/api/answer/${id}`).then((res)=>{
            console.log(res.data.comments.comments)
            setData(res.data.comments.comments)
            //console.log(data.comments)
        }).catch((err)=>{
            console.log(err)
        })
    },[])

    var comment = data
    
    return (
        <div>
            <br />
            
            {
                data ?
                data.map((element)=>(
                    <p> <BsArrowReturnRight/> {element.text}</p>
                )) :
                <p>No comments</p>
            }
        </div>
    )
}

export default Comments