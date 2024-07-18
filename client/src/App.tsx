/**
File Name : App
Description : app.tsx
Author : 민선옥

History
Date        Author   Status    Description
2024.07.16  민선옥   Created
2024.07.16  임지영   Modified    Home -> Main(메인페이지)   
2024.07.16  임지영   Modified    + News (카드뉴스)
2024.07.17  임지영   Modified    + Calendar 
2024.07.18  임지영   Modified    tsx
*/

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/home/Home';
// import Search from './components/search/Search';
import News from './components/cardNews/News';
import Calendar from './components/calendar/CalendarPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        {/* <Route path='/search' element={<Search />} /> */}
        <Route path='/news1' element={<News num={1} />} />
        <Route path='/news2' element={<News num={2} />} />
        <Route path='/news3' element={<News num={3} />} />
        <Route path='/calendar' element={<Calendar />} />
      </Routes>
    </Router>
  );
};

export default App;
