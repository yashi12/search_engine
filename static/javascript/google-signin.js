googleSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then(function (result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const Http = new XMLHttpRequest();
            const token = result.credential.accessToken;
            console.log("token 1", token)
            // The signed-in user info.
            const user = result.user;
//             fetch('/google',{
//                 method:'POST',
//                 redirect:'/google'
//             })
            //     .then(res=>{
            //         console.log("send",res);
            //     })
            //     .catch(err=>{
            //         console.log(err);
            //     })
            console.log("user", user);
//            $.ajax({
//                type:'POST',
//                contentType:'application/json;charset-utf-08',
//                dataType:'json',
//                url:'http://localhost:5000/google?value='+token,
//                success:function (data) {
//                    var reply=data.reply;
//                    if (reply=="success")
//                    {
//                        location.href = '/';
//                        console.log("user inner", user);
//                        return;
//                    }
//                    else
//                    {
//                        alert("some error ocured in session agent")
//                    }
//
//                }
//            })
       Http.open('POST','http://localhost:5000/google');
       console.log("token",token)
        resp = Http.send(token);

            location.href = '/';
            console.log("user", user);

            // sessionStorage.setItem('idToken',token)
            // session['idToken'] = token;
//            console.log("session",session['idToken']);
//        location.href = '/';

            console.log("hello");
        })
        .catch(function (error) {
            // Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            const credential = error.credential;
        });
}

verifyPassword = () => {
    let pw = document.getElementByName("password").value;
    let cpw = document.getElementByName("confirmPassword").value;
    console.log("check");
    if (pw == "" || pw.length < 8) {
        console.log("wrong");
        document.getElementById("message").innerHTML = "**Password length must be atleast 8 characters";
    }
    if (pw != cpw) {
        document.getElementById("confirmMessage").innerHTML = "**Passwords do not match";
    }
}


searchGivenSkill = (title) => {
    document.getElementById("query").value = title;
    document.getElementById("searchQuery").click();
}
