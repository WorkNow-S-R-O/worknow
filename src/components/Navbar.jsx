const Navbar = () => {
  return (
    <>
    <div className='absolute top-0 left-0 w-full h-16 bg-blue-100'></div><div className='flex absolute top-0 left-0 m-3'>
          <img className='w-12 bottom-2 relative' src="/public/worker.png" alt="" />
          <h1 className='text-3xl'>worknow</h1>
      </div>
      
      <button type="button" className="btn btn-primary flex absolute top-0 right-0 m-3 ">Login</button>

      </>
  )
}

export {Navbar}