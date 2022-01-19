import { useNavigate, useLocation } from 'react-router-dom';

export const withRouter = (Component) => {
    const Wrapper = (props) => {
        const history = useNavigate();
        const location = useLocation();

        return (
            <Component
                history={history}
                location={location}
                {...props}
            />
        );
    };
    
    return Wrapper;
};