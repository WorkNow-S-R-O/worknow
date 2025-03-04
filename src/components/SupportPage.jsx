const SupportPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 text-center">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          По всем вопросам писать на почту:
        </h2>
        <a
          href="mailto:worknow.notifications@gmail.com"
          className="text-blue-600 text-lg font-medium hover:underline"
        >
          worknow.notifications@gmail.com
        </a>
      </div>
    </div>
  );
};

export default SupportPage;
