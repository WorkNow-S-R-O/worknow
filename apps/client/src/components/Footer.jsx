import "bootstrap/dist/css/bootstrap.min.css";
import { Telegram, Facebook } from 'react-bootstrap-icons';

const Footer = () => {
  return (
    <footer
      className="d-flex justify-content-center align-items-center py-3 mt-auto "
      style={{
        backgroundColor: "#e3f2fd",
        width: "100%",
      }}
    >
      <div className="d-flex gap-4">
        <a
          href="https://t.me/WORKNOW_JOBS"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Telegram"
        >
          <Telegram color="royalblue" size={28} />
        </a>
        <a
          href="https://www.facebook.com/groups/763040732570299"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          <Facebook color="royalblue" size={28} />
        </a>
      </div>
    </footer>
  );
};

export { Footer };
