import './App.css';
import {BrowserRouter ,Switch , Route, Redirect} from "react-router-dom"
import Home from './pages/Home/Home';
import Navigation from './components/shared/Navigation/navigation';
import Authenticate from './pages/authenticate/Authenticate';
import ACtivate from './pages/activate/ACtivate';
import Rooms from './pages/Rooms/Rooms';
import Room from './pages/Room/Room';
import {useSelector} from 'react-redux';
import { useLoadingWithRefresh } from './hooks/useLoadingWithRefresh';
import Loader from './components/shared/Loader/Loader';
// const isAuth = false;
// const user ={
//   activated: false,
// }
function App() {
 const { loading } = useLoadingWithRefresh();
  return loading ?(
    <Loader message="Loading, please wait.."/>
  ) :(
    <BrowserRouter>
      <Navigation />
      <Switch>
        <GuestRoute path="/" exact>
            <Home />
        </GuestRoute>
        <GuestRoute path="/authenticate">
            <Authenticate />
        </GuestRoute>
        <SemiProtectedRoute path="/activate">
            <ACtivate />
        </SemiProtectedRoute>
        <ProtectedRoute path="/rooms">
            <Rooms />
        </ProtectedRoute>
        <ProtectedRoute path="/room/:id">
            <Room />
        </ProtectedRoute>
    </Switch>
</BrowserRouter>
  );
}


const GuestRoute = ({ children, ...rest }) => {
const { isAuth } = useSelector((state) => state.auth);
  return (
      <Route
          {...rest}
          render={({ location }) => {
              return isAuth ? (
                  <Redirect
                      to={{
                          pathname: '/rooms',
                          state: { from: location },
                      }}
                  />
              ) : (
                  children
              );
          }}
      ></Route>
  );
};

const SemiProtectedRoute = ({ children, ...rest }) => {
 const { user, isAuth } = useSelector((state) => state.auth);
  return (
      <Route
          {...rest}
          render={({ location }) => {
              return !isAuth ? (
                  <Redirect
                      to={{
                          pathname: '/',
                          state: { from: location },
                      }}
                  />
              ) : isAuth && !user.activated ? (
                  children
              ) : (
                  <Redirect
                      to={{
                          pathname: '/rooms',
                          state: { from: location },
                      }}
                  />
              );
          }}
      ></Route>
  );
};

const ProtectedRoute = ({ children, ...rest }) => {
  const { user, isAuth } = useSelector((state) => state.auth);
  return (
      <Route
          {...rest}
          render={({ location }) => {
              return !isAuth ? (
                  <Redirect
                      to={{
                          pathname: '/',
                          state: { from: location },
                      }}
                  />
              ) : isAuth && !user.activated ? (
                  <Redirect
                      to={{
                          pathname: '/activate',
                          state: { from: location },
                      }}
                  />
              ) : (
                  children
              );
          }}
      ></Route>
  );
};

export default App;
