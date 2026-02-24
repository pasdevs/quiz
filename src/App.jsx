import React from 'react';
import { BrowserRouter, Route, Routes, Navigate} from 'react-router-dom'
import Quiz from './pages/Quiz';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/quiz" exact element={<Quiz />} />
        <Route path="*" element={<Navigate replace to="/quiz" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

