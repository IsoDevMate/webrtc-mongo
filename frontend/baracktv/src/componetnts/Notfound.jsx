import { useNavigate } from 'react-router-dom';
 const NotFound = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    // Use the navigate function here, for example, redirect to a different route:
    navigate('/errorpage');
  };

  return (
    <div className="erronous">
      <h2>ERROR OCCURRED</h2>
      <p>Page Not Found</p>
      <button onClick={handleNavigate}>Go Home</button>
    </div>
  );
};

export default NotFound;