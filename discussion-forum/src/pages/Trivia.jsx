// Trivia.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Trivia = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '']); // Initial options array with 3 empty strings
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(-1); // Index of correct answer
  const [selectedTopic, setSelectedTopic] = useState('Netflix Hits'); // Default selected topic

  useEffect(() => {
    fetchQuestions(selectedTopic);
  }, [selectedTopic]);

  const fetchQuestions = async (topic) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/triviaquestions?topic=${encodeURIComponent(topic)}`);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/triviaquestions`, {
        question: newQuestionText,
        answers: options.filter(opt => opt.trim() !== ''), // Filter out empty options
        correctAnswer: options[correctAnswerIndex], // Assuming correctAnswerIndex is the index of the correct answer
        topic: selectedTopic,
      });
      setQuestions([...questions, response.data]);
      setNewQuestionText(''); // Clear input field after adding question
      setOptions(['', '', '']); // Reset options state
      setCorrectAnswerIndex(-1); // Reset correct answer index
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };
 

  const handleOptionChange = (index, e) => {
    const updatedOptions = [...options];
    updatedOptions[index] = e.target.value;
    setOptions(updatedOptions);
  };

  const handleCorrectAnswerChange = (index) => {
    setCorrectAnswerIndex(index);
  };

  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
    setQuestions([]); // Clear current questions when topic changes
  };

  return (
    <div className="container mx-auto px-6 py-6 bg-purple-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4 text-purple-800">Trivia</h1>

      <div className="mb-4">
        <label className="block mb-2 text-purple-800 font-bold">Select Topic:</label>
        <select
          value={selectedTopic}
          onChange={handleTopicChange}
          className="w-full p-3 rounded-md border border-purple-300 focus:outline-none focus:border-purple-500"
        >
          <option value="Netflix Hits">Netflix Hits</option>
          {/* Add other topic options here */}
        </select>
      </div>

      <form onSubmit={handleAddQuestion} className="mb-8">
        <input
          type="text"
          value={newQuestionText}
          onChange={(e) => setNewQuestionText(e.target.value)}
          placeholder="Enter your question"
          className="w-full p-3 rounded-md border border-purple-300 focus:outline-none focus:border-purple-500 mb-4"
        />
        {options.map((option, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e)}
              placeholder={`Option ${index + 1}`}
              className="w-full p-3 rounded-md border border-purple-300 focus:outline-none focus:border-purple-500 mb-2"
            />
            <label className="ml-2">
              <input
                type="radio"
                name="correctAnswer"
                checked={correctAnswerIndex === index}
                onChange={() => handleCorrectAnswerChange(index)}
                className="mr-2"
              />
              Correct Answer
            </label>
          </div>
        ))}
        <button
          type="submit"
          className="mt-2 px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none"
        >
          Add Question
        </button>
      </form>

      {/* Display fetched questions */}
      <div className="divide-y divide-purple-300">
        {questions.map((question, index) => (
          <div key={index} className="mb-4">
            <p className="text-lg font-bold">{question.questionText}</p>
            <ul className="ml-4 mt-2">
              {question.options.map((option, idx) => (
                <li key={idx}>{option}</li>
              ))}
            </ul>
            <p>Correct Answer: {question.options[question.correctAnswerIndex]}</p>
            <p>Topic: {question.topic}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trivia;
