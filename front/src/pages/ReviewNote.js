import React, { useEffect,useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ReviewNoteWrapperColor, 
  ReviewNoteWrapper, 
  ReviewBtnContainer,
  WrongThingBox,
  WrongBox,
  ThingMean,
 } from '../styles/ReviewNoteEmotion';
import { CommonBtn } from '../styles/CommonEmotion';
import { H2,H3 } from '../styles/Fonts';
import { colors } from '../styles/ColorPalette';
import { CheckCircle, CheckCircleFill } from 'react-bootstrap-icons';
import Pagination from '../components/PaginatorBar';
import  axios  from 'axios';
import { API_URL } from '../config';

function ReviewNote() {
  const navigate = useNavigate();
  const location = useLocation();

  const [wordArray,setWordArray] = useState([]);
  const [sentenceArray, setSentenceArray] = useState([]);
  const [posts, setPosts] = useState([]);
  const [limit, setLimit] = useState(3);
  const [page, setPage] = useState(1);
  const [Ppage, setPpage] = useState(1);
  const [offset, setOffset] = useState(0);
  const [wordReview, setwordReview] = useState(null);
  const [wordChecked, setWordChecked] = useState(Array(posts.length).fill(false));

  useEffect(() => {
    axios({
      method: 'get',
      url: `${API_URL}/note/word/red/0`,
    })
    .then((res) => {
      setWordArray([...res.data.wordNoteList]); 
    })
    .catch((err) => {
      console.log(err);
    })  
    axios({
      method: 'get',
      url: `${API_URL}/note/sentence/red/0`,
    })
    .then((res) => {
      setSentenceArray([...res.data.sentenceNoteList]);
    })
    .catch((err) => {
      console.log(err);
    });
  },[]);

  useEffect(() => {
    let nowState = null;
    if(location.state === null){
      nowState = true;
    } 
    else if(location.state === 1){
      nowState = true;
    }
    else {
      nowState = false;
    }
    setwordReview(nowState);
  },[location.state]);

  useEffect(() => {
    if(wordReview){
      setPosts(wordArray);
    }
    else{
      setPosts(sentenceArray);
    }
  }, [wordArray, sentenceArray, wordReview]);

  useEffect(() => {
    const newOffset = ((page - 1) + 5*(Ppage - 1)) * limit;
    setOffset(newOffset);
  }, [page, Ppage]);

  const ToggleVersion = () => {
    if(wordReview){
      setLimit(4);
      setPosts(sentenceArray);
      setwordReview(false);
      setPage(1);
      setPpage(1);
      setOffset(0);
    }
    else{
      setLimit(3);
      setPosts(wordArray);
      setwordReview(true);
      setPage(1);
      setPpage(1);
      setOffset(0);
    }
  }

  const startTest = () => {
    if(wordReview){
      navigate('/test-word');
    }
    else{
      navigate('/test-sentence');
    }
  };

  // 단어 셀프체크 부분 토글 함수
  const ToggleCheck = (wid) => {
    if(wordReview){
      axios({
        method:'put',
        url:`${API_URL}/note/word/${wid}`,
      })
      .then((res) => {
        axios({
          method: 'get',
          url: `${API_URL}/note/word/red/0`,
        })
        .then((res) => {
          setWordArray([...res.data.wordNoteList]); 
        })
        .catch((err) => {
          console.log(err);
        })  
      })
      .catch((err) => {
        console.log(err);
      });
    }
    else{
      axios({
        method:'put',
        url:`${API_URL}/note/sentence/${wid}`,
      })
      .then((res) => {
        axios({
          method: 'get',
          url: `${API_URL}/note/sentence/red/0`,
        })
        .then((res) => {
          setSentenceArray([...res.data.sentenceNoteList]);
        })
        .catch((err) => {
          console.log(err);
        })
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }

  return (
    <>
      <ReviewNoteWrapper>
        <ReviewNoteWrapperColor>
          <div className="noteTitle">
            <H2 color={colors.black}>My오답노트</H2>
          </div>
          <ReviewBtnContainer>
            <div className='selectButton'>
              <CommonBtn color={colors.white} 
              onClick = {ToggleVersion}
              font={1.5}
              width= "7.5rem"
              height= {55}
              border= {"2px solid" + colors.studyBlue300}
              fontColor = {colors.studyBlue300}
              shadow = {"0px 4px 4px rgba(0, 0, 0, 0.25)"}
              disabled={wordReview===true? "page" : null}
              >단어</CommonBtn>
              <CommonBtn color={colors.white} 
              onClick = {ToggleVersion}
              font={1.5}
              width= "7.5rem"
              height= {55}
              border= {"2px solid" + colors.studyBlue300}
              fontColor = {colors.studyBlue300}
              shadow = {"0px 4px 4px rgba(0, 0, 0, 0.25)"}
              disabled={wordReview===false? "page" : null}
              >문장</CommonBtn>
            </div>
            <CommonBtn color={colors.studyYellow400} 
            onClick = {startTest}
            width= "14.8rem"
            font={1.5}
            height= {55}
            border= "none"
            shadow = {"0px 4px 4px rgba(0, 0, 0, 0.25)"}
            >복습 테스트 시작</CommonBtn>
          </ReviewBtnContainer>
          <WrongBox>
            {posts.slice(offset, offset + limit).map((item, idx) => (
              <WrongThingBox key={idx}>
                <H3 margin="0rem 0rem 1rem 0rem">{item.content}</H3>
                <ThingMean margin={wordReview===true ? 1 : 0}>
                  {item.meaningKr}
                </ThingMean>
                <div className='thingMean'
                display={ wordReview===true ? "block" : "none" }>
                  {item.meaningEn}
                </div>
                <div className='checkBtn'>
                  {
                    wordReview === true ? 
                    posts[idx+(page-1)*limit].checked === 1?
                    <CheckCircleFill onClick={() => ToggleCheck(posts[idx+(page-1)*limit].wordNoteId)} color={colors.studyBlue300} />
                    :<CheckCircle onClick={() => ToggleCheck(posts[idx+(page-1)*limit].wordNoteId)}/>
                    :
                    posts[idx+(page-1)*limit].checked === 1?
                    <CheckCircleFill onClick={() => ToggleCheck(posts[idx+(page-1)*limit].sentenceNoteId)} color={colors.studyBlue300} />
                    :<CheckCircle onClick={() => ToggleCheck(posts[idx+(page-1)*limit].sentenceNoteId)}/>
                  }
                </div>
              </WrongThingBox>
            ))}
          </WrongBox>

          <Pagination
          total = {posts.length}
          limit = {limit}
          page = {page}
          Ppage = {Ppage}
          setPage = {setPage}
          setPpage = {setPpage}/>
        </ReviewNoteWrapperColor>
      </ReviewNoteWrapper>
    </>
  );
}

export default ReviewNote;
