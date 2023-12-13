import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'https://opentdb.com/api.php?amount=5&type=multiple';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setQuestions(data.results);
        setLoading(false);
      } else {
        throw new Error('No questions available');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      setLoading(false);
    }
  };

  const handleAnswerClick = (selectedAnswer) => {
    if (showScore) {
      return; 
    }

    const currentQuestionData = questions[currentQuestion];
    if (currentQuestionData) {
      const { correct_answer } = currentQuestionData;
      const isCorrect = selectedAnswer === correct_answer;


      const feedbackMessage = isCorrect
        ? 'Correct!'
        : `Incorrect! The correct answer is: ${correct_answer}`;
      alert(feedbackMessage);

      if (isCorrect) {
        setScore(score + 1);
      }

      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
      } else {
        setShowScore(true);
      }
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setLoading(true);
    fetchQuestions();
  };

  const renderQuizContent = () => {
    if (showScore) {
      return (
        <div className="score-section">
          <h2>You scored {score} out of {questions.length}!</h2>
          <button onClick={restartQuiz}>Restart Quiz</button>
        </div>
      );
    } else if (questions.length > 0) {
      const currentQuestionData = questions[currentQuestion];
      return (
        <div className="question-section">
          <h2>Question {currentQuestion + 1}</h2>
          <p dangerouslySetInnerHTML={{ __html: currentQuestionData?.question }} />
          <div className="answer-section">
            {shuffleArray([
              ...(currentQuestionData?.incorrect_answers || []),
              currentQuestionData?.correct_answer,
            ]).map((option, index) => (
              <button key={index} onClick={() => handleAnswerClick(option)}>
                {option}
              </button>
            ))}
          </div>
        </div>
      );
    } else if (loading) {
      return <p>Loading questions...</p>;
    } else {
      return <p>No questions available.</p>;
    }
  };

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  return <div className="app">{renderQuizContent()}</div>;
}

export default App;
