import { defineStore } from "pinia";
export interface checkListInterface {
    selectedAnswer: string;
    id: string;
    TestTakerResponse: {
        choiceId: string;
    }[];
}
export const useQuestionListStore = defineStore("questionList", {
    state: () => {
        return {
            questionList: [] as checkListInterface[],
        }
    },
    actions: {
        setQuestionList(questionList: checkListInterface[]) {
            this.questionList = questionList;
        },
        regiseterResponse(questionId: string, choiceId: string) {
            const question = this.questionList.find((obj) => obj.id === questionId);
            if (question) {
                question.selectedAnswer = choiceId;
            }
        },
        getIsQuestionAnswered(index: number) {
            const question = this.questionList[index];
            if (question) {
                return question.selectedAnswer !== "";
            }
        }
    },
    persist: {
        storage: persistedState.localStorage,
    },
}
);
