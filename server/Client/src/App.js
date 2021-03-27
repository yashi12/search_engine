import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Navbar from './components/Navbar'
import Profile from './components/Profile'
import AccountDetails from './components/AccountDetails'
import Feed from './components/Feed'
import LogIn from './components/LogIn'
import Learn from './components/SearchBar'
import Register from './components/Register'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import React , { Fragment, useEffect } from 'react'
// Redux
import { Provider } from 'react-redux'
import store from './components/Store'
import Alert from './components/Alert'
import { loadUser } from './action/auth'
import setAuthToken from './utils/setAuthToken'


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
          <Route exact path="/" component={Profile}/>
          <section className="container-fluid">
            <Route exact path="/profile" component={Profile}/>
            <Route exact path="/update" component={AccountDetails}/>
            <Route exact path="/feed" component={Feed}/>
            <Alert />
            <Route exact path="/login" component={LogIn}/>
            <Route exact path="/register" component={Register}/>
            <Route exact path="/learn" component={Learn}/>
          </section>
        </Fragment>
      </Router>
    </Provider>
    
  );
}

export default App;
