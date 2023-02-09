import { Link } from 'react-router-dom';
import { Result, Button } from 'antd';

import AppLogo from '../../components/AppLogo/AppLogo';

import style from './Welcome.module.scss';

const Welcome = () => {
  return (
    <div className={style.WelcomePage}>
      <Result
        icon={<AppLogo />}
        title='Enjoy the experience.'
        extra={
          <Link to='/playlists'>
            <Button type='primary'>Playlists</Button>
          </Link>
        }
      />
    </div>
  );
};

export default Welcome;
