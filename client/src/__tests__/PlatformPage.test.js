import PlatformPage from "../pages/PlatformPage";
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react'

test('should render account page', () => {
    render(<PlatformPage/>);
    const main_component = screen.getByTestId('main-component');
    expect(main_component).toBeInTheDocument();
})

test('should display correct username', () => {
    let username = "platform_user"
    render(<PlatformPage username={username} />);
    const main_component = screen.getByTestId('main-component');
    expect(main_component).toHaveTextContent(username);
})

test('should display correct follower count', () => {
    let follower_count = 200
    render(<PlatformPage follower_count={follower_count} />);
    const main_component = screen.getByTestId('main-component');
    expect(main_component).toHaveTextContent(follower_count);
})