import { Col, Row, Spin } from 'antd';

import { useAppSelector } from 'redux/hooks';
import { selectAuthState } from 'redux/reducers/auth';

import ProfileChangeInfo from './ChangeInfo';
import ProfileChangePW from './ChangePassword';

import * as SC from './style';

const Profile = () => {
  const { me, loadingUpdate, loadingChangePass } = useAppSelector(selectAuthState);

  return (
    <SC.Profile_Wrapper>
      <Spin spinning={!me?.id}>
        <Row gutter={[20, 20]}>
          <Col span={24} xl={16}>
            <ProfileChangeInfo data={me} loadingUpdate={loadingUpdate} />
          </Col>
          <Col span={24} xl={8}>
            <ProfileChangePW data={me} loadingChangePass={loadingChangePass} />
          </Col>
        </Row>
      </Spin>
    </SC.Profile_Wrapper>
  );
};
export default Profile;
