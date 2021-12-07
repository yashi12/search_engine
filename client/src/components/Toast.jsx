import React, { useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';

const Toast = ({alert}) => {

    useEffect(()=>{
        if(alert.alertType === 'success'){
            toast.success(`${alert.msg}`,{position:'top-right',autoClose: 3000})
        }
        else if(alert.alertType === 'danger'){
            toast.error(`${alert.msg}`,{position:'top-right',autoClose: 3000})
        }
        else if(alert.alertType === 'warning'){
            toast.warning(`${alert.msg}`,{position:'top-right',autoClose: 3000})
        }
        // else{
        //     toast(`${alert.msg}`,{position:'top-right',autoClose: 3000})
        // }
        
    },[])
    
    return (
        <div>
        <ToastContainer position="top-right" closeOnClick autoClose={3000}/>
      </div>
    )
}

export default Toast