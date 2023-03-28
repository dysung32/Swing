import styled, { keyframes } from 'styled-components';
import { colors } from './ColorPalette';

export const GameContainer = styled.div`
  position: relative;
  padding: 1rem;
`;

export const RoundHeader = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${colors.gameBlue500};
`;

export const CanvasContainer = styled.div`
  width: 100%;
  height: 50vh;
  margin: 1rem 0;
  padding-top: 1rem;
  border-radius: 1.5rem;
  background-color: ${colors.white};
`;

export const Keyword = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: 1rem 0;
  background-color: ${colors.gamePink200};
  border-radius: 1rem;
  box-sizing: border-box;
`;

export const BtnContainer = styled.div`
  display: flex;
  justify-content: end;
`;

export const fadeIn = keyframes`
0%{
  opacity: 0.1;
}
50%{
  opacity: 1;
}
75%{
  opacity: 0.8;
}
100% {
  opacity: 0;
}`;

export const StartAlert = styled.div`
  font-size: 7vw;
  font-weight: bold;
  color: ${colors.gray100};
  text-shadow: -5px 0 ${colors.gameBlue500}, 0 5px ${colors.gameBlue500},
    5px 0 ${colors.gameBlue500}, 0 -5px ${colors.gameBlue500};
  position: absolute;
  top: 30%;
  left: 30%;
  animation: ${fadeIn} 1.5s ease-in-out 1 forwards;
`;
