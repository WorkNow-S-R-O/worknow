import PropTypes from 'prop-types';
import { useRef, useEffect, useState } from 'react';

/**
 * PremiumBenefitsCard — универсальная плашка для тарифов премиума
 * props:
 *  - title: string — заголовок тарифа
 *  - benefits: string[] — список бенефитов
 *  - color: string — основной цвет (например, '#1976d2')
 *  - expanded: boolean — раскрыта ли плашка
 *  - onToggle: () => void — обработчик клика по заголовку
 *  - price: string — цена тарифа
 *  - children: ReactNode — можно передать кастомный контент
 */
export default function PremiumBenefitsCard({
  title,
  benefits = [],
  color = '#1976d2',
  expanded = true,
  onToggle,
  price,
  children
}) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState('auto');

  useEffect(() => {
    if (expanded && contentRef.current) {
      setHeight(contentRef.current.scrollHeight + 'px');
    } else {
      setHeight('0px');
    }
  }, [expanded, benefits, children]);

  return (
    <div
      className="premium-benefits-card shadow mb-4"
      style={{
        background: color,
        borderRadius: 16,
        boxShadow: '0 2px 12px rgba(25,118,210,0.10)',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s',
        color: '#fff',
        width: '100%',
        maxWidth: 480,
        margin: '0 auto',
      }}
    >
      <button
        className="w-100 d-flex align-items-center justify-content-between px-4 py-3 border-0 bg-transparent"
        style={{ cursor: onToggle ? 'pointer' : 'default', background: 'transparent', color: '#fff', fontWeight: 700, fontSize: 18 }}
        onClick={onToggle}
        type="button"
      >
        <span>{title} {price && <span style={{fontWeight:400, fontSize:15, marginLeft:8}}>{price}</span>}</span>
        {onToggle && (
          <span style={{ transition: 'transform 0.3s', transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
            <i className="bi bi-chevron-right" style={{fontSize:22}}></i>
          </span>
        )}
      </button>
      <div
        ref={contentRef}
        style={{
          height: expanded ? height : '0px',
          transition: 'height 0.4s cubic-bezier(.4,0,.2,1)',
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.05)',
        }}
        aria-hidden={!expanded}
      >
        <div className="px-4 pb-4 pt-1">
          {benefits.length > 0 && (
            <ul className="list-unstyled mb-2" style={{color:'#fff', fontSize:16, fontWeight:500}}>
              {benefits.map((b, i) => {
                if (b && typeof b === 'object' && b.key) {
                  return (
                    <li key={b.key} className="mb-1 d-flex align-items-start">
                      <i className="bi bi-check2-circle me-2" style={{fontSize:18, color:'#fff'}}></i>
                      <span>{b.value}</span>
                    </li>
                  );
                }
                return (
                  <li key={i} className="mb-1 d-flex align-items-start">
                    <i className="bi bi-check2-circle me-2" style={{fontSize:18, color:'#fff'}}></i>
                    <span>{b}</span>
                  </li>
                );
              })}
            </ul>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

PremiumBenefitsCard.propTypes = {
  title: PropTypes.string.isRequired,
  benefits: PropTypes.arrayOf(PropTypes.node),
  color: PropTypes.string,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
  price: PropTypes.string,
  children: PropTypes.node
}; 