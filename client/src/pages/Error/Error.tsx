import { Link } from 'react-router-dom';
import { Result, Button } from 'antd';
import { FrownOutlined } from '@ant-design/icons';
import styles from './Error.module.scss';

const Error = () => {
  return (
    <div className={styles.ErrorPage}>
      <Result
        icon={<FrownOutlined />}
        title='404'
        status='error'
        subTitle='Sorry, the page you visited does not exist.'
        extra={
          <Link to='/'>
            <Button type='primary'>Back Home</Button>
          </Link>
        }
      />
    </div>
  );
};

export default Error;
