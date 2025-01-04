import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const JobListing = () => {
  const [phoneVisible, setPhoneVisible] = useState(false);

  const handleShowPhone = () => {
    setPhoneVisible(true);
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
  ];

  return (
    <div
      className="container d-flex flex-column align-items-center justify-content-center"
      style={{
        height: "100%",
        overflowY: "auto",
        width: "100%",
        paddingTop: "`100px",
        marginTop: "20rem",
      }}
    >
      {jobData.map((job, index) => (
        <div key={index} className="card shadow-sm mb-5 w-75">
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
                onClick={() => handleShowPhone(true)}
                className="btn btn-primary me-2"
              >
                Показать телефон
              </button>
              <span className={phoneVisible ? "" : "text-muted"}>
                {phoneVisible ? job.phone : "Скрыт"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export { JobListing };
