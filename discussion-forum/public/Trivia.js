import React, { useState } from 'react';
import './Trivia.css';
import '../../App.css';

// Mock questions data
const mockQuestionsByTopic = {
  'Inside Out': [
    { question: 'What is the name of the imaginary friend?', answers: ['Bing Bong', 'Truffle', 'Elly', 'Pinkie'], correctAnswer: 'Bing Bong' },
    { question: 'What colour is Anger', answers: ['Yellow', 'Green', 'Orange', 'Red'], correctAnswer: 'Red' },
  ],
  'Harry Potter': [
    { question: 'What is the name of the Hipporiff belonging to Hagrid?', answers: ['Charles', 'Hermione', 'Buckbeak', 'Dobby'], correctAnswer: 'Buckbeak' },
    { question: 'Which house does Professor Snape belong to?', answers: ['Hufflepuff', 'Ravenclaw', 'Gryffindor', 'Slytherin'], correctAnswer: 'Slytherin' },
  ],
  // Add more topics and questions as needed
  'The Hunger Games': [],
  'Percy Jackson': [],
};

function Trivia() {
  const [topics, setTopics] = useState(['Inside Out', 'Harry Potter', 'The Hunger Games', 'Percy Jackson']);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [showScore, setShowScore] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAddQuestionForm, setShowAddQuestionForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswers, setNewAnswers] = useState(['', '', '', '']);
  const [newCorrectAnswerIndex, setNewCorrectAnswerIndex] = useState(null);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [submissionMessageType, setSubmissionMessageType] = useState('');
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    const topicQuestions = mockQuestionsByTopic[topic];
    if (topicQuestions) {
      setQuestions(topicQuestions);
    } else {
      setQuestions([]);
    }
    setShowScore(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
  };

  const handleAnswerButtonClick = (correct) => {
    if (correct) {
      setScore(score + 1);
    }
    setSelectedAnswer(correct);
  };

  const handleNextButton = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setShowScore(true);
    }
  };

  const handlePlayAgain = () => {
    setShowScore(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
  };

  const handleAddQuestionClick = () => {
    setShowAddQuestionForm(true);
    setSubmissionMessage(''); // Clear any previous submission messages
    setIsSubmitButtonDisabled(false); // Ensure the submit button is enabled
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (newQuestion && newAnswers.every(answer => answer) && newCorrectAnswerIndex !== null) {
      // Normally here you would send this data to the server
      // For demonstration purposes, we'll just log it to the console
      console.log({
        topic: selectedTopic,
        question: newQuestion,
        answers: newAnswers,
        correctAnswer: newAnswers[newCorrectAnswerIndex]
      });
      setSubmissionMessage('Question successfully submitted!');
      setSubmissionMessageType('success'); // Set the message type to success
      setIsSubmitButtonDisabled(true); // Disable the submit button
    } else {
      setSubmissionMessage('Please fill out all fields and select the correct answer.');
      setSubmissionMessageType('error'); // Set the message type to error
    }
  };
  

  const handleCloseForm = () => {
    setShowAddQuestionForm(false);
    setNewQuestion('');
    setNewAnswers(['', '', '', '']);
    setNewCorrectAnswerIndex(null);
    setSubmissionMessage('');
  };

  const renderQuestionsOrMessage = () => {
    if (questions.length === 0) {
      return (
        <div>
          <p>There are no questions here</p>
          <button onClick={handleAddQuestionClick}>Add a question</button>
        </div>
      );
    } else {
      return (
        <div>
          {questions.map((question, index) => (
            <div key={index}>
              <p>{question.question}</p>
              <ul>
                {question.answers.map((answer, answerIndex) => (
                  <li key={answerIndex}>{answer}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="app">
      {!selectedTopic ? (
        <div className="topic-selection">
          <h1>Select a Topic</h1>
          {topics.map((topic, index) => (
            <button key={index} onClick={() => handleTopicSelect(topic)} className="btn">
              {topic}
            </button>
          ))}
        </div>
      ) : (
        <div className="quiz-section">
          <h1>{selectedTopic} Trivia</h1>
          {showScore ? (
            <div className="score-section">
              <p>Your score is {score} out of {questions.length}!</p>
              <button onClick={handlePlayAgain} className="btn">Play Again</button>
              <button onClick={() => setSelectedTopic('')} className="btn">Choose another topic</button>
              <button onClick={handleAddQuestionClick} className="btn">Add a question</button>
            </div>
          ) : questions.length > 0 ? (
            <div className="quiz">
              <h2>{questions[currentQuestionIndex].question}</h2>
              <div id="answer-buttons">
                {questions[currentQuestionIndex].answers.map((answer, index) => (
                  <button
                    key={index}
                    className={`btn ${selectedAnswer !== null && (answer === questions[currentQuestionIndex].correctAnswer ? 'correct' : 'incorrect')}`}
                    onClick={() => handleAnswerButtonClick(answer === questions[currentQuestionIndex].correctAnswer)}
                    disabled={selectedAnswer !== null}
                  >
                    {answer}
                  </button>
                ))}
              </div>
              {selectedAnswer !== null && (
                <button id="next-btn" onClick={handleNextButton} className="btn">
                  Next
                </button>
              )}
            </div>
          ) : (
            <div className="add-question-section">
              <h2>No questions here.</h2>
              <button onClick={handleAddQuestionClick} className="btn">Add a question</button>
              <button onClick={() => setSelectedTopic('')} className="btn">Choose another topic</button>
            </div>
          )}
          {showAddQuestionForm && (
            <div className="add-question-form">
              <h2>Add a New Question</h2>
              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label>Question:</label>
                  <input
                    type="text"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                  />
                </div>
                {newAnswers.map((answer, index) => (
                  <div className="form-group" key={index}>
                    <label>Option {index + 1}:</label>
                    <input
                      type="text"
                      value={answer}
                      onChange={(e) => {
                        const updatedAnswers = [...newAnswers];
                        updatedAnswers[index] = e.target.value;
                        setNewAnswers(updatedAnswers);
                      }}
                    />
                    <label>
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={newCorrectAnswerIndex === index}
                        onChange={() => setNewCorrectAnswerIndex(index)}
                      />
                      Correct
                    </label>
                  </div>
                ))}
                <button type="submit" className={`submit-btn ${isSubmitButtonDisabled ? 'disabled' : ''}`}>Submit Question</button>
              </form>
              {submissionMessage && <p>{submissionMessage}</p>}
              <button onClick={handleCloseForm} className="close-btn">Close</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Trivia;






