import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import WishList from './pages/WishList/wishList'
import Styles from './pages/Styles/styles'
import Discounts from './pages/Discounts/discounts'

export interface CheckedItemsProps {
  checkedItems: any[]
  setCheckedItems: React.Dispatch<React.SetStateAction<any[]>>
}

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<WishList />} />
        <Route path="/styles" element={<Styles />} />
        <Route path="/discounts" element={<Discounts />} />
      </Routes>
    </Router>
  )
}

export default App
