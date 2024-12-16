import { Link } from "react-router-dom";
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Desktop Version */}
      <div className='d-none d-lg-block'>
        <div className='absolute top-0 left-0 w-full h-16 bg-[#e3f2fd]'></div>
        <div className='flex absolute top-0 left-0 m-3'>
        <Link to="/" className="d-flex align-items-center no-underline text-black">
      <img className='w-12 bottom-2 relative ml-0' src="/assets/images/worker.png" alt="Logo" />
      <h1 className='text-3xl ml-0'>worknow</h1>
       </Link>
          <ul className='flex justify-center items-center ml-20 gap-2 mb-2 text-gray-500'>
            <li className='mr-3'>
              <Link to="/vacancies" className='text-lg font-normal text-gray-600 hover:text-gray-900 no-underline'>Vacancies</Link>
            </li>
            <li className='mr-3'>
              <Link to="/about" className='text-lg font-normal text-gray-600 hover:text-gray-900 no-underline'>Job map</Link>
            </li>
            <li>
              <Link to="/contact" className='text-lg font-normal text-gray-600 hover:text-gray-900 no-underline'>Facebook groups</Link>
            </li>
          </ul>
        </div>
        <button type="button" className="btn btn-primary flex absolute top-0 right-0 m-3">Login</button>
        <button type="button" className="btn btn-warning flex absolute top-0 right-20 m-3">Premium</button>
      </div>

      {/* Mobile Version */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light d-lg-none fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img className='w-12 me-2' src="/assets/images/worker.png" alt="Logo" />
            <h1 className='text-3xl m-0'>worknow</h1>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-controls="navbarNav"
            aria-expanded={isExpanded}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`navbar-collapse ${isExpanded ? "show" : "collapse"}`} id="navbarNav">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className='nav-link text-lg font-normal text-gray-600 hover:text-gray-900 no-underline' to="/vacancies">Vacancies</Link>
              </li>
              <li className="nav-item">
                <Link className='nav-link text-lg font-normal text-gray-600 hover:text-gray-900 no-underline' to="/about">Job map</Link>
              </li>
              <li className="nav-item">
                <Link className='nav-link text-lg font-normal text-gray-600 hover:text-gray-900 no-underline' to="/contact">Facebook groups</Link>
              </li>
            </ul>

            <div className="d-flex flex-column gap-2 mt-3">
              <button type="button" className="btn btn-primary">Login</button>
              <button type="button" className="btn btn-warning">Premium</button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export { Navbar };
