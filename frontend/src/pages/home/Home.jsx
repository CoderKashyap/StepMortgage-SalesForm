import React, { useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import SubHeader from "../../components/layout/SubHeader";
import "./home.css"
import NewPurchase from "/purchase.png";
import Refinance from "/refinance.png";
import rightArrowSvg from "/polygonRight.svg";
import leftArrowSvg from "/polygonLeft.svg";
import { Link } from "react-router-dom";
import { useSalesforceAuthQuery, usePostFormDataMutation } from "../../redux/api";

import AutoCompleteBox from "../../components/AutoSearchLoc";
import { useJsApiLoader } from "@react-google-maps/api";

// import CancelIcon from "@mui/icons-material/Cancel";

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Tooltip } from "@mui/material";

// Global styles
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: Sora;
    // display: flex;
    // justify-content: center;
    // align-items: center;
    // height: 100vh;
    // background-color: #f0f0f0;
  }
`;

// Styled components
const FormContainer = styled.div`
  height: calc(100vh - 6rem);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column; 
  
  // box-sizing: border-box;
  // position: relative;
  // border: 2px solid gray;
  // width: 100vw;
  // height: 100vh;
  // padding: 3rem;
  // border-radius: 25px;

  // @media (max-width: 768px) {  
  // justify-content: flex-start;
  // }
`;

const QuestionContainer = styled(motion.div)`  
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  // flex-direction: column; 
  // margin: 10px;
  // margin-top: 20px;
  // width: 650px;
  //   @media (max-width: 768px) {
  //   width: auto;
  // }

  @media (max-width: 768px) {  
  gap: 0px;
  }

`;

const Input = styled.input`
  padding: 1rem;
  margin-top: 1rem;
  width: 100%;
  border-radius: 20px;
  border: 1px solid #ddd;
  box-sizing: border-box;
`;

const InputDollar = styled.input`
  padding: 1rem;
  padding-left: 1.5rem;
  margin-top: 1rem;
  width: 100%;
  border-radius: 20px;
  border: 1px solid #ddd;
  box-sizing: border-box;
  
  @media (max-width: 768px) {  
    gap: 0px;
    // width: 100vw;
  }

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
  margin: 1rem;
  display: flex; 
  align-items: center;
  color: white;
  @media (max-width: 768px) {  
  margin: 2rem;
  }
`;

const ProgressBar = styled.div`
  width: 100px;
  height: 10px;
  background: #ddd;
  border-radius: 20px;
  overflow: hidden;
  margin-right: 15px;
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
  cursor: pointer;
  appearance: none;
  background: url('data:image/svg+xml;utf8,<svg fill="%23000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>') no-repeat right 1rem center; /* Custom arrow with black color */
  background-color: white; /* Adjust background color if needed */
  background-size: 2rem;
  cursor: pointer;

  &:focus {
    border-color: #aaa;
    outline: none;
  }
