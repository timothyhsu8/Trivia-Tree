import SearchResultsPage from "../pages/SearchResultsPage";
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react'

test('should render account page', () => {
    render(<SearchResultsPage/>);
    const main_component = screen.getByTestId('main-component');
    expect(main_component).toBeInTheDocument();
})

test('should display correct search text', () => {
    render(<SearchResultsPage/>);
    const main_component = screen.getByTestId('main-component');
    expect(main_component).toHaveTextContent("Search Results for");
})

test('should display correct user search', () => {
    render(<SearchResultsPage/>);
    const main_component = screen.getByTestId('main-component');
    const user_search = "video game music"
    expect(main_component).toHaveTextContent(user_search);
})