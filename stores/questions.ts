import { defineStore } from "pinia";
export interface itemInterface {
  choices: {
    id: string;
    title: string;
    image: string | null;
  }[];
  selectedAnswer: string;
  id: string;
  title: string;
  image: string | null;
}

export const useQuestionListStore = defineStore("questionList", {
  state: () => {
 return  {  
    questionList: [] as itemInterface[] ,
    examFinished: false,
    testTakerId : '',
    examId : '',
    }
  },  

  actions: {
    setTestTaker(testTakerId : string){
      this.testTakerId = testTakerId;
    },
    setExamId(examId : string){
      this.examId = examId;
    },
   
    addQuestionItem(item: itemInterface) {
      this.questionList.push(item);
    },

    regiseterResponse(questionId: string, choiceId: string) {
      const question = this.questionList.find((obj) => obj.id === questionId);
      if (question) {
        question.selectedAnswer = choiceId;
      }
    },
    setQuestions(questions: itemInterface[]) {
     this.questionList = questions;
    },
   
    getAllQuestions() {
        return this.questionList;
    },
    
  
 
  },
  
  persist: {
    storage: persistedState.localStorage,
  },
}
);
