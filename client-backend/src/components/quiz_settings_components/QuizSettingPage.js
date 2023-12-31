import React, { useState, useRef, useEffect } from 'react';
import { Button, Flex, Box, Text } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { v4 } from 'uuid';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { firebaseApp, auth } from '../firebase__init_scripts/firebaseAppInit';
import { useAuthState } from 'react-firebase-hooks/auth';
import QuizResultComponent from './QuizResultComponent';
import DisplayQuestions from './DisplayQuestions';
import QuizDetails from './QuizDetails';
import AIQuestionGenerator from './ai_question_generator/AIQuestionGenerator';

const REACT_APP_HOSTB = process.env.REACT_APP_HOSTB || 'http://localhost:4000';

export default function QuizSettingPage() {
  const [user, loading, error] = useAuthState(auth);
  const [quiz, setQuiz] = useState([]);
  const [toggleCloseAll, setToggleCloseAll] = useState(true);
  const [render, toggleRender] = useState(false);
  const addButton = useRef();
  const closeOptionsRef = useRef([]);

  const location = useLocation();
  const navigate = useNavigate();

  //for getting url parameters
  const params = useParams();

  //quizId
  const quizId = params.quizId || v4();

  // Load quiz data
  useEffect(
    function () {
      if (!loading) {
        user.getIdToken().then(token => {
          fetch(`${REACT_APP_HOSTB}/quiz/${quizId}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then(res => res.text())
            .then(text => JSON.parse(text))
            .then(quizObj => {
              if (!quizObj?.status) {
                // the timestamp loses 1 hour after conversion,so i am adding 3600000 millisecond (1hr) to it to make up for it.
                let quiz_start_timeISO = new Date(
                  quizObj.quiz_start_time + 3600000
                ).toISOString();
                let quiz_end_timeISO = new Date(
                  quizObj.quiz_end_time + 3600000
                ).toISOString();

                setQuiz(quizObj.questions);
                setFormValues({
                  title: quizObj.title,
                  description: quizObj.description,
                  allotted_time_in_mins: quizObj.allotted_time_in_mins,
                  quiz_start_time: quiz_start_timeISO.slice(
                    0,
                    quiz_start_timeISO.length - 8
                  ),
                  quiz_end_time: quiz_end_timeISO.slice(
                    0,
                    quiz_end_timeISO.length - 8
                  ),
                  private: quizObj.private,
                });
              }
            })
            .catch(err => {
              // alert('unable to load quiz data. Please try again')
            });
        });
      }
    },
    [user]
  );

  //Manage QuizDetails Component State
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    allotted_time_in_mins: 0,
    quiz_start_time: '',
    quiz_end_time: '',
    private: true,
  });

  const handleQuizDetailsChange = e => {
    const { name, value } = e.target;
    if (name === 'private') {
      const { name, checked } = e.target;
      setFormValues(prevValues => ({
        ...prevValues,
        [name]: checked,
      }));
    } else {
      setFormValues(prevValues => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };

  const handleQuziDetailsFormSubmit = e => {
    e.preventDefault();
    let constantQuizData = {
      test_id: quizId,
      user_id: user.uid,
    };

    let quizData = { ...constantQuizData, ...formValues };

    quizData.questions = quiz;

    quizData.quiz_start_time = new Date(quizData.quiz_start_time).getTime();
    quizData.quiz_end_time = new Date(quizData.quiz_end_time).getTime();
    quizData.allotted_time_in_mins =
      parseInt(quizData.allotted_time_in_mins, 10) || 1;

    user.getIdToken().then(token => {
      fetch(`${REACT_APP_HOSTB}/create_quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(quizData),
      })
        .then(res => {
          navigate(`/dashboard/setquiz/${quizId}`, { replace: true });
          alert('uploaded successfully');
          // res.text().then((text) => { console.log(text) });
        })
        .catch(err => {
          // alert('unable to create/update quiz. Please try again.')
        });
    });
  };

  const createNewQuestionObject = () => {
    setQuiz(prevState => [
      ...prevState,
      {
        id: v4(),
        question: `Enter Question ${prevState.length + 1}`,
        options: {
          A: 'enter option 1 here',
          B: 'enter option 2 here',
          C: 'enter option 3 here',
          D: 'enter option 4 here',
        },
        answer: [],
      },
    ]);
    addButton.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'start',
    });
  };

  const extendQuizArray = questionsArray => {
    setQuiz(prevState => [...prevState, ...questionsArray]);

    setTimeout(() => {
      addButton.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start',
      });
    }, 1000);
  };

  const appendQuestionToQuiz = questionObject => {
    setQuiz(prevState => [...prevState, questionObject]);
    setTimeout(() => {
      addButton.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start',
      });
    }, 1000);
  };

  const removeQuestion = questionId => {
    setQuiz(prevState => prevState.filter(elem => questionId != elem.id));
  };

  const setQuestiontext = (questionId, text) => {
    setQuiz(prevState => {
      for (let question of prevState) {
        if (question.id === questionId) {
          question.question = text;
          toggleRender(!render);
        }
      }
      return prevState;
    });
  };

  const setOptionsText = (questionId, optionKey, text) => {
    setQuiz(prevState => {
      for (let question of prevState) {
        if (question.id === questionId) {
          question.options[optionKey] = text;
          toggleRender(!render);
        }
      }
      return prevState;
    });
  };

  const addOptionToCorrectAnswer = (questionId, optionKey, checked) => {
    setQuiz(prevState => {
      for (let question of prevState) {
        if (question.id === questionId) {
          if (checked) {
            question.answer.push(optionKey);
          } else {
            const tmparr = question.answer.filter(ans => ans != optionKey);
            question.answer = tmparr;
          }
          toggleRender(!render);
        }
      }
      return prevState;
    });
  };

  const toggleCloseAllOption = () => {
    if (toggleCloseAll) {
      closeAllOptions();
      setToggleCloseAll(!toggleCloseAll);
    } else {
      OpenAllOptions();
      setToggleCloseAll(!toggleCloseAll);
    }
  };

  const closeAllOptions = () => {
    const length = quiz.length - 1;

    for (let i = 0; i <= length; i++) {
      if (closeOptionsRef.current[i].getAttribute('aria-expanded') == 'true') {
        closeOptionsRef.current[i].click();
      }
    }
  };

  const OpenAllOptions = () => {
    const length = quiz.length - 1;

    for (let i = 0; i <= length; i++) {
      if (closeOptionsRef.current[i].getAttribute('aria-expanded') == 'false') {
        closeOptionsRef.current[i].click();
      }
    }
  };

  function deleteQuiz() {
    user.getIdToken().then(token => {
      fetch(`${REACT_APP_HOSTB}/delete_quiz/${quizId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(() => navigate('/dashboard'));
    });
  }

  return (
    <div className="container d-flex flex-column justify-content-evenly align-items-stretch w-100 mt-5">
      <Tabs
        // style={{ margin: '20px' }}
        variant="soft-rounded"
        colorScheme="green"
        padding={'15px'}
      >
        <TabList>
          <Tab>Quiz Settings</Tab>
          <Tab>Quiz results</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div className="w-100 d-flex flex-column">
              <div
                className="row w-100"
                marginY={'20px'}
                minW={'450px'}
                style={{ width: '100%', minWidth: '340px', padding: 'auto' }}
              >
                <QuizDetails
                  formValues={formValues}
                  handleQuizDetailsChange={handleQuizDetailsChange}
                  handleQuziDetailsFormSubmit={handleQuziDetailsFormSubmit}
                  deleteQuiz={deleteQuiz}
                />
                <div className="col-sm-6" flex="1">
                  <Box>
                    <AIQuestionGenerator
                      extendQuizArray={extendQuizArray}
                      appendQuestionToQuiz={appendQuestionToQuiz}
                    />
                  </Box>
                </div>
              </div>
              <Flex
                className="col-12 w-100"
                // minW={'450px'}
                h="100%"
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  alignContent: 'space-evenly',
                }}
              >
                {/* <Box flex="1">
                  <Box mt="20px">
                    <AIQuestionGenerator
                      extendQuizArray={extendQuizArray}
                      appendQuestionToQuiz={appendQuestionToQuiz}
                    />
                  </Box>
                </Box> */}
                <Box className="c" flex="3" position="relative" mt={'20px'}>
                  <Box
                    minW={'400px'}
                    w="90%"
                    overflowY="auto"
                    p="15px"
                    pt="30px"
                    bg="white"
                    borderRadius="20px"
                    boxShadow="dark-lg"
                  >
                    <Text fontSize="2xl" fontWeight="bold">
                      Questions: {quiz.length}
                    </Text>
                    {
                      <Button
                        w="100%"
                        mb="15px"
                        colorScheme="facebook"
                        onClick={toggleCloseAllOption}
                      >
                        Toggle Close/Open All Options
                      </Button>
                    }
                    <DisplayQuestions
                      quiz={quiz}
                      removeQuestion={removeQuestion}
                      setQuestiontext={setQuestiontext}
                      setOptionsText={setOptionsText}
                      addOptionToCorrectAnswer={addOptionToCorrectAnswer}
                      closeOptionsRef={closeOptionsRef}
                    />
                    <Button
                      ref={addButton}
                      w="100%"
                      mt="15px"
                      colorScheme="facebook"
                      onClick={createNewQuestionObject}
                    >
                      + Add Question
                    </Button>
                  </Box>
                </Box>
              </Flex>
            </div>
          </TabPanel>
          <TabPanel>
            <QuizResultComponent quizId={quizId} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
