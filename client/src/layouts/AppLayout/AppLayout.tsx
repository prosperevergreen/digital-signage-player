import { Layout, Col, Row } from 'antd';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';

import AppLogo from '../../components/AppLogo/AppLogo';
import { ROUTES } from '../../common/contants';

import style from './AppLayout.module.scss';

const { Header, Content, Footer } = Layout;

const AppLayout = () => {
  return (
    <Layout className={style.AppLayout}>
      <Header>
        <Row justify='center' align='top'>
          <Col xs={22}>
            <Link to={ROUTES.HOME}>
              <AppLogo />
            </Link>
          </Col>
        </Row>
      </Header>
      <Layout>
        <Content>
          <Row justify='center'>
            <Col xs={22} sm={20} md={16} lg={14} xl={12}>
              <Outlet />
            </Col>
          </Row>
        </Content>
      </Layout>
      <Footer className='app-footer'>Copyright © 2023. Made with ❤ by Prosper Evergreen</Footer>
    </Layout>
  );
};

export default AppLayout;
