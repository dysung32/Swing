import React, { useState } from 'react';

import { UserInfoContainer, UserInfo } from '../styles/SpeedoodleUserEmotion';
import { PlayerInfo, PlayerProfile } from '../styles/CommonEmotion';
import { P1 } from '../styles/Fonts';
import { colors } from '../styles/ColorPalette';

function SpeedoodleUser(props) {
  // props에 axios주소값 넘겨주고 거기서 받아온 user를 map으로 띄워줌

  // props값 없어서 더미 넘겨줌

  const gameUsers = props.data;
  const userInfo = gameUsers.map((user, idx) => (
    <UserInfo
      key={user.userId}
      border={idx !== gameUsers.length - 1 ? `${colors.gameBlue500}` : false}
    >
      <PlayerInfo>
        <PlayerProfile
          src={user.profileImgUrl}
          alt='user image'
          width='2.5'
          height='2.5'
        />
        <P1 margin='0 0 0 1rem' color={colors.gameBlue500}>
          {user.nickname}
        </P1>
      </PlayerInfo>
      {user.time && <P1>{user.time}</P1>}
    </UserInfo>
  ));
  return (
    <>
      {/* <UserInfoContainer>{props.children}</UserInfoContainer> */}
      <UserInfoContainer>{userInfo}</UserInfoContainer>
    </>
  );
}

export default SpeedoodleUser;
