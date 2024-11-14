import React from "react";
import { useSelector } from "react-redux";

const QuestionSelector = () => {
  const QuestionList = useSelector((state) => state?.questionSlice.name); // question
  const loading = useSelector((state) => state?.questionSlice.loading);

  const QuestionDrop = QuestionList?.data?.listings?.map((data) => {
    // question Dropdown
    return (
      {
        value: data?.question_id,
        label: data?.question_en,
      } || []
    );
  });

  return { QuestionList, QuestionDrop, loading };
};

export default QuestionSelector;
