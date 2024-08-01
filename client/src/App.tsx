import loadable from '@loadable/component';
import 'dayjs/locale/ko';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AuthenticatedRoute from './AuthenticatedRoute';

const Home = loadable(() => import('./components/home/Home'));
const News = loadable(() => import('./components/cardNews/News'));
const Search = loadable(() => import('./components/search/Search'));
const TagPage = loadable(() => import('./components/search/TagPage'));
const Calendar = loadable(() => import('./components/calendar/CalendarPage'));
const Alarm = loadable(() => import('./components/alarm/Alarm'));
const MyPage = loadable(() => import('./components/myPage/MyPage'));
const Login = loadable(() => import('./components/authentication/Login'));
const Register = loadable(() => import('./components/authentication/Register'));
const EmailVerification = loadable(
  () => import('./components/authentication/EmailVerification')
);
const ResetPasswordRequest = loadable(
  () => import('./components/authentication/ResetPasswordRequest')
);
const ResetPassword = loadable(
  () => import('./components/authentication/ResetPassword')
);
const ChatBot = loadable(() => import('./components/chatBot/ChatBot'));
const Redirect = loadable(() => import('./components/authentication/Redirect'));

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/news/:num' element={<News />} />
        <Route path='/search' element={<Search />} />
        <Route path='/search/tag/:tag' element={<TagPage />} />
        <Route
          path='/calendar'
          element={<AuthenticatedRoute element={Calendar} />}
        />
        <Route path='/alarm' element={<AuthenticatedRoute element={Alarm} />} />
        <Route
          path='/myPage'
          element={<AuthenticatedRoute element={MyPage} />}
        />
        <Route path='/login' element={<Login />} />
        <Route path='/verification/email' element={<EmailVerification />} />
        <Route path='/register' element={<Register />} />
        <Route
          path='/password/reset/request'
          element={<ResetPasswordRequest />}
        />
        <Route path='/password/reset' element={<ResetPassword />} />

        <Route
          path='/chatbot'
          element={<AuthenticatedRoute element={ChatBot} />}
        />
        <Route path='/kakao/callback' element={<Redirect sns='kakao' />} />
        <Route path='/naver/callback' element={<Redirect sns='naver' />} />
        <Route path='/google/callback' element={<Redirect sns='google' />} />
      </Routes>
    </Router>
  );
};

export default App;