`;

const MultipleChoiceButton = styled.button`
  margin-top: .3rem;
  padding: 1rem 2rem;
  background: ${({ selected }) => (selected ? "linear-gradient(to right, #FC9700, #FFF739)" : "white")};
  color: #000;
  border: 1px solid ${({ selected }) => (selected ? "#A0A0A0" : "#A0A0A0")};  
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;


    &:hover {
      background: linear-gradient(to right, #FC9700, #FFF739);
    }

    &:active {
      background: linear-gradient(to right, #FC9700, #FFF739);
    }

  /* Responsive padding */
  @media (max-width: 1200px) {
    padding: 0.8rem 1.6rem;
  }
  
  @media (max-width: 992px) {
    padding: 0.6rem 1.2rem;
  }
  
  @media (max-width: 768px) {
    padding: 0.7rem 1rem;
  } 
`;

const MultipleChoiceDesignButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-direction: column;
  // margin-top: 1rem;
  padding: 2rem;
  height: 220px;
  width: 260px;
  background-color: #F7F7F7;
  color: ${({ selected }) => (selected ? "#000" : "#000")};
  border: 3px solid ${({ selected }) => (selected ? "#2196F3" : "#F7F7F7")};  
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;


  /* Responsive padding */
  @media (max-width: 1200px) {
    padding: 0.8rem 1.6rem;
  }
  
  @media (max-width: 992px) {
    padding: 0.6rem 1.2rem;
  }
  
  @media (max-width: 768px) {
  height: 120px;
  width: 160px;
  padding: 5px 5px;
  gap: 20px;
  } 


    div {
      background: #ececea;
    }

    img {
    transition: transform 0.3s ease;
    }

    &:hover{
      img{
      transform: scale(1.1);
      }
      
      span{
      background: linear-gradient(to right, #FC9700, #FFF739);
      }
    }


    &:active {
      span{
        background: linear-gradient(to right, #FC9700, #FFF739);
      }
    }


  span {
    font-size: 1rem;
    font-weight: bold;
    padding: 0.8rem 2rem;
    border-radius: 50px;
    transition: background-color 0.3s ease, color 0.3s ease;
    background: ${({ selected }) => (selected ? "linear-gradient(to right, #FC9700, #FFF739)" : "white")}; 

    
  @media (max-width: 768px) {
    font-size: 14px;
    padding: 0.5rem 1rem;
    }


`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 0.5rem;
  margin-left: 1rem;
  font-size: 15px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  margin-top: .6rem;
`;

const CheckboxLabel = styled.label`
  margin-left: 1rem;
  color: white;
  font-size: 18px;
`;

// Question Component
const Question = ({ id, question, value, onChange, onSubmit, options, isMultiple, isSelectOption, isTextArea, handlePreviousQuestion, selection, setFetchedAdd }) => {
  const handleOptionClick = (option) => {
    onChange(option);
    onSubmit();
  };

  const [errors, setErrors] = useState({});
  // const [fetchedAdd, setFetchedAdd] = useState("");


  // Validation functions
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(phone);
  };

  const validateEmailPhone = (field, inputValue) => {
    // onChange({ ...value, [field]: inputValue });
    if (field === "email" && !validateEmail(inputValue)) {
      setErrors((prevErrors) => ({ ...prevErrors, email: "Invalid email format" }));
    } else if (field === "phone" && !validatePhone(inputValue)) {
      setErrors((prevErrors) => ({ ...prevErrors, phone: "Invalid phone number format" }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    }
  };

  const formatNumber = (num) => {
    if (num) {
      // Remove existing commas
      num = num.replace(/,/g, "");
      const formattedNum = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return formattedNum;
    }
  };

  const formatCurrency = (value) => {
    if (!value) return "";
    const number = parseFloat(value.replace(/,/g, ""));
    return isNaN(number) ? "" : number.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatPhoneNumber = (value) => {
    const cleaned = ("" + value).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  };


  return (<>
    <QuestionContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >

      {options && id == "financing" ? <SubHeader /> : ""}

      <div className="md:mb-4 mb-4 md:text-3xl text-2xl font-bold text-[#fd7e14] p-2 rounded-lg questionStyle text-center"> {question} </div>

      <div className={`flex ${options && id == "financing" ? "md:gap-10 gap-4 my-10 lg:my-0" : "w-full gap-6 flex-wrap px-5 md:px-0 md:mb-8 my-0 justify-center items-center"}  font-medium`}>
        {options && id !== "financing" ? (
          options.map((option) => (
            <MultipleChoiceButton
              key={option}
              selected={value === option}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </MultipleChoiceButton>
          ))
        ) : options && id == "financing" ? (
          <>
            <MultipleChoiceDesignButton
              selected={value === "Refinance"}
              onClick={() => handleOptionClick("Refinance")}
            >
              <div className="rounded-full bg-white py-5 px-5"> <img src={Refinance} height={61} width={61} className="md:auto w-20" alt="icon" /> </div>

              <span className="">Refinance</span>
            </MultipleChoiceDesignButton>
            <MultipleChoiceDesignButton
              selected={value === "New Purchase"}
              onClick={() => handleOptionClick("New Purchase")}
            >
              <div className="rounded-full bg-white py-5 px-5"> <img src={NewPurchase} height={61} width={61} className="md:auto w-20" alt="icon" /> </div>

              <span className="">New Purchase</span>
            </MultipleChoiceDesignButton>

          </>
        ) : isMultiple && id == "addressProvince" ? (
          <div className="w-full relative flex flex-col justify-center items-center">


            {/* {fetchedAdd && fetchedAdd && value.address ? <> */}
            {value.address ? <>
              <Input style={{ paddingRight: "70px" }}
                value={value.address || ""}
                placeholder="Enter your address(Autofetch)" readOnl
                onChange={(e) => onChange({ ...value, address: e.target.value })}
              // onClick={() => setFetchedAdd("")}
              // onClick={() => onChange({ ...value, address: undefined })}
              />
              {/* <span className="cursor-pointer absolute top-9 right-5 bg-gray-400 text-gray-900 rounded-full">x</span> */}
              <Tooltip
                placement="right"
                title="Click to search address"
                arrow
                className="text-gray-200 bg-gray-700 rounded-full p-2"
              >
                <SearchOutlinedIcon
                  fontSize="large"
                  className="cursor-pointer absolute top-7 right-5"
                  onClick={() => onChange({ ...value, address: undefined })}
                />
              </Tooltip>

            </>
              :
              <AutoCompleteBox onChange={onChange} value={value} setFetchedAdd={setFetchedAdd} />
            }


            <Select
              value={value.province || ""}
              onChange={(e) => onChange({ ...value, province: e.target.value })}
            >
              <option value="">Select your province</option>
              <option value="Alberta">Alberta</option>
              <option value="British Columbia">British Columbia</option>
              <option value="Ontario">Ontario</option>
            </Select>
            {value.address && value.province && (
              <Button onClick={onSubmit}>Next</Button>
            )}
          </div>
        ) : isSelectOption && id == "hearAboutUs" ? (
          <div className="w-full flex flex-col justify-center items-center">
            <Select
              value={value}
              onChange={(e) => onChange(e.target.value)}
            >
              <option value="">Select</option>
              {selection && selection.map((sel, i) => (
                <option key={i} value={sel}>{sel}</option>
              ))}
              {/* <option value="Social Media">Social Media</option>
              <option value="TV">TV</option> */}
            </Select>
            {value && (
              <Button onClick={onSubmit}>Next</Button>
            )}
          </div>
        ) : isMultiple && id == "nameEmailPhone" ? (
          <div className="w-full flex justify-center items-center flex-col">
            <Input
              type="text"
              value={value.firstname || ""}
              placeholder="Enter firstname"

              onChange={(e) => onChange({ ...value, firstname: e.target.value })} />
            <Input
              type="text"
              value={value.lastname || ""}
              placeholder="Enter lastname"
              onChange={(e) => onChange({ ...value, lastname: e.target.value })} />

            <Input
              type="email"
              value={value.email || ""}
              placeholder="Enter your email"
              onChange={(e) => { onChange({ ...value, email: e.target.value }); validateEmailPhone("email", e.target.value) }}
            />
            {errors.email && value.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            <Input
              type="phone"
              value={value.phone || ""}
              placeholder="Enter your phone number"
              maxLength={10}
              onChange={(e) => { onChange({ ...value, phone: formatPhoneNumber(e.target.value.replace(/[^0-9]/g, "")) }); validateEmailPhone("phone", e.target.value) }}
            />
            {errors.phone && value.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
            {value.firstname && value.lastname && value.email && value.phone && errors && !errors.phone && !errors.email && (
              <Button onClick={onSubmit}>Next</Button>
            )}
          </div>
        ) : isTextArea && id == "shareOtherDetail" ? (

          <div className="w-full">
            <Textarea
              value={value.additionalDetails || ""}
              placeholder="Enter details"
              onChange={(e) => onChange({ ...value, additionalDetails: e.target.value })}
            />
            <div className="mt-4 text-white">Consent*</div>
            <CheckboxContainer>
              <div>
                <input className="h-5 w-5 mt-[2px]"
                  type="checkbox"
                  checked={value.consent || false}
                  onChange={(e) => onChange({ ...value, consent: e.target.checked })}
                />
              </div>
              <CheckboxLabel>I agree to the storage and processing of my personal data according to this website's <Link to="https://www.freedomcapital.com/privacy-policy/" className="text-[#ff0042]" target="_blank" rel="noopener noreferrer">privacy policy.</Link> </CheckboxLabel>
            </CheckboxContainer>
            {value.additionalDetails && value.consent && (<>
              <div className="flex justify-around items-center mt-2">
                <Button onClick={handlePreviousQuestion}>Previous</Button> <span className="mr-5"></span> 
                <Button onClick={onSubmit}>Submit</Button>
              </div>
            </>
            )}
          </div>

        ) : (
          <div className="w-full relative flex flex-col justify-center items-center">

            {value && <span className="md:text-[17px] text-[16px] text-black text-lg absolute md:left-[13px] left-[13px] top-[30px] md:top-[29.2px]">$</span>}

            <InputDollar
              value={value}
              placeholder={`Enter ${question}`}
              onChange={(e) => onChange(formatNumber(e.target.value.replace(/[^0-9]/g, "")))}
              onBlur={(e) => onChange(formatCurrency(e.target.value))}
            />
            {value && (
              <Button onClick={onSubmit}>Next</Button>
            )}
          </div>
        )}


      </div>

    </QuestionContainer>
  </>);
};

// Main Form Component
const FluentForm = ({ postFormData }) => {
  const questions = [
    { id: "financing", type: "multipleChoice", question: "What do you need financing for?", options: ["Refinance", "New Purchase"] },

    { id: "addressProvince", type: "multipleInputs", question: "Please provide your address and province." },
    { id: "nameEmailPhone", type: "multipleInputs", question: "Please provide your name, email, and phone number." },

    { id: "loanPurpose", type: "multipleChoice", question: "What is the purpose of the loan?", options: ["Residential", "Land", "Construction", "Commercial"] },
    { id: "lookingFor", type: "multipleChoice", question: "What are you looking for?", options: ["1st Mortgage", "2nd Mortgage", "3rd Mortgage"] },

    { id: "hearAboutUs", type: "selectOptionInput", question: "How did you hear about us?", selection: ["Radio", "Google Search", "Social Media", "Podcast", "Online Magazine", "TV", "Paper Ad", "Referral", "Mail Postcard", "Other"] },

    { id: "traditionalLenders", type: "multipleChoice", question: "Have you applied with traditional lenders?", options: ["Yes", "No"] },
    { id: "timeframe", type: "multipleChoice", question: "What's your estimated timeframe?", options: ["Within 30 days", "Within 3 Months", "Within 8 Months", "Within 12 Months", "Unsure"] },
    { id: "valueOfProperty", type: "input", question: "Value of Property (Approximate)" },
    { id: "totalMortgage", type: "input", question: "Total Mortgages (Approximate)" },
    { id: "purchasePrice", type: "input", question: "Purchase price" },
    { id: "downPayment", type: "input", question: "Down payment" },
    { id: "shareOtherDetail", type: "textAreaInput", question: "Please add any other details you want to share." },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [fetchedAdd, setFetchedAdd] = useState("");

  // Determine which questions to display
  const questionsToDisplay = () => {
    const baseQuestions = questions.slice(0, 8);
    const conditionalQuestions = [];

    if (answers.financing === "Refinance") {
      conditionalQuestions.push(questions.find(q => q.id === "valueOfProperty"));
      conditionalQuestions.push(questions.find(q => q.id === "totalMortgage"));
    } else if (answers.financing === "New Purchase") {
      conditionalQuestions.push(questions.find(q => q.id === "purchasePrice"));
      conditionalQuestions.push(questions.find(q => q.id === "downPayment"));
    }
    conditionalQuestions.push(questions.find(q => q.id === "shareOtherDetail"));

    return baseQuestions.concat(conditionalQuestions);
  };

  const handleNextQuestion = () => {
    const questionsToShow = questionsToDisplay();
    if (currentQuestion < questionsToShow.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // setAnswers({})      // here onClicking on Submit button i empty form value state
      // setCurrentQuestion(0)
      handleSubmit();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };



  const handleChange = (value) => {
    const currentQuestionId = questionsToDisplay()[currentQuestion].id;


    setAnswers((prevAnswers) => {
      const updatedAnswers = { ...prevAnswers };
      const displayedQuestionIds = questionsToDisplay().map(q => q.id);

      Object.keys(updatedAnswers).forEach((key) => {
        if (!displayedQuestionIds.includes(key)) {
          delete updatedAnswers[key];
        }
      });

      return {
        ...updatedAnswers,
        [currentQuestionId]: value,
      };
    });

  };




  const handleSubmit = (e) => {
    // console.log("Form submitted with answers:", answers);
    postFormData(answers)
    // alert("Form successfully submitted");
  };

  const progressWidth = (Object.keys(answers).length / questionsToDisplay().length) * 100;

  return (<>

    <FormContainer>

      <div className="font-sans">

        <div className="md:m-1 m-2 rounded-lg p-2 max-w-[45rem]">

          <AnimatePresence mode="wait">
            {currentQuestion < questionsToDisplay().length && (
              <Question
                key={questionsToDisplay()[currentQuestion].id}
                id={questionsToDisplay()[currentQuestion].id}
                question={questionsToDisplay()[currentQuestion].question}
                value={answers[questionsToDisplay()[currentQuestion].id] || ""}
                onChange={handleChange}
                onSubmit={handleNextQuestion}
                handlePreviousQuestion={handlePreviousQuestion}
                isMultiple={questions[currentQuestion].type === "multipleInputs"}
                isSelectOption={questions[currentQuestion].type === "selectOptionInput"}
                isTextArea={questionsToDisplay()[currentQuestion].type === "textAreaInput"}
                options={questionsToDisplay()[currentQuestion].options}
                selection={questionsToDisplay()[currentQuestion].selection}
                setFetchedAdd={setFetchedAdd}
              />
            )}
          </AnimatePresence>

        </div>
      </div>

      <ProgressBarContainer>
        <Percentage>{progressWidth.toFixed(0)}%</Percentage>
        <ProgressBar>
          <Progress width={progressWidth} />
        </ProgressBar>
        <ArrowButton onClick={handlePreviousQuestion}> <img src={leftArrowSvg} alt="leftArrowSvg" className="w-5" /> </ArrowButton>
        <ArrowButton onClick={handleNextQuestion} disabled={!answers[questionsToDisplay()[currentQuestion].id]} > <img src={rightArrowSvg} alt="rightArrowSvg" className="w-5" /> </ArrowButton>
      </ProgressBarContainer>

    </FormContainer>

  </>);
};



const Home = () => {

  // const { data, isError, error, isLoading, isSuccess } = useSalesforceAuthQuery("")
  // console.log(data, isError, error, isLoading, isSuccess);

  // const libraries = ["places"];

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
    componentRestrictions: { country: "CA" },
    libraries: ["places"],
  });

  const [postFormData, result] = usePostFormDataMutation()


  useEffect(() => {
    console.log(result);
    if (result.isSuccess) {
      // Show success popup
      // alert("Lead saved in Salesforce successfully!");
      // Redirect to a URL
      window.location.href = 'https://www.freedomcapital.com/thank-you/';
    } else if (result.isError) {
      if (result?.error.data?.message.includes("Duplicate")) {
        alert(result?.error.data?.message);
      } else {
        alert(result?.error.data?.error);
        // Refresh the page
        // window.location.reload();
      }
    }
  }, [result]);


  return (
    <>
      <GlobalStyle />
      <section className="bg-black bg-[url('/black-white-view-new-york-city.svg')] bg-no-repeat bg-right-bottom">
        <FluentForm postFormData={postFormData} />
      </section>


    </>
  );
}

export default Home;




