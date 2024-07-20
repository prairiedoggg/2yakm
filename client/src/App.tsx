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
2024.07.21  민선옥   Modified    동적 라우팅으로 변경
*/

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import loadable from '@loadable/component';

const Home = loadable(() => import('./components/home/Home'));
// const News = loadable(() => import('./components/cardNews/News'));
const Search = loadable(() => import('./components/search/Search'));
const TagPage = loadable(() => import('./components/search/TagPage'));
const Calendar = loadable(() => import('./components/calendar/CalendarPage'));
const Alarm = loadable(() => import('./components/alarm/Alarm'));
const MyPage = loadable(() => import('./components/myPage/MyPage'));
import 'dayjs/locale/ko';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        {/* <Route path='/news/:num' element={<News />} /> */}
        <Route path='/search' element={<Search />} />
        <Route path='/search/tag/:tag' element={<TagPage />} />
        <Route path='/calendar' element={<Calendar />} />
        <Route path='/alarm' element={<Alarm />} />
        <Route path='/myPage' element={<MyPage />} />
      </Routes>
    </Router>
  );
};

export default App;
