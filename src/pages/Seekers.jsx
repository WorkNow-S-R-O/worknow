import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";
import {Footer} from "../components/Footer";
import {Navbar} from "../components/Navbar";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import PaginationControl from "../components/PaginationControl";
import AddSeekerModal from "../components/form/AddSeekerModal";

const API_URL = import.meta.env.VITE_API_URL;

export default function Seekers() {
  const { t } = useTranslation();
  const { user } = useUser();
  const [seekers, setSeekers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isPremium = user?.publicMetadata?.isPremium || false;
  const isAdmin = user && user.emailAddresses?.[0]?.emailAddress === 'worknow.notifications@gmail.com';
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const seekersPerPage = 10;

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/seekers`)
      .then(res => setSeekers(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError("Ошибка загрузки соискателей"))
      .finally(() => setLoading(false));
  }, []);

  const handleAddSeeker = async (form) => {
    try {
      const payload = {
        name: form.name,
        contact: form.contact,
        city: form.city,
        description: form.description,
        slug: (form.name + '-' + form.description.split('\n')[0])
          .toLowerCase()
          .replace(/[^a-zа-я0-9]+/gi, '-')
          .replace(/^-+|-+$/g, ''),
        gender: form.gender,
        facebook: form.facebook,
        languages: form.languages,
        nativeLanguage: form.nativeLanguage,
      };
      const res = await axios.post(`${API_URL}/seekers`, payload);
      const created = res.data;
      setShowAddModal(false);
      if (created && created.id) {
        navigate(`/seekers/${created.id}`);
        return;
      }
      setLoading(true);
      axios.get(`${API_URL}/seekers`)
        .then(res => setSeekers(Array.isArray(res.data) ? res.data : []))
        .catch(() => setError("Ошибка загрузки соискателей"))
        .finally(() => setLoading(false));
    } catch {
      alert('Ошибка при добавлении соискателя');
    }
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === seekers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(seekers.map((s) => s.id));
    }
  };

  const handleStartDeleteMode = () => {
    setDeleteMode(true);
    setSelectedIds([]);
  };

  const handleCancelDeleteMode = () => {
    setDeleteMode(false);
    setSelectedIds([]);
  };

  const handleConfirmDelete = async () => {
    if (!window.confirm('Удалить выбранных соискателей?')) return;
    try {
      await Promise.all(selectedIds.map(id => axios.delete(`${API_URL}/seekers/${id}`)));
      toast.success('Успешно удалено');
      setSelectedIds([]);
      setDeleteMode(false);
      setLoading(true);
      axios.get(`${API_URL}/seekers`)
        .then(res => setSeekers(Array.isArray(res.data) ? res.data : []))
        .catch(() => setError("Ошибка загрузки соискателей"))
        .finally(() => setLoading(false));
    } catch {
      toast.error('Ошибка при удалении');
    }
  };

  // Пагинация
  const totalPages = Math.ceil(seekers.length / seekersPerPage);
  const currentSeekers = seekers.slice((currentPage - 1) * seekersPerPage, currentPage * seekersPerPage);

  return (
    <>
      <Navbar />
      <AddSeekerModal show={showAddModal} onClose={() => setShowAddModal(false)} onSubmit={handleAddSeeker} />
      <div className="container mt-5">
        <h2>{t("seekers") || "Соискатели"}</h2>
        {isAdmin && (
          <div className="mb-3 d-flex gap-2">
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              {showAddModal ? 'Скрыть форму' : 'Добавить соискателя'}
            </button>
            {!deleteMode && (
              <button className="btn btn-danger" onClick={handleStartDeleteMode}>
                Удалить соискателя
              </button>
            )}
            {deleteMode && (
              <>
                <button
                  className="btn btn-danger"
                  disabled={selectedIds.length === 0}
                  onClick={handleConfirmDelete}
                >
                  Подтвердить удаление
                </button>
                <button className="btn btn-secondary ms-2" onClick={handleCancelDeleteMode}>
                  Отмена
                </button>
              </>
            )}
          </div>
        )}
        {loading && <div>Загрузка...</div>}
        {error && <div className="text-danger">{error}</div>}
        {!loading && !error && seekers.length === 0 && <div>Нет соискателей</div>}
        {!loading && !error && seekers.length > 0 && (
          <>
            <table className="table table-bordered">
              <thead>
                <tr>
                  {isAdmin && deleteMode && (
                    <th>
                      <input
                        type="checkbox"
                        checked={selectedIds.length === seekers.length}
                        onChange={handleSelectAll}
                      />
                    </th>
                  )}
                  <th>Имя</th>
                  <th>Контакт</th>
                  <th>Город</th>
                  <th>Описание</th>
                </tr>
              </thead>
              <tbody>
                {currentSeekers.map(seeker => (
                  <tr key={seeker.id}>
                    {isAdmin && deleteMode && (
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(seeker.id)}
                          onChange={() => handleSelect(seeker.id)}
                        />
                      </td>
                    )}
                    <td>
                      <Link
                        to={`/seekers/${seeker.id}`}
                        style={{ color: '#1976d2', textDecoration: 'underline', cursor: 'pointer' }}
                      >
                        {seeker.name}
                      </Link>
                    </td>
                    <td>
                      {isPremium ? (
                        <Link
                          to={`/seekers/${seeker.id}`}
                          style={{ color: '#1976d2', textDecoration: 'underline', cursor: 'pointer' }}
                        >
                          {seeker.contact}
                        </Link>
                      ) : (
                        <Link
                          to={`/seekers/${seeker.id}`}
                          style={{ color: '#1976d2', textDecoration: 'underline', cursor: 'pointer' }}
                        >
                          {'****'}
                        </Link>
                      )}
                    </td>
                    <td>{seeker.city}</td>
                    <td>{seeker.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Пагинация */}
            {totalPages > 1 && (
              <PaginationControl
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
}