import { NavLink, useNavigate, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import './ErrorPage.css';

const ErrorPage = () => {
  const navigate = useNavigate();
  const goToPreviousPage = () => navigate(-1);

  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <section className="Error">
        <div id="error-txt">
          <img src="/a.jpg" alt="404 Page" />
        </div>

        <div className="error-content">
          <h2>The page you are looking for is not found...</h2>
          <div>
            <NavLink to="/" className="error-btn home">
              Back to Home page
            </NavLink>

            <button onClick={goToPreviousPage} className="error-btn previous">
              Back to Previous page
            </button>
          </div>
        </div>
      </section>
    );
  }
}

export default ErrorPage;
