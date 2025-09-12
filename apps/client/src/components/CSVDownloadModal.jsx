import React, { useState } from 'react';
import { useIntlayer } from 'react-intlayer';

const CSVDownloadModal = ({ isOpen, onClose, onDownload }) => {
	const content = useIntlayer('seekers');
	const [days, setDays] = useState('7');
	const [downloadAll, setDownloadAll] = useState(false);

	const handleDownload = () => {
		onDownload({
			days: downloadAll ? null : (days === '' ? 7 : parseInt(days)),
			downloadAll
		});
		onClose();
	};

	const handleClose = () => {
		setDays('7');
		setDownloadAll(false);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div 
			className="modal fade show d-block" 
			style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
			tabIndex="-1"
		>
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<div className="modal-header">
					<h5 className="modal-title">
						<i className="bi bi-file-earmark-spreadsheet me-2"></i>
						{content.csvModalTitle.value}
					</h5>
						<button 
							type="button" 
							className="btn-close" 
							onClick={handleClose}
							aria-label="Close"
						></button>
					</div>
					
					<div className="modal-body">
						<div className="mb-4">
							<div className="form-check">
								<input
									className="form-check-input"
									type="checkbox"
									id="downloadAll"
									checked={downloadAll}
									onChange={(e) => setDownloadAll(e.target.checked)}
								/>
							<label className="form-check-label fw-bold" htmlFor="downloadAll">
								<i className="bi bi-check-square me-2"></i>
								{content.downloadAllCandidates.value}
							</label>
							</div>
							<small className="text-muted ms-4">
								{content.downloadAllDescription.value}
							</small>
						</div>

						{!downloadAll && (
							<div className="mb-4">
							<label htmlFor="daysInput" className="form-label fw-bold">
								<i className="bi bi-calendar-range me-2"></i>
								{content.downloadLastDays.value}
							</label>
								<div className="input-group">
									<input
										type="number"
										className="form-control"
										id="daysInput"
										value={days}
										onChange={(e) => {
											const value = e.target.value;
											if (value === '') {
												setDays('');
											} else {
												const numValue = parseInt(value);
												if (!isNaN(numValue) && numValue >= 1 && numValue <= 365) {
													setDays(value); // Keep as string for controlled input
												}
											}
										}}
										min="1"
										max="365"
									/>
								<span className="input-group-text">
									{content.daysLabel.value}
								</span>
								</div>
							<small className="text-muted">
								{content.downloadLastDaysDescription.value}
							</small>
							</div>
						)}

						<div className="alert alert-info">
							<i className="bi bi-info-circle me-2"></i>
							<strong>{content.csvFormat.value}</strong>
							<ul className="mb-0 mt-2">
								<li>{content.csvFields.value}</li>
							</ul>
						</div>
					</div>
					
					<div className="modal-footer">
						<button 
							type="button" 
							className="btn btn-secondary" 
							onClick={handleClose}
						>
							<i className="bi bi-x-circle me-2"></i>
							{content.cancelButton.value}
						</button>
						<button 
							type="button" 
							className="btn btn-success" 
							onClick={handleDownload}
						>
							<i className="bi bi-download me-2"></i>
							{content.downloadButton.value}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CSVDownloadModal;
