import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  MyPageWrapper,
  MyPageContentContainer,
  MyPageMainConatiner,
  MyPageSideConatiner,
  MyPageProfileConatiner,
  MyPageIntroConatiner,
  MyPageHistoryConatiner,
  HistoryHeader,
  MyPageHistoryList,
  FileInput,
  MyPageProfileNickname,
  MyPageProfileCoupon,
  CouponImg,
  MyPageProfile,
  NickNameEditBox,
  EditBtnBox,
  FilePreview,
} from "../styles/MyPageEmotion";
import MyPageSwing from "../assets/mypage_swing.png";
import Coupon from "../assets/coupon.svg";
import { GameTitle, CommonBtn } from "../styles/CommonEmotion";
import { H1, H2, H3, H5, H6, P1 } from "../styles/Fonts";
import { colors } from "../styles/ColorPalette";

import { PencilSquare } from "react-bootstrap-icons";
import ModalClosable from "../components/ModalClosable";
import { API_URL, BasicProfile } from "../config";
import axios from "axios";
import { SingleHistoryList } from "../styles/HistoryEmotion";

function MyPage() {
  const navigate = useNavigate();

  const nickNameRef = useRef();
  const fileInput = useRef(null);

  const [nickname, setNickname] = useState("");
  const [nicknameRegExpTest, setNicknameRegExpTest] = useState();
  const [confirmed, setConfirmed] = useState(false);
  const [allowedMsg, setAllowedMsg] = useState(
    "올바른 형식의 닉네임입니다. 중복 확인을 진행해주세요."
  );

  const [tmpProfileImg, setTmpProfileImg] = useState(BasicProfile);
  const [imgChanged, setImgChanged] = useState(false);
  const tmpnickName = "Player1";

  const [userId, setUserId] = useState("black");
  const coupon = 3;
  const historyList = [
    {
      date: "2023.03.01",
      title: "나랑 같이 놀 사람",
      rank: 2,
    },
    {
      date: "2023.03.02",
      title: "공부합시다",
      rank: 3,
    },
    {
      date: "2023.03.03",
      title: "놀자아",
      rank: 1,
    },
    {
      date: "2023.03.05",
      title: "A405",
      rank: 2,
    },
    {
      date: "2023.03.07",
      title: "SSAFY 8기",
      rank: 1,
    },
    {
      date: "2023.03.07",
      title: "SSAFY 8기",
      rank: 1,
    },
    {
      date: "2023.03.07",
      title: "SSAFY 8기",
      rank: 1,
    },
  ];

  const [profileEditModalShow, setProfileEditModalShow] = useState(false);

  useEffect(() => {
    setNickname(tmpnickName);
  }, []);

  const renderList = historyList.map((history, idx) => {
    return (
      <SingleHistoryList
        key={idx}
        onClick={() =>
          navigate(`/history/${idx}`, {
            state: { date: history.date, rank: history.rank },
          })
        }>
        <div className="history-date">{history.date}</div>
        <div className="history-title">{history.title}</div>
        <div className="history-rank">{history.rank}등</div>
      </SingleHistoryList>
    );
  });

  const changeNickname = () => {
    setAllowedMsg("올바른 형식의 닉네임입니다. 중복 확인을 진행해주세요.");
    const changedNickname = nickNameRef.current.value;
    console.log(changedNickname);
    const regExp = /^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ]{2,30}$/g;
    if (regExp.test(changedNickname)) {
      console.log("유효성 검사 통과");
      setNicknameRegExpTest(true);
    } else {
      console.log("유효성 검사 통과 실패");
      setConfirmed(false);
      setNicknameRegExpTest(false);
    }
  };

  const handleNickNameConfirm = async () => {
    await axios
      .get(`${API_URL}/user/nickname/${nickNameRef.current.value}`, {
        headers: {
          "Access-Token":
            "Ry7rohoVUjw3GA5W1GC3DaJ5Rzfec8-S2SHOE8xcnlh-VbeDGJr-Hu4t2mN2LuE-3nzucAo9cuoAAAGHLCzlKw&state=8_bprj_QaKc6mIzvlC972kiYByGkGAQT8ym9hvYNl9A%3D",
        },
      })
      .then((res) => {
        console.log(res);
        if (res.data.possible) {
          setConfirmed(true);
          setAllowedMsg("사용 가능한 닉네임입니다 (O)");
        } else {
          setConfirmed(false);
        }
      });
  };

  const handleProfileEdit = async () => {
    const formData = new FormData();

    const userInfo = {
      userId: userId,
      nickname: nickname,
      defaultImage: false,
    };

    // 닉네임의 변경이 있을 때
    if (tmpnickName !== nickNameRef.current.value) {
      // 닉네임 중복확인 완료 시
      if (confirmed) {
        // formData에 넣을 nickname 변경
        userInfo.nickname = nickNameRef.current.value;
        console.log("중복확인 완료됐으니 프로필 변경 axios 호출 go");
        console.log(tmpProfileImg);
        // 사진 변경이 있을 때
        if (imgChanged) {
          console.log("닉네임 변경 O 사진 변경 O");
          // 기본이미지로 변경했을 때
          if (tmpProfileImg === BasicProfile) {
            userInfo.defaultImage = true;
            const dump = {};
            formData.append(
              "image",
              new Blob([JSON.stringify(dump)], { type: "application/json" })
            );
          }
          // 다른 이미지로 변경했을 때
          else {
            formData.append("image", fileInput.current.files[0]);
          }
          formData.append(
            "modifyDto",
            new Blob([JSON.stringify(userInfo)], { type: "application/json" })
          );

          console.log(fileInput.current.files[0]);
        }
        // 사진 변경이 없을 때
        else {
          console.log("닉네임 변경 O 사진 변경 X");
          const dump = {};
          formData.append(
            "image",
            new Blob([JSON.stringify(dump)], { type: "application/json" })
          );
          formData.append(
            "modifyDto",
            new Blob([JSON.stringify(userInfo)], { type: "application/json" })
          );
        }
      }
      // 닉네임 중복확인 미완료 시
      else {
        alert("닉네임 중복확인은 필수입니다!");
        return;
      }
    } else {
      // 닉네임 변경이 없을 때
      // 사진 변경이 있을 때
      if (imgChanged) {
        console.log("닉네임 변경 X 사진 변경 O");
        // 기본이미지로 변경했을 때
        if (tmpProfileImg === BasicProfile) {
          const dump = {};
          userInfo.defaultImage = true;
          formData.append(
            "image",
            new Blob([JSON.stringify(dump)], { type: "application/json" })
          );
        }
        // 다른 이미지로 변경했을 때
        else {
          formData.append("image", fileInput.current.files[0]);
        }
        formData.append(
          "modifyDto",
          new Blob([JSON.stringify(userInfo)], { type: "application/json" })
        );
      }
      // 사진 변경이 없을 때
      else {
        alert("변경된 정보가 없습니다!");
        return;
      }
    }
    await axios
      .put(`${API_URL}/user`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Access-Token":
            "Ry7rohoVUjw3GA5W1GC3DaJ5Rzfec8-S2SHOE8xcnlh-VbeDGJr-Hu4t2mN2LuE-3nzucAo9cuoAAAGHLCzlKw&state=8_bprj_QaKc6mIzvlC972kiYByGkGAQT8ym9hvYNl9A%3D",
        },
      })
      .then((res) => {
        console.log(res);
        alert("프로필 수정이 완료되었습니다!");
        setProfileEditModalShow(false);
      })
      .catch((err) => {
        alert("프로필 수정 중 에러가 발생하였습니다.");
      });
  };

  const handleBasicProfileImg = () => {
    const changeBool = window.confirm("기본 프로필로 변경하시겠습니까?");
    if (changeBool) {
      setTmpProfileImg(BasicProfile);
      setImgChanged(true);
    }
  };

  const onChangeProfileImg = (e) => {
    if (e.target.files[0]) {
      setTmpProfileImg(e.target.files[0]);
      // 이미지 변경 여부 change
      setImgChanged(true);
    } else {
      //업로드 취소할 시 기존 이미지로 설정
      setTmpProfileImg(tmpProfileImg);
      return;
    }
    //화면에 프로필 사진 표시
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setTmpProfileImg(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <>
      <ModalClosable
        modalShow={profileEditModalShow}
        setModalShow={setProfileEditModalShow}>
        <H2 padding="0 0 3rem 0">프로필 수정</H2>
        <FilePreview
          src={tmpProfileImg}
          onClick={() => {
            fileInput.current.click();
            // console.log(fileInput.current);
          }}
        />
        <input
          type="file"
          style={{ display: "none" }}
          accept="image/jpg,impge/png,image/jpeg"
          name="profile_img"
          onChange={onChangeProfileImg}
          ref={fileInput}
        />
        <CommonBtn
          width={"11rem"}
          height={48}
          font={1.1}
          fontWeight={700}
          color={colors.studyYellow300}
          hoverColor={colors.studyYellow400}
          margin="1rem 0 0 0"
          onClick={handleBasicProfileImg}>
          기본 프로필로 변경
        </CommonBtn>
        <NickNameEditBox>
          <div className="flex">
            <input
              ref={nickNameRef}
              onChange={changeNickname}
              className="inputBox"
              defaultValue={nickname}
              placeholder="닉네임을 입력하세요."
            />
            <CommonBtn
              width={"7.5rem"}
              font={1.1}
              fontWeight={700}
              color={colors.studyBlue100}
              hoverColor={"#98A9F0"}
              margin="0 0 0 0.5rem"
              onClick={handleNickNameConfirm}>
              중복 확인
            </CommonBtn>
          </div>

          <div className="msg">
            {nicknameRegExpTest === undefined ? (
              ""
            ) : nicknameRegExpTest ? (
              <div className="allowed">{allowedMsg}</div>
            ) : (
              <div className="denied">
                한글, 영어, 숫자 가능 (2자-30자) / 특수문자, 공백 포함 불가능
              </div>
            )}
          </div>
        </NickNameEditBox>
        <EditBtnBox>
          <CommonBtn
            width="7.5rem"
            height={55}
            margin="0 2rem 0 0"
            color={colors.gray500}
            hoverColor={"#888"}
            font={1.2}
            fontColor={colors.white}
            onClick={() => setProfileEditModalShow(false)}>
            취소
          </CommonBtn>
          <CommonBtn
            width="7.5rem"
            height={55}
            color={colors.studyBlue300}
            hoverColor={colors.studyBlue400}
            font={1.2}
            fontColor={colors.white}
            onClick={handleProfileEdit}>
            확인
          </CommonBtn>
        </EditBtnBox>
      </ModalClosable>
      <MyPageWrapper>
        <GameTitle>
          <H1
            color={colors.white}
            outline={colors.gameBlue500}
            outlineWeight={2}
            align="center">
            마이페이지
          </H1>
        </GameTitle>
        <MyPageContentContainer>
          <MyPageMainConatiner>
            <MyPageIntroConatiner>
              <div className="flex-column">
                <H3>Hi, {nickname}!</H3>
                <P1 padding="0.5rem 0 0 0">
                  <span className="swing-bold">SWING</span>을 즐기고 계신가요?
                  <br /> 마이페이지에서는 SpeeDoodle 히스토리 상세조회와 <br />
                  프로필 편집이 가능합니다.
                </P1>
              </div>
              <img src={MyPageSwing} className="swingImg" alt="img" />
            </MyPageIntroConatiner>
            <MyPageHistoryConatiner>
              <HistoryHeader>
                <div className="date">날짜</div>
                <div className="roomname">방제목</div>
                <div className="rank">등수</div>
              </HistoryHeader>
              {renderList}
              <div className="more-list-nav">
                <H6 onClick={() => navigate("/history")}>+ 더보기</H6>
              </div>
            </MyPageHistoryConatiner>
          </MyPageMainConatiner>
          <MyPageSideConatiner>
            <MyPageProfileConatiner>
              <MyPageProfile src={BasicProfile} />
              <MyPageProfileNickname>
                <div className="nickname">{nickname}</div>
                <CommonBtn
                  width={"7rem"}
                  height={32}
                  color={colors.studyBlue100}
                  hoverColor={"#98A9F0"}
                  font={1}
                  onClick={() => setProfileEditModalShow(true)}>
                  프로필 편집
                </CommonBtn>
              </MyPageProfileNickname>
            </MyPageProfileConatiner>
            <MyPageProfileCoupon>
              <CouponImg src={Coupon} alt="coupon" width={4} />
              <H5>{coupon}장</H5>
            </MyPageProfileCoupon>
            <CommonBtn
              height="42"
              border="none"
              color={colors.gray400}
              font="1.25"
              fontColor={colors.white}
              hoverColor={colors.gray500}
              padding="0.5rem 1.5rem ">
              회원탈퇴
            </CommonBtn>
          </MyPageSideConatiner>
        </MyPageContentContainer>
      </MyPageWrapper>
    </>
  );
}

export default MyPage;
