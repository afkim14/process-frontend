export type User = {
    email: string;
    name: string;
    picture_url: string;
    subscription: {
        type: string;
        limit_questions: number;
    }
}

export type Question = {
    id: number;
    question_text: string;
    initial_thought: string;
    answer_text: string;
    short_label: string;
    parent_question_id: number;
    created_at: Date;
    updated_at: Date;
    tags: string;
    user_id: number;
    children: Array<Question>;
}

export type Source = {
    id: number;
    title: string;
    description: string;
    url: string;
    image_url: string;
    user_id: number;
    question_id: number;
}

export type Suggestions = {
    [key: string]: Array<Suggestion>;
}

export type Suggestion = {
    name: string;
    url: string;
}

export type Subscription = {
    id: number;
    name: string;
    type: string;
    price_per_month: number;
    limit_questions: number;
}