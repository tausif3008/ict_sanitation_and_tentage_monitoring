import React, { useMemo } from "react";
import { useSelector } from "react-redux";

const QuestionSelector = () => {
  const QuestionList = useSelector((state) => state?.questionSlice.name); // question
  const loading = useSelector((state) => state?.questionSlice.loading);

  // question Dropdown
  const QuestionDrop = useMemo(() => {
    return QuestionList?.data?.listings?.map((data) => {
      return (
        {
          value: data?.question_id,
          label: data?.question_en,
        } || []
      );
    });
  }, [QuestionList]);

  return { QuestionList, QuestionDrop, loading };
};

export default QuestionSelector;
