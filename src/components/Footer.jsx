import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
  return (
    <footer
      className="d-flex justify-content-center align-items-center py-3 mt-auto "
      style={{
        backgroundColor: "#e3f2fd",
        width: "100%",
      }}
    >
      <a
        href="https://t.me/WORKNOW_JOBS"
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-outline-primary d-flex align-items-center"
        style={{
          borderRadius: "5px",
          textDecoration: "none",
        }}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg"
          alt="Telegram"
          style={{
            width: "24px",
            height: "24px",
            marginRight: "8px",
          }}
        />
        Наш Telegram
      </a>
    </footer>
  );
};

export { Footer };
