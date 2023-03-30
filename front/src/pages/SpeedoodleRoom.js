import React, { useState, useEffect } from 'react';

import { SpeedoodleWrapper } from '../styles/SpeedoodleEmotion';
import SpeedoodleUser from '../components/SpeedoodleUser';
import SpeedoodleGameInfo from '../components/SpeedoodleGameInfo';
import {
  SpeedoodleRoomContainer,
  GameInfoContainer,
} from '../styles/SpeedoodleRoomEmotion';
import { GameTitle } from '../styles/CommonEmotion';
import { H1, H2, H4, H5, P1, P2, SmText } from '../styles/Fonts';
import { colors } from '../styles/ColorPalette';
import ModalBasic from '../components/ModalBasic';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs'
import { noWait } from 'recoil';
import { API_URL } from '../config';

function SpeedoodleRoom() {
  const [isGameStart, setIsGameStart] = useState(false);
  const userImg =
    'http://t2.gstatic.com/licensed-image?q=tbn:ANd9GcRSM-bLdlw42S0tP6jHNppEhfDDU2nwKRL9UzKv7Mx6uOay9N4RsJLJmst9VIxAOckx';

  const room_id = 23;

  const defaultUser = [
    {
      userId: 'red',
      nickname: '행복한초코',
      profileImgUrl: userImg,
      leader: true,
    },
    {
      userId: 'black',
      nickname: '귀여운뽀삐',
      profileImgUrl: userImg,
      leader: false,
    },
    {
      userId: 'mint',
      nickname: '맹지니',
      profileImgUrl: userImg,
      leader: false,
    },
    {
      userId: 'pink',
      nickname: '인두목',
      profileImgUrl: userImg,
      leader: false,
    },
    {
      userId: 'yellow',
      nickname: '데이비드',
      profileImgUrl: userImg,
      leader: false,
    },
    {
      userId: 'blue',
      nickname: '쪼안나',
      profileImgUrl: userImg,
      leader: false,
    },
  ];

  const gameStartUser = [
    {
      userId: 'red',
      nickname: '행복한초코',
      profileImgUrl: userImg,
      leader: true,
      time: '00:23:58',
    },
    {
      userId: 'black',
      nickname: '귀여운뽀삐',
      profileImgUrl: userImg,
      leader: false,
      time: '00:27:28',
    },
    {
      userId: 'mint',
      nickname: '맹지니',
      profileImgUrl: userImg,
      leader: false,
      time: '00:21:53',
    },
    {
      userId: 'pink',
      nickname: '인두목',
      profileImgUrl: userImg,
      leader: false,
      time: '00:18:28',
    },
    {
      userId: 'yellow',
      nickname: '데이비드',
      profileImgUrl: userImg,
      leader: false,
      time: '00:19:22',
    },
    {
      userId: 'blue',
      nickname: '쪼안나',
      profileImgUrl: userImg,
      leader: false,
      time: '00:29:38',
    },
  ];

  const sock = new SockJS(`${API_URL}/speedoodle/room`);

  const stomp = Stomp.over(sock);

  const stompConnect = () => {
    try {

      stomp.connect({}, () => {
        stomp.subscribe(`/sub/${room_id}`,
        (message) => {
          console.log(message);
        }, {}
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  const stompDisconnect = () => {
    try {
      stomp.disconnect(() => {
        stomp.unsubscribe(`sub/${room_id}`);
      },{} );
    } catch (error) {

    }
  };

  const SendMessage = () => {
    // stomp.debug = null;
    const data = {
      roomId: 23,
      publisher: "mario",
      message: "testtesttest",
    };
    stomp.send("/pub/send",{}, JSON.stringify(data));
  };

  useEffect(() => {
    stompConnect();
  },[]);

  return (
    <>
      <SpeedoodleWrapper>
        <GameTitle>
          <H1
            color={colors.white}
            outline={colors.gameBlue500}
            outlineWeight={2}
            align='center'
          >
            SPEEDOODLE
          </H1>
        </GameTitle>
        <SpeedoodleRoomContainer>
          <SpeedoodleUser
            data={isGameStart ? gameStartUser : defaultUser}
          ></SpeedoodleUser>
          {isGameStart ? (
            <SpeedoodleGameInfo
              start={isGameStart}
              setIsGameStart={setIsGameStart}
            ></SpeedoodleGameInfo>
          ) : (
            <SpeedoodleGameInfo
              start={isGameStart}
              setIsGameStart={setIsGameStart}
              SendMessage={SendMessage}
            ></SpeedoodleGameInfo>
          )}
        </SpeedoodleRoomContainer>
      </SpeedoodleWrapper>
    </>
  );
}

export default SpeedoodleRoom;
