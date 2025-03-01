import React from "react";
import { Form } from "react-bootstrap";

interface IProps {
  question: {
    question: string;
    answers: (string | number)[];
  };
  questionNumber: number;
  setAnswers: (
    value: React.SetStateAction<{
      [key: string]: string | number;
    }>
  ) => void;
}

const UserQuestions = ({
  question,
  questionNumber,
  setAnswers
}: IProps) => {
  const submitAnswersHandler = async (e?: any) => {
    // answersCopy[questionNumber] = e.target.value;
     setAnswers((answersCopy) => ({
      ...answersCopy,
      [questionNumber]: e.target.value,
    }))
  };

  return (
    <Form.Group className="UserQuestions mt-5">
      <Form.Label>{question.question}</Form.Label>
      <Form.Control as="select" onChange={submitAnswersHandler}>
        {question.answers.map((answer, index) => (
          <option value={answer} key={index}>{answer}</option>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export default UserQuestions;
