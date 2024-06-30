import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import Home from './components/pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Services from './components/pages/Services';
import Trivia from './components/pages/Trivia';
import SignUp from './components/pages/SignUp';
import WatchList from './components/pages/WatchList';
import ContentRecco from './components/pages/ContentRecco';
import Following from './components/pages/Following';
import DiscussionForum from './components/pages/DiscussionForum';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' exact element={<Home />} />
          <Route path= '/discussionforum' element ={<DiscussionForum />} />
          <Route path= '/watchlist' element ={<WatchList />} />
          <Route path= '/contentrecco' element ={<ContentRecco />} />
          <Route path='/trivia' element ={<Trivia />} />
          <Route path='/following' element={<Following />} />
          <Route path='/sign-up' element={<SignUp />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
