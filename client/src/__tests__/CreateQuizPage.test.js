import CreateQuizPage from "../pages/CreateQuizPage";
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react'

test('should render quiz creation page', () => {
    render(<CreateQuizPage/>);
    const main_component = screen.getByTestId('main-component');
    expect(main_component).toBeInTheDocument();
})

test('should display correct search text', () => {
    render(<CreateQuizPage/>);
    const main_component = screen.getByTestId('main-component');
    expect(main_component).toHaveTextContent("Search Results for");
})

test('should display correct user search', () => {
    render(<CreateQuizPage/>);
    const main_component = screen.getByTestId('main-component');
    const user_search = "video game music"
    expect(main_component).toHaveTextContent(user_search);
})