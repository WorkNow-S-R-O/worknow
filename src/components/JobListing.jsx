import { useState } from "react";
import { Pagination, Dropdown, DropdownButton } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const JobListing = () => {
  const [phoneVisible, setPhoneVisible] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCity, setSelectedCity] = useState("Выбрать город");
  const jobsPerPage = 10;


  const handleShowPhone = (index) => {
    setPhoneVisible(index);
  };

  const jobData = [
    {
      title: "Мойка автомобилей",
      location: "Тель-Авив",
      salary: "45 - 55",
      description:
        "📍 Бней Айш 🚘 Мойка машин 💰 45 шекелей в час ⏰ С 7:00 до 16:00 🚕 Подвозка с Ашкелона и Ашдода ✅ Обучение на месте ✅ Проезд оплачивается ✅ Любые документы",
      phone: "+972-053-677-6686",
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

  const filteredJobs = selectedCity === "Выбрать город" ? jobData : jobData.filter(job => job.location === selectedCity);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setCurrentPage(1);
  };

  return (
    <div className="d-flex flex-column">
      <div className="flex-grow-1 d-flex flex-column align-items-center mt-40 min-h-screen ">
        <DropdownButton title={<span><i className="bi bi-geo-alt"></i> {selectedCity}</span>} variant="primary" className="mb-3">
          <Dropdown.Item onClick={() => handleCitySelect("Выбрать город")}>Все города</Dropdown.Item>
          <Dropdown.Item onClick={() => handleCitySelect("Тель-Авив")}>Тель-Авив</Dropdown.Item>
          <Dropdown.Item onClick={() => handleCitySelect("Хайфа")}>Хайфа</Dropdown.Item>
        </DropdownButton>

        <div className="d-flex flex-column align-items-center flex-grow-1">
          {currentJobs.map((job, index) => (
            <div key={index} className="d-flex card shadow-sm mb-4" style={{ width: "90%", maxWidth: "700px", borderRadius: "10px" }}>
              <div className="card-body">
                <h5 className="card-title text-primary">{job.title}</h5>
                <p className="card-text">
                  <strong>Зарплата в час:</strong> {job.salary}<br />
                  <strong>Местоположение:</strong> {job.location}<br />
                </p>
                <p className="card-text">{job.description}</p>
                <div className="d-flex align-items-center">
                  <button onClick={() => handleShowPhone(index)} className="btn btn-primary me-3">Показать телефон</button>
                  <span className={phoneVisible === index ? "" : "text-muted"}>{phoneVisible === index ? job.phone : "Скрыт"}</span>
                </div>
              </div>
            </div>
          ))}
        </div> 
      </div>

      <div className="mt-auto d-flex justify-content-center">
        <Pagination>
          {[...Array(totalPages).keys()].map((page) => (
            <Pagination.Item key={page + 1} active={page + 1 === currentPage} onClick={() => handlePageChange(page + 1)}>
              {page + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </div>
  );
};

export { JobListing };
