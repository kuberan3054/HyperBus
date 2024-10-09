import '../App.css';
import Footer from './Footer';
import Header from './Header';
import Login from '../pages/Login';

function Home() {
  return (
    <div className="App">
      <Header/>
      <Login/>
      <Footer/>
    </div>
  );
}

export default Home;
