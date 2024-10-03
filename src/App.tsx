import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WishList from './pages/WishList/wishList';
import Styles from './pages/Styles/styles';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<WishList />} />
      <Route path="/styles" element={<Styles />} /> {/* 이동할 페이지 경로 */}
      </Routes>
    </Router>
    // <WishList />
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
