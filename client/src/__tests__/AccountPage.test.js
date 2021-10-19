import AccountPage from "../pages/AccountPage";
import { MockedProvider } from '@apollo/client/testing';
import '@testing-library/jest-dom/extend-expect';
import TestRenderer from 'react-test-renderer'
import { render, screen } from '@testing-library/react'

test('should render account page', () => {
    render(<AccountPage/>)
    const main_component = screen.getByTestId('main-component')
    expect(main_component).toBeInTheDocument();
})