import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Navbar from './components/Navbar'
import Profile from './components/Profile'
import AccountDetails from './components/AccountDetails'
import Feed from './components/Feed'
import LogIn from './components/LogIn'
import Learn from './components/SearchBar'
import Register from './components/Register'
import AddPost from './components/AddPost'
import PrivateRoute from './components/route/PrivateRoute'
import AddExperience from './components/AddExperience'
import ShowProfile from './components/ShowProfile'
import SearchPost from './components/SearchPost'
import SearchProfile from './components/SearchProfile'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import React , { Fragment, useEffect } from 'react'

// Redux
import { Provider } from 'react-redux'
import store from './components/Store'
import Alert from './components/Alert'
import { loadUser } from './action/auth'
import setAuthToken from './utils/setAuthToken'
import { addExperience } from './action/profile'


if (localStorage.token) {
  setAuthToken(localStorage.token)
}

function App() {

  useEffect(()=>{
    store.dispatch(loadUser())
  }, [])

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar/>
          <Route exact path="/" component={LogIn}/>
          <section className="container-fluid">
            <PrivateRoute exact path="/learn" component={Learn}/>
            <PrivateRoute exact path="/update" component={AccountDetails}/>
            <PrivateRoute exact path="/feed" component={Feed}/>
            <PrivateRoute exact path="/searchPost" component={SearchPost}/>
            <PrivateRoute exact path="/searchProfile" component={SearchProfile}/>
            <PrivateRoute exact path="/showProfile" component={ShowProfile}/>
            <Alert />
            <Switch>
              <Route exact path="/login" component={LogIn}/>
              <Route exact path="/register" component={Register}/>
              <PrivateRoute exact path="/profile" component={Profile}/>
              <PrivateRoute exact path="/addPost" component={AddPost}/>
              <PrivateRoute exact path="/addExperience" component={AddExperience}/>
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
    
  );
}

export default App;
