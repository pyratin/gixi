import Application_ from './Component/Application_';
import style from './index.module.scss';

const Home = () => {
  return (
    <div className={['Home', style.Home].join(' ')}>
      <Application_></Application_>
    </div>
  );
};

export default Home;
