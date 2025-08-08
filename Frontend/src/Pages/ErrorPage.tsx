import {
  NavLink,
  useNavigate,
  useRouteError,
  isRouteErrorResponse,
} from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();
  const goToPreviousPage = () => navigate(-1);

  const error = useRouteError();

  // Show custom 404 screen
  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <section className="Error">
        <div id="error-txt">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src="/a.jpg"
              alt="404 Page"
              style={{ height: '35%', width: '35%', cursor: 'pointer' }}
            />
          </div>
        </div>

        <div
          style={{
            fontFamily: 'sans-serif',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <h2 style={{ fontSize: '35px' }}>The page you are looking for is not found...</h2>
          <div>
            <NavLink
              to="/"
              style={{
                backgroundColor: 'orange',
                color: 'white',
                padding: '10px 30px',
                marginRight: '10px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                border: 'none',
                transition: '0.3s',
                fontSize: "15px",
                cursor: 'pointer',
                display: 'inline-block',
              }}
            >
               Back to Home page
            </NavLink>

            <button
              onClick={goToPreviousPage}
              style={{
                backgroundColor: 'black',
                color: 'white',
                padding: '10px 30px',
                fontSize: "15px",
                borderRadius: '8px',
                fontWeight: 'bold',
                border: 'none',
                transition: '0.3s',
                cursor: 'pointer',
              }}
            >
               Back to Previous page
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Generic fallback for any other error
  return (
    <section className="Error">
      <h2>Something went wrong.</h2>
      <NavLink className="button" to="/">
        Back to Home page
      </NavLink>
    </section>
  );
};

export default ErrorPage;
