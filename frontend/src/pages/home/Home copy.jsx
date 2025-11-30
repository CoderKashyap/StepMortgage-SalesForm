import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import "./home.css";

// Global styles
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: Montserrat;
  }
`;

// Styled components
const FormContainer = styled.div`
  background: #e9eaec;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const QuestionContainer = styled(motion.div)`
  margin-top: 20px;
  max-width: 600px;
`;

const Input = styled.input`
  padding: 1rem;
  margin-top: 1rem;
  width: 100%;
  border-radius: 20px;
  border: 1px solid #ddd;
  box-sizing: border-box;
`;

const Textarea = styled.textarea`
  padding: 1rem;
  margin-top: 1rem;
  width: 100%;
  border-radius: 20px;
  border: 1px solid #ddd;
  box-sizing: border-box;
`;

const Select = styled.select`
  padding: 1rem;
  margin-top: 1rem;
  width: 100%;
  border-radius: 20px;
  border: 1px solid #ddd;
  box-sizing: border-box;
`;

const Button = styled.button`
  margin-top: 1rem;
  padding: 1rem 2rem;
  background-color: #ff7e12;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
  transition: opacity 0.3s ease;
`;

const ProgressBarContainer = styled.div`
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
`;

const ProgressBar = styled.div`
  width: 100px;
  height: 10px;
  background: #ddd;
  border-radius: 20px;
  overflow: hidden;
  margin-right: 10px;
`;

const Progress = styled.div`
  height: 100%;
  background: #ff7e12;
  width: ${({ width }) => width}%;
  transition: width 0.3s ease;
  border-radius: 20px;
`;

const Percentage = styled.span`
  margin-right: 10px;
  font-weight: 500;
`;

const ArrowButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  margin: 0 5px;
  padding: 5px;
`;

const MultipleChoiceButton = styled.button`
  margin-top: 0.3rem;
  padding: 1rem 2rem;
  background-color: ${({ selected }) => (selected ? "#ff7e12" : "#fff")};
  color: ${({ selected }) => (selected ? "#fff" : "#000")};
  border: 1px solid ${({ selected }) => (selected ? "#ff7e12" : "#A0A0A0")};
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: ${({ selected }) => (selected ? "#FFF5EE" : "#FFF5EE")};
  }

  &:active {
    background-color: #ff7e12;
  }

  @media (max-width: 1200px) {
    padding: 0.8rem 1.6rem;
  }

  @media (max-width: 992px) {
    padding: 0.6rem 1.2rem;
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
  }
`;

const Question = ({ question, value, onChange, onSubmit, options, isMultiple, validationErrors }) => {
  const handleOptionClick = (option) => {
    onChange(option);
    onSubmit();
  };

  return (
    <QuestionContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="md:mb-4 mb-2 text-lg font-semibold">{question}</div>
      <div className="flex flex-wrap gap-2 font-medium">
        {options ? (
          options.map((option) => (
            <MultipleChoiceButton
              key={option}
              selected={value === option}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </MultipleChoiceButton>
          ))
        ) : isMultiple ? (
          <div className="w-full">
            <Textarea
              value={value.address || ""}
              placeholder="Enter your address"
              onChange={(e) => onChange({ ...value, address: e.target.value })}
            />
            <Select
              value={value.province || ""}
              onChange={(e) => onChange({ ...value, province: e.target.value })}
            >
              <option value="">Select your province</option>
              <option value="province1">Province 1</option>
              <option value="province2">Province 2</option>
              <option value="province3">Province 3</option>
            </Select>
            {value.address && value.province && (
              <Button onClick={onSubmit}>OK</Button>
            )}
          </div>
        ) : (
          <div className="w-full">
            <Input
              value={value}
              placeholder={`Enter ${question}`}
              onChange={(e) => onChange(e.target.value)}
            />
            {value && (
              <Button onClick={onSubmit}>OK</Button>
            )}
          </div>
        )}
      </div>
      {validationErrors && validationErrors.map((error, index) => (
        <div key={index} className="text-red-500 text-sm mt-2">{error}</div>
      ))}
    </QuestionContainer>
  );
};

