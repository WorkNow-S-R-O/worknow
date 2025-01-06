import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Pagination } from "react-bootstrap";

const JobListing = () => {
  const [phoneVisible, setPhoneVisible] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  const handleShowPhone = (index) => {
    setPhoneVisible(index);
  };

  const jobData = [
    {
      title: "Frontend Developer",
      company: "Tech Corp",
      location: "Тель-Авив",
      salary: "₪15,000 - ₪20,000",
      experience: "2-3 года",
      employmentType: "Полная занятость",
      description:
        "Мы ищем опытного Frontend Developer для работы с современными технологиями (React, Vue.js). Если вы ищете вызов и хотите работать в динамичной команде, эта вакансия для вас!",
      phone: "+972-50-123-4567",
    },
    {
      title: "Backend Developer",
      company: "Backend Solutions",
      location: "Хайфа",
      salary: "₪18,000 - ₪25,000",
      experience: "3-5 лет",
      employmentType: "Полная занятость",
      description:
        "Присоединяйтесь к нашей команде, чтобы разработать масштабируемые серверные решения. Мы используем Node.js и Python.",
      phone: "+972-50-765-4321",
    },

    {
      title: "Backend Developer",
      company: "Backend Solutions",
      location: "Хайфа",
      salary: "₪18,000 - ₪25,000",
      experience: "3-5 лет",
      employmentType: "Полная занятость",
      description:
        "Присоединяйтесь к нашей команде, чтобы разработать масштабируемые серверные решения. Мы используем Node.js и Python.",
      phone: "+972-50-765-4321",
    },

    {
      title: "Backend Developer",
      company: "Backend Solutions",
      location: "Хайфа",
      salary: "₪18,000 - ₪25,000",
      experience: "3-5 лет",
      employmentType: "Полная занятость",
      description:
        "Присоединяйтесь к нашей команде, чтобы разработать масштабируемые серверные решения. Мы используем Node.js и Python.",
      phone: "+972-50-765-4321",
    },

    {
      title: "Backend Developer",
      company: "Backend Solutions",
      location: "Хайфа",
      salary: "₪18,000 - ₪25,000",
      experience: "3-5 лет",
      employmentType: "Полная занятость",
      description:
        "Присоединяйтесь к нашей команде, чтобы разработать масштабируемые серверные решения. Мы используем Node.js и Python.",
      phone: "+972-50-765-4321",
    },

    {
      title: "Backend Developer",
      company: "Backend Solutions",
      location: "Хайфа",
      salary: "₪18,000 - ₪25,000",
      experience: "3-5 лет",
      employmentType: "Полная занятость",
      description:
        "Присоединяйтесь к нашей команде, чтобы разработать масштабируемые серверные решения. Мы используем Node.js и Python.",
      phone: "+972-50-765-4321",
    },

    {
      title: "Backend Developer",
      company: "Backend Solutions",
      location: "Хайфа",
      salary: "₪18,000 - ₪25,000",
      experience: "3-5 лет",
      employmentType: "Полная занятость",
      description:
        "Присоединяйтесь к нашей команде, чтобы разработать масштабируемые серверные решения. Мы используем Node.js и Python.",
      phone: "+972-50-765-4321",
    },

    {
      title: "Backend Developer",
      company: "Backend Solutions",
      location: "Хайфа",
      salary: "₪18,000 - ₪25,000",
      experience: "3-5 лет",
      employmentType: "Полная занятость",
      description:
        "Присоединяйтесь к нашей команде, чтобы разработать масштабируемые серверные решения. Мы используем Node.js и Python.",
      phone: "+972-50-765-4321",
    },

    {
      title: "Backend Developer",
      company: "Backend Solutions",
      location: "Хайфа",
      salary: "₪18,000 - ₪25,000",
      experience: "3-5 лет",
      employmentType: "Полная занятость",
      description:
        "Присоединяйтесь к нашей команде, чтобы разработать масштабируемые серверные решения. Мы используем Node.js и Python.",
      phone: "+972-50-765-4321",
    },

    {
      title: "Backend Developer",
      company: "Backend Solutions",
      location: "Хайфа",
      salary: "₪18,000 - ₪25,000",
      experience: "3-5 лет",
      employmentType: "Полная занятость",
      description:
        "Присоединяйтесь к нашей команде, чтобы разработать масштабируемые серверные решения. Мы используем Node.js и Python.",
      phone: "+972-50-765-4321",
    },

    {
      title: "Backend Developer",
      company: "Backend Solutions",
      location: "Хайфа",
      salary: "₪18,000 - ₪25,000",
      experience: "3-5 лет",
      employmentType: "Полная занятость",
      description:
        "Присоединяйтесь к нашей команде, чтобы разработать масштабируемые серверные решения. Мы используем Node.js и Python.",
      phone: "+972-50-765-4321",
    },

    {
      title: "Backend Developer",
      company: "Backend Solutions",
      location: "Хайфа",
      salary: "₪18,000 - ₪25,000",
      experience: "3-5 лет",
      employmentType: "Полная занятость",
      description:
        "Присоединяйтесь к нашей команде, чтобы разработать масштабируемые серверные решения. Мы используем Node.js и Python.",
      phone: "+972-50-765-4321",
    },

    {
      title: "Backend Developer",
      company: "Backend Solutions",
      location: "Хайфа",
      salary: "₪18,000 - ₪25,000",
      experience: "3-5 лет",
      employmentType: "Полная занятость",
      description:
        "Присоединяйтесь к нашей команде, чтобы разработать масштабируемые серверные решения. Мы используем Node.js и Python.",
      phone: "+972-50-765-4321",
    },
  ];

  // Разделяем данные на страницы
  const totalPages = Math.ceil(jobData.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobData.slice(indexOfFirstJob, indexOfLastJob);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div
      className="flex items-center justify-content-center flex-column align-items-center mt-40"
    >
      <div className="d-flex flex-column align-items-center">
        {currentJobs.map((job, index) => (
          <div
            key={index}
            className="d-flex card shadow-sm mb-4"
            style={{
              width: "90%",
              justifyContent: "center",
              alignItems: "center",
              maxWidth: "700px",
              borderRadius: "10px",
            }}
          >
            <div className="card-body">
              <h5 className="card-title text-primary">{job.title}</h5>
              <h6 className="card-subtitle mb-2 text-muted">
                Компания: {job.company}
              </h6>
              <p className="card-text">
                <strong>Локация:</strong> {job.location}
                <br />
                <strong>Зарплата:</strong> {job.salary}
                <br />
                <strong>Требуемый опыт:</strong> {job.experience}
                <br />
                <strong>Тип занятости:</strong> {job.employmentType}
              </p>
              <p className="card-text">{job.description}</p>
              <div className="d-flex align-items-center">
                <button
                  onClick={() => handleShowPhone(index)}
                  className="btn btn-primary me-3"
                >
                  Показать телефон
                </button>
                <span className={phoneVisible === index ? "" : "text-muted"}>
                  {phoneVisible === index ? job.phone : "Скрыт"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Пагинация */}
      <Pagination>
        {[...Array(totalPages).keys()].map((page) => (
          <Pagination.Item
            key={page + 1}
            active={page + 1 === currentPage}
            onClick={() => handlePageChange(page + 1)}
          >
            {page + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
};

export { JobListing };
