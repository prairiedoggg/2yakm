
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import loadable from '@loadable/component';

const Home = loadable(() => import('./components/home/Home'));
const News = loadable(() => import('./components/cardNews/News'));
const Search = loadable(() => import('./components/search/Search'));
const TagPage = loadable(() => import('./components/search/TagPage'));
const Calendar = loadable(() => import('./components/calendar/CalendarPage'));
const Alarm = loadable(() => import('./components/alarm/Alarm'));
const MyPage = loadable(() => import('./components/myPage/MyPage'));
const Login = loadable(() => import('./components/authentication/Login'));
const Register = loadable(() => import('./components/authentication/Register'));
const ResetPassword = loadable(
  () => import('./components/authentication/ResetPassword')
);
const ChatBot = loadable(() => import('./components/chatBot/ChatBot'));
import 'dayjs/locale/ko';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/news/:num' element={<News />} />
        <Route path='/search' element={<Search />} />
        <Route path='/search/tag/:tag' element={<TagPage />} />
        <Route path='/calendar' element={<Calendar />} />
        <Route path='/alarm' element={<Alarm />} />
        <Route path='/myPage' element={<MyPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/password/reset' element={<ResetPassword />} />
        <Route path='/chatbot' element={<ChatBot />} />
      </Routes>
    </Router>
  );
};

export default App;
