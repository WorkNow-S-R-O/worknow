import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="h-screen flex justify-center items-center flex-col">
      <img
        className="w-full md:w-1/3"
        src="./assets/images/404.jpg"
        alt="error"
      />
      <div className="btn btn-primary mt-4 md:mt-6 text-sm md:text-lg">
        <Link to="/" className="text-white no-underline">
          <h1 className="md:text-5xl text-sm ">Back to home</h1>
        </Link>
      </div>
    </div>
  );
}