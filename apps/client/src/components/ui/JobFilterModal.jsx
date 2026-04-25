import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useIntlayer, useLocale } from 'react-intlayer';
import { API_URL } from '@/config';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useSwipeToClose } from '@/hooks/useSwipeToClose';
import { useModalBodyLock } from '@/hooks/useModalBodyLock';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { getModalOverlayStyle, getModalContentStyle } from './modalStyles';

const JobFilterModal = ({ open, onClose, onApply, currentFilters = {} }) => {
	const [salary, setSalary] = useState(currentFilters.salary || '');
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState(
		currentFilters.categoryId || '',
	);
	const [shuttleOnly, setShuttleOnly] = useState(
		currentFilters.shuttleOnly || false,
	);
	const [mealsOnly, setMealsOnly] = useState(currentFilters.mealsOnly || false);
	const modalRef = useRef();
	const { locale } = useLocale();
	const content = useIntlayer('jobFilterModal');

	const isMobile = useIsMobile();
	const { onTouchStart, onTouchMove, onTouchEnd } = useSwipeToClose({ onClose });
	useModalBodyLock({ isOpen: open, isMobile });
	useOutsideClick({ ref: modalRef, isOpen: open, onClose, isMobile });

	useEffect(() => {
		if (open) {
			setSalary(currentFilters.salary || '');
			setSelectedCategory(currentFilters.categoryId || '');
			setShuttleOnly(currentFilters.shuttleOnly || false);
			setMealsOnly(currentFilters.mealsOnly || false);

			fetch(`${API_URL}/api/categories?lang=${locale}`)
				.then((res) => res.json())
				.then((data) => setCategories(data));
		}
	}, [open, currentFilters, locale]);

	if (!open) return null;

	const handleApply = () => {
		onApply({
			salary: salary ? Number(salary) : undefined,
			categoryId: selectedCategory || undefined,
			shuttleOnly: shuttleOnly || undefined,
			mealsOnly: mealsOnly || undefined,
		});
		onClose();
	};

	const handleReset = () => {
		setSalary('');
		setSelectedCategory('');
		setShuttleOnly(false);
		setMealsOnly(false);
		onApply({});
		onClose();
	};

	const modalStyle = getModalOverlayStyle(isMobile);
	const contentStyle = getModalContentStyle(isMobile);

	return (
		<div
			style={modalStyle}
			onTouchStart={isMobile ? onTouchStart : undefined}
			onTouchMove={isMobile ? onTouchMove : undefined}
			onTouchEnd={isMobile ? onTouchEnd : undefined}
		>
			<div ref={modalRef} style={contentStyle}>
				{isMobile ? (
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginBottom: '24px',
						}}
					>
						<h5 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>
							{content.filterModalTitle.value}
						</h5>
						<button
							type="button"
							className="btn-close"
							aria-label="Close"
							onClick={onClose}
							style={{ fontSize: isMobile ? '15px' : '16px' }}
						></button>
					</div>
				) : (
					<>
						<button
							type="button"
							className="btn-close"
							aria-label="Close"
							onClick={onClose}
							style={{
								position: 'absolute',
								margin: '5px',
								top: '8px',
								right: '8px',
								fontSize: isMobile ? '24px' : '16px',
							}}
						></button>
						<h5 className="mb-4 font-size-10">
							{content.filterModalTitle.value}
						</h5>
					</>
				)}

				<div style={{ flex: 1, overflowY: 'auto' }}>
					{isMobile ? (
						<>
							<div style={{ marginBottom: '20px' }}>
								<label
									style={{
										fontSize: '16px',
										fontWeight: '500',
										marginBottom: '8px',
										display: 'block',
									}}
								>
									{content.filterSalaryLabel.value}
								</label>
								<input
									type="number"
									className="form-control"
									value={salary}
									onChange={(e) => setSalary(e.target.value)}
									placeholder={content.filterSalaryPlaceholder.value}
									style={{
										fontSize: '16px',
										padding: '12px',
										margin: '0 8px',
										width: '90%',
									}}
								/>
							</div>

							<div style={{ marginBottom: '28px' }}>
								<label
									style={{
										fontSize: '16px',
										fontWeight: '500',
										marginBottom: '8px',
										display: 'block',
									}}
								>
									{content.category.value}
								</label>
								<select
									className="form-select"
									value={selectedCategory}
									onChange={(e) => setSelectedCategory(e.target.value)}
									style={{
										fontSize: '16px',
										padding: '12px',
										margin: '0 8px',
										width: '90%',
									}}
								>
									<option value="">{content.chooseCategory.value}</option>
									{Array.isArray(categories) ? (
										categories.map((cat) => (
											<option key={cat.id} value={cat.id}>
												{cat.label}
											</option>
										))
									) : (
										<option value="" disabled>
											{content.categoriesLoadError.value ||
												'Ошибка загрузки категорий'}
										</option>
									)}
								</select>
							</div>

							<div className="form-check mb-3" style={{ marginLeft: '8px' }}>
								<input
									className="form-check-input"
									type="checkbox"
									id="shuttleSwitch"
									checked={shuttleOnly}
									onChange={(e) => setShuttleOnly(e.target.checked)}
									style={{
										transform: 'scale(1.2)',
										zIndex: 10,
										position: 'relative',
									}}
								/>
								<label
									className="form-check-label"
									htmlFor="shuttleSwitch"
									style={{ fontSize: '16px' }}
								>
									{content.shuttle.value || 'Подвозка'}
								</label>
							</div>

							<div className="form-check mb-4" style={{ marginLeft: '8px' }}>
								<input
									className="form-check-input"
									type="checkbox"
									id="mealsSwitch"
									checked={mealsOnly}
									onChange={(e) => setMealsOnly(e.target.checked)}
									style={{
										transform: 'scale(1.2)',
										zIndex: 10,
										position: 'relative',
									}}
								/>
								<label
									className="form-check-label"
									htmlFor="mealsSwitch"
									style={{ fontSize: '16px' }}
								>
									{content.meals.value || 'Питание'}
								</label>
							</div>
						</>
					) : (
						<>
							<div style={{ marginBottom: 16 }}>
								<label>{content.filterSalaryLabel.value}</label>
								<input
									type="number"
									className="form-control"
									value={salary}
									onChange={(e) => setSalary(e.target.value)}
									placeholder={content.filterSalaryPlaceholder.value}
									style={{ margin: '0 8px', width: '90%' }}
								/>
							</div>
							<div style={{ marginBottom: 24 }}>
								<label>{content.category.value}</label>
								<select
									className="form-select"
									value={selectedCategory}
									onChange={(e) => setSelectedCategory(e.target.value)}
									style={{ margin: '0 8px', width: '90%' }}
								>
									<option value="">{content.chooseCategory.value}</option>
									{Array.isArray(categories) ? (
										categories.map((cat) => (
											<option key={cat.id} value={cat.id}>
												{cat.label}
											</option>
										))
									) : (
										<option value="" disabled>
											{content.categoriesLoadError.value ||
												'Ошибка загрузки категорий'}
										</option>
									)}
								</select>
							</div>
							<div className="form-check mb-3" style={{ marginLeft: '8px' }}>
								<input
									className="form-check-input"
									type="checkbox"
									id="shuttleSwitch"
									checked={shuttleOnly}
									onChange={(e) => setShuttleOnly(e.target.checked)}
								/>
								<label className="form-check-label" htmlFor="shuttleSwitch">
									{content.shuttle.value || 'Подвозка'}
								</label>
							</div>
							<div className="form-check mb-4" style={{ marginLeft: '8px' }}>
								<input
									className="form-check-input"
									type="checkbox"
									id="mealsSwitch"
									checked={mealsOnly}
									onChange={(e) => setMealsOnly(e.target.checked)}
								/>
								<label className="form-check-label" htmlFor="mealsSwitch">
									{content.meals.value || 'Питание'}
								</label>
							</div>
						</>
					)}
				</div>

				<div
					className="d-flex justify-content-between mt-4"
					style={{
						marginTop: isMobile ? 'auto' : '16px',
						paddingTop: isMobile ? '20px' : '0',
						padding: isMobile ? '0 16px 20px' : '0',
					}}
				>
					<button
						className="btn btn-outline-secondary"
						onClick={handleReset}
						style={{
							fontSize: isMobile ? '16px' : '14px',
							padding: isMobile ? '12px 20px' : '8px 16px',
							border: '1px solid #6c757d',
							borderRadius: '6px',
							fontWeight: '500',
						}}
					>
						{content.reset.value}
					</button>
					<button
						className="btn btn-primary px-4"
						onClick={handleApply}
						style={{
							fontSize: isMobile ? '16px' : '14px',
							padding: isMobile ? '12px 24px' : '8px 16px',
							borderRadius: '6px',
							fontWeight: '500',
						}}
					>
						{content.save.value}
					</button>
				</div>
			</div>
		</div>
	);
};

JobFilterModal.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onApply: PropTypes.func.isRequired,
	currentFilters: PropTypes.shape({
		salary: PropTypes.number,
		categoryId: PropTypes.string,
		shuttleOnly: PropTypes.bool,
		mealsOnly: PropTypes.bool,
	}),
};

export default JobFilterModal;
