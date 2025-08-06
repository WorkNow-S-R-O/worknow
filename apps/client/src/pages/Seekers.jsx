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
import SeekerFilterModal from "../components/ui/SeekerFilterModal";
import useSeekerFilterStore from "../store/seekerFilterStore";
import useSeekers from "../hooks/useSeekers";
import '../css/seekers-table-mobile.css';
import '../css/seekers-mobile.css';
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
  const { filters, setFilters } = useSeekerFilterStore();
  const [currentPage, setCurrentPage] = useState(1);
  const { seekers, loading, error, pagination } = useSeekers(currentPage, filters);

  const [isPremium, setIsPremium] = useState(false);
  const isAdmin = user?.emailAddresses?.[0]?.emailAddress === 'worknow.notifications@gmail.com';
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isNewsletterSubscribed, setIsNewsletterSubscribed] = useState(false);
  const navigate = useNavigate();

  // Use server-side pagination if available, otherwise fall back to client-side
  const totalPages = pagination ? pagination.pages : Math.ceil(seekers.length / 10);
  
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
    
    startLoadingWithProgress(2500); // Start loading progress for deletion
    
    try {
      await Promise.all(selectedIds.map(id => axios.delete(`${API_URL}/api/seekers/${id}`)));
      completeLoading(); // Complete loading when done
      toast.success('Успешно удалено');
      setSelectedIds([]);
      setDeleteMode(false);
      // Refresh the seekers list after deletion
      window.location.reload();
    } catch {
      completeLoading(); // Complete loading even on error
      toast.error('Ошибка при удалении');
    }
  };

  // Use server-side pagination data if available, otherwise fall back to client-side
  const currentSeekers = seekers;
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterApply = (newFilters) => {
    console.log('🎯 Applying filters:', newFilters);
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

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
      // Refresh the seekers list after adding
      window.location.reload();
    } catch {
      completeLoading(); // Complete loading even on error
      alert('Ошибка при добавлении соискателя');
    }
  };

  // Check newsletter subscription status
  const checkNewsletterSubscription = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      setIsNewsletterSubscribed(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/newsletter/check-subscription`, {
        params: { email: user.primaryEmailAddress.emailAddress }
      });
      
      setIsNewsletterSubscribed(response.data.isSubscribed);
    } catch (error) {
      console.error('Error checking newsletter subscription:', error);
      setIsNewsletterSubscribed(false);
    }
  };

  useEffect(() => {
    checkNewsletterSubscription();
  }, [user]);

  return (
    <>
      <Helmet>
        <title>{t("seekers") || "Соискатели"}</title>
        <meta name="description" content={t("seekers_description") || "Список соискателей на вакансии"} />
      </Helmet>
      <AddSeekerModal show={showAddModal} onClose={() => setShowAddModal(false)} onSubmit={handleAddSeeker} />
      <SeekerFilterModal 
        open={showFilterModal} 
        onClose={() => setShowFilterModal(false)} 
        onApply={handleFilterApply}
        currentFilters={filters}
      />
      
      <div className="container" style={{ paddingTop: '100px' }}>
        {/* Database update badge */}
        <div className="alert alert-primary d-flex align-items-center gap-2 mb-4" role="alert" style={{
          borderRadius: '8px',
          border: '1px solid #0d6efd',
          backgroundColor: '#e7f1ff'
        }}>
          <i className="bi bi-info-circle text-primary" style={{ fontSize: '1.1rem' }}></i>
          <div>
            <strong className="text-primary">{t('seekers_database_update') || 'База данных кандидатов обновляется ежедневно'}</strong>
            <div className="text-primary" style={{ fontSize: '0.9rem', marginTop: '2px', opacity: '0.8' }}>
              {t('seekers_database_update_description') || 'Новые кандидаты добавляются каждый день'}
            </div>
          </div>
        </div>
        
        {/* Mobile-optimized header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-3 seekers-header">
          <h2 className="fs-4 mb-0">{t("seekers") || "Соискатели"}</h2>
          <div className="d-flex flex-wrap gap-2 seekers-buttons" style={{ minWidth: 'fit-content' }}>
                                        <button 
                className="btn btn-outline-primary d-flex align-items-center gap-2 seekers-btn"
                onClick={() => setShowFilterModal(true)}
                style={{
                  height: 'auto',
                  fontSize: '14px',
                  padding: '8px 12px',
                  minHeight: '40px',
                  whiteSpace: 'nowrap'
                }}
              >
                <i className="bi bi-gear" style={{ fontSize: '16px' }}></i>
                <span>{t('filters') || 'Фильтры'}</span>
              </button>
            <button 
              className={`btn d-flex align-items-center gap-2 seekers-btn ${isNewsletterSubscribed ? 'btn-outline-success' : 'btn-outline-primary'}`}
                              onClick={() => navigate('/newsletter')}
              style={{
                height: 'auto',
                fontSize: '14px',
                padding: '8px 12px',
                minHeight: '40px',
                whiteSpace: 'nowrap'
              }}
            >
              <i className="bi bi-envelope" style={{ fontSize: '16px' }}></i>
              <span>{t('newsletter') || 'Рассылка'}</span>
            </button>
            {isAdmin && (
              <button 
                className="btn btn-primary d-flex align-items-center gap-2 seekers-btn"
                onClick={() => setShowAddModal(true)}
                style={{
                  height: 'auto',
                  fontSize: '14px',
                  padding: '8px 12px',
                  minHeight: '40px',
                  whiteSpace: 'nowrap'
                }}
              >
                <i className="bi bi-plus" style={{ fontSize: '16px' }}></i>
                <span>{showAddModal ? 'Скрыть форму' : 'Добавить соискателя'}</span>
              </button>
            )}
          </div>
        </div>
        
        {isAdmin && (
          <div className="mb-3 d-flex flex-wrap gap-2 admin-controls">
            {!deleteMode && (
              <button 
                className="btn btn-danger d-flex align-items-center gap-2 admin-btn"
                onClick={handleStartDeleteMode}
                style={{
                  height: 'auto',
                  fontSize: '14px',
                  padding: '8px 12px',
                  minHeight: '40px',
                  whiteSpace: 'nowrap'
                }}
              >
                <i className="bi bi-trash" style={{ fontSize: '16px' }}></i>
                <span>Удалить соискателя</span>
              </button>
            )}
            {deleteMode && (
              <>
                <button
                  className="btn btn-danger d-flex align-items-center gap-2 admin-btn"
                  disabled={selectedIds.length === 0}
                  onClick={handleConfirmDelete}
                  style={{
                    height: 'auto',
                    fontSize: '14px',
                    padding: '8px 12px',
                    minHeight: '40px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <i className="bi bi-check-circle" style={{ fontSize: '16px' }}></i>
                  <span>Подтвердить удаление</span>
                </button>
                <button 
                  className="btn btn-secondary d-flex align-items-center gap-2 admin-btn"
                  onClick={handleCancelDeleteMode}
                  style={{
                    height: 'auto',
                    fontSize: '14px',
                    padding: '8px 12px',
                    minHeight: '40px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <i className="bi bi-x-circle" style={{ fontSize: '16px' }}></i>
                  <span>Отмена</span>
                </button>
              </>
            )}
          </div>
        )}
        
        {loading && (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead>
                <tr className="table-light">
                  {isAdmin && deleteMode && <th style={{ width: '40px' }}></th>}
                  <th style={{ minWidth: '120px' }}>{t('seekers_table_name')}</th>
                  <th style={{ minWidth: '120px' }}>{t('seekers_table_contact')}</th>
                  <th style={{ minWidth: '100px' }}>{t('seekers_table_city')}</th>
                  <th style={{ minWidth: '200px' }}>{t('seekers_table_description')}</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, idx) => (
                  <tr key={idx} className="py-3">
                    {isAdmin && deleteMode && (
                      <td className="py-3 text-center">
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
          </div>
        )}
        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
            <i className="bi bi-exclamation-triangle"></i>
            <span>{error}</span>
          </div>
        )}
        {!loading && seekers.length === 0 && (
          <div className="text-center py-5 empty-state">
            <div className="mb-3">
              <i className="bi bi-people" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
            </div>
            <h5 className="text-muted">{t('no_seekers_found') || 'Соискатели не найдены'}</h5>
            <p className="text-muted">{t('no_seekers_description') || 'Попробуйте изменить фильтры или загляните позже'}</p>
          </div>
        )}
        {!loading && seekers.length > 0 && (
          <>
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead>
                  <tr className="table-light">
                    {isAdmin && deleteMode && (
                      <th style={{ width: '40px' }} className="text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.length === seekers.length && seekers.length > 0}
                          onChange={handleSelectAll}
                          style={{ transform: 'scale(1.2)' }}
                        />
                      </th>
                    )}
                    <th style={{ minWidth: '120px' }}>{t('seekers_table_name')}</th>
                    <th style={{ minWidth: '120px' }}>{t('seekers_table_contact')}</th>
                    <th style={{ minWidth: '100px' }}>{t('seekers_table_city')}</th>
                    <th style={{ minWidth: '200px' }}>{t('seekers_table_description')}</th>
                  </tr>
                </thead>
                <tbody>
                  {currentSeekers.map((seeker, index) => (
                    <tr key={seeker.id} className={seeker.isDemanded ? 'table-primary' : ''}>
                      {isAdmin && deleteMode && (
                        <td className="py-3 text-center">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(seeker.id)}
                            onChange={() => handleSelect(seeker.id)}
                            style={{ transform: 'scale(1.2)' }}
                          />
                        </td>
                      )}
                      <td className="py-3">
                        <Link
                          to={`/seekers/${seeker.id}`}
                          state={{ seekerIds: seekers.map(s => s.id), currentIndex: (currentPage - 1) * 10 + index }}
                          style={{ 
                            color: '#1976d2', 
                            textDecoration: 'underline', 
                            cursor: 'pointer',
                            fontWeight: '500'
                          }}
                        >
                          {seeker.name}
                        </Link>
                      </td>
                      <td className="py-3">
                        {renderContactCell(seeker.contact, isPremium, seeker.id, seekers.map(s => s.id), (currentPage - 1) * 10 + index, seeker.facebook)}
                      </td>
                      <td className="py-3">
                        <span className="badge bg-light text-dark">{seeker.city}</span>
                      </td>
                      <td className="py-3">
                        <div className="description-cell" style={{ 
                          maxWidth: '100%', 
                          wordBreak: 'break-word',
                          fontSize: '14px',
                          lineHeight: '1.4'
                        }}>
                          {seeker.description}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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