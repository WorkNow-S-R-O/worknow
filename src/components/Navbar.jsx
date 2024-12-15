import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <>
      <div className='absolute top-0 left-0 w-full h-16 bg-[#e3f2fd]'></div>
      <div className='flex absolute top-0 left-0 m-3'>
      <img className='w-12 bottom-2 relative ml-0' src="/public/worker.png" alt="" />
      <h1 className='text-3xl ml-0'>worknow</h1>
        <ul className='flex justify-center items-center ml-20 gap-2 mb-2 text-gray-500'>
          <li className='mr-3'>
            <Link to="/" className='text-lg font-normal text-gray-600 hover:text-gray-900'>Home</Link>
          </li>
          <li className='mr-3'>
            <Link to="/about" className='text-lg font-normal text-gray-600 hover:text-gray-900'>About</Link>
          </li>
          <li>
            <Link to="/contact" className='text-lg font-normal text-gray-600 hover:text-gray-900'>Contact</Link>
          </li>
        </ul>
      </div>
      <button type="button" className="btn btn-primary flex absolute top-0 right-0 m-3 ">Login</button>
    </>
  )
}

export {Navbar}