const FluentForm = () => {
  const questions = [
    { id: "financing", type: "multipleChoice", question: "What do you need financing for?", options: ["Refinance", "New Purchase"] },
    { id: "addressProvince", type: "multipleInputs", question: "Please provide your address and province." },
    { id: "nameEmailPhone", type: "multipleInputs", question: "Please provide your name, email, and phone number." },
    { id: "loanPurpose", type: "multipleChoice", question: "What is the purpose of the loan?", options: ["Residential", "Land", "Construction", "Commercial"] },
    { id: "lookingFor", type: "multipleChoice", question: "What are you looking for?", options: ["1st Mortgage", "2nd Mortgage", "3rd Mortgage"] },
    { id: "hearAboutUs", type: "multipleChoice", question: "How did you hear about us?", options: ["Radio", "Google Search", "Social Media", "Podcast", "Online Magazine", "TV", "Paper Ad", "Referral", "Mail Postcard", "Other"] },
    { id: "traditionalLenders", type: "multipleChoice", question: "Have you applied with traditional lenders?", options: ["Yes", "No"] },
    { id: "timeframe", type: "multipleChoice", question: "What's your estimated timeframe?", options: ["Within 30 days", "Within 3 Months", "Within 8 Months", "Within 12 Months", "Unsure"] },
    { id: "valueOfProperty", type: "input", question: "Value of Property (Approximate)" },
    { id: "totalMortgage", type: "input", question: "Total Mortgages (Approximate)" },
    { id: "purchasePrice", type: "input", question: "Purchase price" },
    { id: "downPayment", type: "input", question: "Down payment" },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [validationErrors, setValidationErrors] = useState([]);

  const handleNextQuestion = () => {
    if (validateCurrentQuestion()) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleChange = (value) => {
    const currentQuestionId = questions[currentQuestion].id;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestionId]: value,
    }));
  };

  const validateCurrentQuestion = () => {
    const currentQuestionId = questions[currentQuestion].id;
    const currentAnswer = answers[currentQuestionId];

    if (!currentAnswer || (typeof currentAnswer === "object" && !Object.values(currentAnswer).every(Boolean))) {
      setValidationErrors(["This field is required."]);
      return false;
    }

    setValidationErrors([]);
    return true;
  };

  const progressPercentage = (currentQuestion / (questions.length - 1)) * 100;

  const handleSubmit = () => {
    if (validateCurrentQuestion()) {
      alert("Form submitted successfully!");
    }
  };

  return (
    <FormContainer>
      <GlobalStyle />
      <ProgressBarContainer>
        <ArrowButton onClick={handlePreviousQuestion} disabled={currentQuestion === 0}>
          &uarr;
        </ArrowButton>
        <ProgressBar>
          <Progress width={progressPercentage} />
        </ProgressBar>
        <Percentage>{Math.round(progressPercentage)}%</Percentage>
        <ArrowButton onClick={handleNextQuestion} disabled={currentQuestion === questions.length - 1}>
          &darr;
        </ArrowButton>
      </ProgressBarContainer>
      <AnimatePresence>
        <Question
          key={questions[currentQuestion].id}
          question={questions[currentQuestion].question}
          value={answers[questions[currentQuestion].id] || ""}
          onChange={handleChange}
          onSubmit={handleNextQuestion}
          options={questions[currentQuestion].options}
          isMultiple={questions[currentQuestion].type === "multipleInputs"}
          validationErrors={validationErrors}
        />
      </AnimatePresence>
      {currentQuestion === questions.length - 1 && (
        <Button onClick={handleSubmit}>Submit</Button>
      )}
      {currentQuestion > 0 && (
        <Button onClick={handlePreviousQuestion}>Previous</Button>
      )}
    </FormContainer>
  );
};

export default FluentForm;
