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
2024.07.20  민선옥   Modified    + TagPage
*/

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/home/Home';
import News from './components/cardNews/News';
import Search from './components/search/Search';
import TagPage from './components/search/TagPage';
import Calendar from './components/calendar/CalendarPage';
import MyPage from './components/myPage/MyPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/news1' element={<News num={1} />} />
        <Route path='/news2' element={<News num={2} />} />
        <Route path='/news3' element={<News num={3} />} />
        <Route path='/search' element={<Search />} />
        <Route path='/search/tag/:tag' element={<TagPage />} />
        <Route path='/myPage' element={<MyPage />} />
        <Route path='/calendar' element={<Calendar />} />
      </Routes>
    </Router>
  );
};

export default App;
