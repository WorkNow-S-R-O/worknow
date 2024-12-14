import Login from './components/index'
import './App.css'

function App() {

  return (
    <>
<div className='absolute top-0 left-0 w-full h-20 bg-blue-100'></div>
<div className='flex absolute top-0 left-0 m-4'>
  <img className='w-12 bottom-2 relative' src="/public/worker.png" alt="" />
  <h1 className='text-3xl'>newjobs</h1>
</div>
      <Login />
    </>
  )
}

export default App
