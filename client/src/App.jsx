import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Application from './pages/Application';
import ApplyJobs from './pages/ApplyJobs';
import RecruiterLogin from './components/RecruiterLogin';
import { useContext } from 'react';
import { AppContext } from './context/AppContext';
import Dashboard from './pages/Dashboard';
import AddJob from './pages/AddJob';
import ManageJobs from './pages/ManageJobs';
import ViewApplication from './pages/ViewApplication';
import 'quill/dist/quill.snow.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {

  const {showRecruiterLogin,companyToken} = useContext(AppContext)


  return (
    <>
    <div>
      {showRecruiterLogin && <RecruiterLogin />} 
      <ToastContainer />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/application' element={<Application />} />
      <Route path='/apply-jobs/:id' element={<ApplyJobs />} />
      <Route path='/dashboard' element={<Dashboard />}>
      {companyToken ? <>
      <Route path='add-job' element={<AddJob/>} />
      <Route path='manage-jobs'element={<ManageJobs/>} />
      <Route path='view-applications' element={<ViewApplication/> } />
      </> : null}

      </Route>
    </Routes>
    </div>

    </>
  )
}

export default App
