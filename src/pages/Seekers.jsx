import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import PaginationControl from "../components/PaginationControl";
import AddSeekerModal from "../components/form/AddSeekerModal";
import '../css/seekers-table-mobile.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function Seekers() {
  const { t } = useTranslation();
  const { user } = useUser();
  const [seekers, setSeekers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const seekersPerPage = 10;

  const [isPremium, setIsPremium] = useState(false);
  const isAdmin = user?.emailAddresses?.[0]?.emailAddress === 'worknow.notifications@gmail.com';
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/seekers`)
      .then(res => setSeekers(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError("Ошибка загрузки соискателей"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    axios.get(`${API_URL}/users/${user.id}`)
      .then(res => setIsPremium(!!res.data.isPremium || !!res.data.premiumDeluxe))
      .catch(() => setIsPremium(false));
  }, [user]);

  const handleAddSeeker = async (form) => {
    try {
      const res = await axios.post(`${API_URL}/seekers`, form);
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
    if (selectedIds.length === currentSeekers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentSeekers.map((s) => s.id));
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

  const totalPages = Math.ceil(seekers.length / seekersPerPage);
  const currentSeekers = seekers.slice((currentPage - 1) * seekersPerPage, currentPage * seekersPerPage);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <AddSeekerModal show={showAddModal} onClose={() => setShowAddModal(false)} onSubmit={handleAddSeeker} />
      <div className="container" style={{ paddingTop: '100px' }}>
        <h2 className="fs-4">{t("seekers") || "Соискатели"}</h2>
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
                <tr className="table-light">
                  {isAdmin && deleteMode && (
                    <th>
                      <input
                        type="checkbox"
                        checked={selectedIds.length === currentSeekers.length && currentSeekers.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                  )}
                  <th>{t('seekers_table_name')}</th>
                  <th>{t('seekers_table_contact')}</th>
                  <th>{t('seekers_table_city')}</th>
                  <th>{t('seekers_table_description')}</th>
                </tr>
              </thead>
              <tbody>
                {currentSeekers.map((seeker, index) => (
                  <tr key={seeker.id} className={seeker.isDemanded ? 'table-primary' : ''}>
                    {isAdmin && deleteMode && (
                      <td className="py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(seeker.id)}
                          onChange={() => handleSelect(seeker.id)}
                        />
                      </td>
                    )}
                    <td className="py-3">
                      <Link
                        to={`/seekers/${seeker.id}`}
                        state={{ seekerIds: seekers.map(s => s.id), currentIndex: (currentPage - 1) * seekersPerPage + index }}
                        style={{ color: '#1976d2', textDecoration: 'underline', cursor: 'pointer' }}
                      >
                        {seeker.name}
                      </Link>
                    </td>
                    <td className="py-3">
                      <Link
                        to={`/seekers/${seeker.id}`}
                        state={{ seekerIds: seekers.map(s => s.id), currentIndex: (currentPage - 1) * seekersPerPage + index }}
                        style={{ color: '#1976d2', textDecoration: 'underline', cursor: 'pointer' }}
                      >
                        {isPremium ? seeker.contact : '****'}
                      </Link>
                    </td>
                    <td className="py-3">{seeker.city}</td>
                    <td className="py-3">{seeker.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && (
              <PaginationControl
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}