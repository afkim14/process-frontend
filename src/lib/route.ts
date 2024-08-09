import { Question } from '@/utils/types';

class Route {
    getQuestionRoute = (question: Question) => {
        return `/question?id=${question.id}&mode=edit`;
    }
}

const route = new Route();
export default route;