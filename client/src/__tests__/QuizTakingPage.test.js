import QuizTakingPage from '../pages/QuizTakingPage'
import { MockedProvider } from '@apollo/client/testing';
import '@testing-library/jest-dom/extend-expect';
import TestRenderer from 'react-test-renderer'

test('should render quiz taking page', () => {
    const component = TestRenderer.create(
        <MockedProvider>
            <QuizTakingPage/>
        </MockedProvider>
    )

    const tree = component.toJSON()
    // expect(tree.children).toContain('main-component')
})