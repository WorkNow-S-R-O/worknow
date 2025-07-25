import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Facebook } from "react-bootstrap-icons";
import { Helmet } from "react-helmet-async";
import PaginationControl from "../components/PaginationControl";
import AddSeekerModal from "../components/form/AddSeekerModal";
import '../css/seekers-table-mobile.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useLoadingProgress } from '../hooks/useLoadingProgress';

const API_URL = import.meta.env.VITE_API_URL;

// Helper function to parse contact field and extract Facebook link
const parseContactField = (contact) => {
  if (!contact) return { phone: '', facebook: null };
  
  // Split by comma to separate phone and Facebook
  const parts = contact.split(',').map(part => part.trim());
  
  let phone = '';
  let facebook = null;
  
  parts.forEach(part => {
    if (part.includes('facebook.com') || part.includes('fb.com')) {
      // Extract Facebook URL
      let fbUrl = part;
      if (!fbUrl.startsWith('http')) {
        fbUrl = 'https://' + fbUrl;
      }
      facebook = fbUrl;
    } else {
      // This is likely a phone number
      phone = part;
    }
  });
  
  return { phone, facebook };
};

// Helper function to render contact cell
const renderContactCell = (contact, isPremium, seekerId, seekerIds, currentIndex, facebook) => {
  const linkProps = {
    to: `/seekers/${seekerId}`,
    state: { seekerIds, currentIndex },
    style: { color: '#1976d2', textDecoration: 'underline', cursor: 'pointer' }
  };
  
  if (!isPremium) {
    return (
      <Link {...linkProps}>
        ****
      </Link>
    );
  }
  
  // Parse contact field to extract Facebook if it's embedded there
  const { phone: parsedPhone, facebook: parsedFacebook } = parseContactField(contact);
  
  // Use dedicated facebook field if available, otherwise use parsed facebook
  const facebookUrl = facebook || parsedFacebook;
  const displayContact = parsedPhone || contact;
  
  return (
    <div className="d-flex align-items-center gap-2">
      {displayContact && (
        <Link {...linkProps}>
          {displayContact}
        </Link>
      )}
      {facebookUrl && (
        <a
          href={facebookUrl.startsWith('http') ? facebookUrl : `https://${facebookUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-decoration-none"
          title="Facebook Profile"
        >
          <Facebook className="text-primary fs-5" />
        </a>
      )}
    </div>
  );
};

export default function Seekers() {
  const { t } = useTranslation();
  const { user } = useUser();
  const { startLoadingWithProgress, completeLoading } = useLoadingProgress();
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
    startLoadingWithProgress(1500); // Start loading progress
    
    axios.get(`${API_URL}/api/seekers`)
      .then(res => {
        setSeekers(Array.isArray(res.data) ? res.data : []);
        completeLoading(); // Complete loading when done
      })
      .catch(() => {
        setError("Ошибка загрузки соискателей");
        completeLoading(); // Complete loading even on error
      })
      .finally(() => setLoading(false));
  }, []); // Removed loading functions from dependencies

  useEffect(() => {
    if (!user) return;
    axios.get(`${API_URL}/api/users/${user.id}`)
      .then(res => setIsPremium(!!res.data.isPremium))
      .catch(() => setIsPremium(false));
  }, [user]);

  const handleAddSeeker = async (form) => {
    startLoadingWithProgress(2000); // Start loading progress for adding seeker
    
    try {
      const res = await axios.post(`${API_URL}/api/seekers`, form);
      const created = res.data;
      setShowAddModal(false);
      if (created && created.id) {
        completeLoading(); // Complete loading when done
        navigate(`/seekers/${created.id}`);
        return;
      }
      setLoading(true);
      axios.get(`${API_URL}/api/seekers`)
        .then(res => {
          setSeekers(Array.isArray(res.data) ? res.data : []);
          completeLoading(); // Complete loading when done
        })
        .catch(() => {
          setError("Ошибка загрузки соискателей");
          completeLoading(); // Complete loading even on error
        })
        .finally(() => setLoading(false));
    } catch {
      completeLoading(); // Complete loading even on error
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
    
    startLoadingWithProgress(2500); // Start loading progress for deletion
    
    try {
      await Promise.all(selectedIds.map(id => axios.delete(`${API_URL}/api/seekers/${id}`)));
      completeLoading(); // Complete loading when done
      toast.success('Успешно удалено');
      setSelectedIds([]);
      setDeleteMode(false);
      setLoading(true);
      axios.get(`${API_URL}/api/seekers`)
        .then(res => setSeekers(Array.isArray(res.data) ? res.data : []))
        .catch(() => setError("Ошибка загрузки соискателей"))
        .finally(() => setLoading(false));
    } catch {
      completeLoading(); // Complete loading even on error
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
      <Helmet>
        <title>{t("seekers") || "Соискатели"}</title>
        <meta name="description" content={t("seekers_description") || "Список соискателей на вакансии"} />
      </Helmet>
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
        {loading && (
          <table className="table table-bordered">
            <thead>
              <tr className="table-light">
                {isAdmin && deleteMode && <th></th>}
                <th>{t('seekers_table_name')}</th>
                <th>{t('seekers_table_contact')}</th>
                <th>{t('seekers_table_city')}</th>
                <th>{t('seekers_table_description')}</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, idx) => (
                <tr key={idx} className="py-3">
                  {isAdmin && deleteMode && (
                    <td className="py-3">
                      <Skeleton height={20} width={20} />
                    </td>
                  )}
                  <td className="py-3">
                    <Skeleton height={20} width={75} />
                  </td>
                  <td className="py-3">
                    <Skeleton height={20} width={50} />
                  </td>
                  <td className="py-3">
                    <Skeleton height={20} width={50} />
                  </td>
                  <td className="py-3">
                    <Skeleton height={20} width={480} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
                      {renderContactCell(seeker.contact, isPremium, seeker.id, seekers.map(s => s.id), (currentPage - 1) * seekersPerPage + index, seeker.facebook)}
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