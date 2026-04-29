import { Outlet } from 'react-router';

import style from './index.module.scss';

const Route_ = () => {
  return (
    <div className={['Route_', style.Route_].join(' ')}>
      <Outlet />
    </div>
  );
};

export default Route_;
