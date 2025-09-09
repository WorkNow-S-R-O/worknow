import axios from 'axios';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useIntlayer } from 'react-intlayer';

const API_URL = import.meta.env.VITE_API_URL;

const VerificationModal = ({
	open,
	onClose,
	email,
	subscriptionData = null,
	onVerificationSuccess,
}) => {
	const [verificationCode, setVerificationCode] = useState('');
	const [isVerifying, setIsVerifying] = useState(false);
	const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
	const [canResend, setCanResend] = useState(false);
	const [resendTimeLeft, setResendTimeLeft] = useState(60); // 1 minute cooldown

	const modalRef = useRef();
	const content = useIntlayer('verificationModal');

	// Determine if mobile
	const isMobile = window.innerWidth <= 768;

	// Timer for verification code expiration
	useEffect(() => {
		if (open && timeLeft > 0) {
			const timer = setInterval(() => {
				setTimeLeft((prev) => {
					if (prev <= 1) {
						clearInterval(timer);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);

			return () => clearInterval(timer);
		}
	}, [open, timeLeft]);

	// Timer for resend cooldown
	useEffect(() => {
		if (resendTimeLeft > 0) {
			const timer = setInterval(() => {
				setResendTimeLeft((prev) => {
					if (prev <= 1) {
						setCanResend(true);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);

			return () => clearInterval(timer);
		}
	}, [resendTimeLeft]);

	// Handle outside click for desktop
	const handleOutsideClick = (event) => {
		if (modalRef.current && !modalRef.current.contains(event.target)) {
			onClose();
		}
	};

	const handleVerifyCode = async () => {
		if (!verificationCode.trim()) {
			toast.error(
				content.verificationCodeRequired.value ||
					'Пожалуйста, введите код подтверждения',
			);
			return;
		}

		setIsVerifying(true);

		try {
			const response = await axios.post(
				`${API_URL}/api/newsletter/verify-code`,
				{
					email: email.trim(),
					code: verificationCode.trim(),
					subscriptionData: subscriptionData || {},
				},
			);

			if (response.data.success) {
				toast.success(
					content.verificationSuccess.value ||
						'Email успешно подтвержден! Вы подписаны на рассылку.',
				);
				onVerificationSuccess(response.data.subscriber);
				onClose();
			} else {
				toast.error(
					response.data.message ||
						content.verificationError.value ||
						'Ошибка при подтверждении кода',
				);
			}
		} catch (error) {
			console.error('Verification error:', error);
			if (error.response?.data?.message) {
				toast.error(error.response.data.message);
			} else {
				toast.error(
					content.verificationError.value || 'Ошибка при подтверждении кода',
				);
			}
		} finally {
			setIsVerifying(false);
		}
	};

	const handleResendCode = async () => {
		if (!canResend) return;

		try {
			const response = await axios.post(
				`${API_URL}/api/newsletter/send-verification`,
				{
					email: email.trim(),
					...(subscriptionData || {}),
				},
			);

			if (response.data.success) {
				toast.success(
					content.verificationCodeResent.value ||
						'Код подтверждения отправлен повторно',
				);
				setTimeLeft(600); // Reset timer to 10 minutes
				setCanResend(false);
				setResendTimeLeft(60); // Start 1-minute cooldown
			} else {
				toast.error(
					response.data.message ||
						content.resendError.value ||
						'Ошибка при повторной отправке кода',
				);
			}
		} catch (error) {
			console.error('Resend error:', error);
			if (error.response?.data?.message) {
				toast.error(error.response.data.message);
			} else {
				toast.error(
					content.resendError.value || 'Ошибка при повторной отправке кода',
				);
			}
		}
	};

	const formatTime = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	};

	// Fullscreen modal for mobile, original overlay for desktop
	const modalStyle = isMobile
		? {
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				width: '100vw',
				height: '100vh',
				background: '#fff',
				zIndex: 9999,
				display: 'flex',
				flexDirection: 'column',
			}
		: {
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100vw',
				height: '100vh',
				background: 'rgba(0,0,0,0.3)',
				zIndex: 1000,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			};

	const contentStyle = isMobile
		? {
				background: '#fff',
				borderRadius: 0,
				height: '100vh',
				width: '100vw',
				padding: '16px 16px',
				display: 'flex',
				flexDirection: 'column',
				boxShadow: 'none',
				border: 'none',
				position: 'absolute',
				top: 0,
				left: 0,
			}
		: {
				background: '#fff',
				borderRadius: 18,
				padding: 40,
				width: 500,
				maxWidth: '95vw',
				maxHeight: '95vh',
				boxShadow: '0 4px 32px rgba(0,0,0,0.15)',
				position: 'relative',
				display: 'flex',
				flexDirection: 'column',
			};

	if (!open) return null;

	return (
		<div
			style={modalStyle}
			onMouseDown={!isMobile ? handleOutsideClick : undefined}
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
							{content.verificationTitle.value || 'Подтверждение email'}
						</h5>
						<button
							type="button"
							className="btn-close"
							aria-label="Close"
							onClick={onClose}
							style={{ fontSize: '24px' }}
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
								fontSize: '16px',
							}}
						></button>
						<h5 className="mb-4 font-size-10">
							{content.verificationTitle.value || 'Подтверждение email'}
						</h5>
					</>
				)}

				<div
					style={{
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
					}}
				>
					<div style={{ marginBottom: '24px' }}>
						<div
							style={{
								backgroundColor: '#e3f2fd',
								padding: '20px',
								borderRadius: '8px',
								marginBottom: '20px',
								border: '1px solid #bbdefb',
							}}
						>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									marginBottom: '15px',
								}}
							>
								<i
									className="bi bi-envelope-check"
									style={{
										color: '#1976d2',
										fontSize: '24px',
										marginRight: '10px',
									}}
								></i>
								<h6 style={{ margin: 0, color: '#1565c0' }}>
									{content.verificationSent.value ||
										'Код подтверждения отправлен!'}
								</h6>
							</div>
							<p style={{ margin: 0, color: '#1565c0', fontSize: '14px' }}>
								{content.verificationSentTo.value ||
									'Код подтверждения отправлен на email:'}{' '}
								<strong>{email}</strong>
							</p>
						</div>

						<p
							style={{
								fontSize: isMobile ? '16px' : '14px',
								color: '#666',
								marginBottom: '20px',
								lineHeight: '1.5',
							}}
						>
							{content.verificationDescription.value ||
								'Введите 6-значный код, который мы отправили на ваш email для подтверждения подписки на рассылку.'}
						</p>

						<div style={{ marginBottom: '20px' }}>
							<label
								style={{
									fontSize: isMobile ? '16px' : '14px',
									fontWeight: '500',
									marginBottom: '8px',
									display: 'block',
								}}
							>
								{content.verificationCodeLabel.value || 'Код подтверждения *'}
							</label>
							<input
								type="text"
								className="form-control"
								value={verificationCode}
								onChange={(e) =>
									setVerificationCode(
										e.target.value.replace(/\D/g, '').slice(0, 6),
									)
								}
								placeholder={
									content.verificationCodePlaceholder.value ||
									'Введите 6-значный код'
								}
								style={{
									fontSize: isMobile ? '16px' : '14px',
									padding: isMobile ? '12px' : '8px',
									width: '100%',
									textAlign: 'center',
									letterSpacing: '2px',
									fontFamily: 'monospace',
								}}
								disabled={isVerifying}
								maxLength={6}
								required
							/>
						</div>

						{/* Timer */}
						<div
							style={{
								marginBottom: '20px',
								textAlign: 'center',
							}}
						>
							<p
								style={{
									fontSize: isMobile ? '16px' : '14px',
									color: timeLeft < 60 ? '#d32f2f' : '#666',
									margin: 0,
								}}
							>
								{timeLeft > 0 ? (
									<>
										{content.verificationTimeLeft.value ||
											'Время до истечения кода:'}{' '}
										<strong>{formatTime(timeLeft)}</strong>
									</>
								) : (
									<span style={{ color: '#d32f2f' }}>
										{content.verificationCodeExpired.value ||
											'Код подтверждения истек'}
									</span>
								)}
							</p>
						</div>

						{/* Resend button */}
						<div
							style={{
								marginBottom: '20px',
								textAlign: 'center',
							}}
						>
							<button
								type="button"
								className="btn btn-outline-primary"
								onClick={handleResendCode}
								disabled={!canResend || isVerifying}
								style={{
									fontSize: isMobile ? '16px' : '14px',
									padding: isMobile ? '8px 16px' : '6px 12px',
								}}
							>
								{canResend ? (
									<>
										<i className="bi bi-arrow-clockwise me-2"></i>
										{content.verificationResend.value ||
											'Отправить код повторно'}
									</>
								) : (
									<>
										{content.verificationResendWait.value ||
											'Повторная отправка через'}{' '}
										{formatTime(resendTimeLeft)}
									</>
								)}
							</button>
						</div>
					</div>
				</div>

				{/* Action Buttons */}
				<div
					className="d-flex justify-content-between mt-4"
					style={{
						marginTop: '20px',
						paddingTop: '20px',
						borderTop: '1px solid #e0e0e0',
					}}
				>
					<button
						className="btn btn-secondary"
						onClick={onClose}
						disabled={isVerifying}
						style={{
							fontSize: isMobile ? '16px' : '14px',
							padding: isMobile ? '12px 20px' : '8px 16px',
						}}
					>
						{content.cancel.value || 'Отмена'}
					</button>

					<button
						className="btn btn-primary"
						onClick={handleVerifyCode}
						disabled={isVerifying || !verificationCode.trim() || timeLeft === 0}
						style={{
							fontSize: isMobile ? '16px' : '14px',
							padding: isMobile ? '12px 20px' : '8px 16px',
						}}
					>
						{isVerifying ? (
							<>
								<span
									className="spinner-border spinner-border-sm me-2"
									role="status"
									aria-hidden="true"
								></span>
								{content.verificationVerifying.value || 'Проверка...'}
							</>
						) : (
							<>
								<i className="bi bi-check-circle me-2"></i>
								{content.verificationVerify.value || 'Подтвердить'}
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

VerificationModal.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	email: PropTypes.string.isRequired,
	subscriptionData: PropTypes.object,
	onVerificationSuccess: PropTypes.func.isRequired,
};

export default VerificationModal;
