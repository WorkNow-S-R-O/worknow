import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useIntlayer } from 'react-intlayer';

const API_URL = import.meta.env.VITE_API_URL;

export default function MailDropdown() {
	const { user } = useUser();
	const [unreadCount, setUnreadCount] = useState(0);
	const [showMailDropdown, setShowMailDropdown] = useState(false);
	const [mailMessages, setMailMessages] = useState([]);
	const [mailLoading, setMailLoading] = useState(false);
	const [openedMsgId, setOpenedMsgId] = useState(null);
	const [previousUnreadCount, setPreviousUnreadCount] = useState(0);
	const mailRef = useRef();
	const content = useIntlayer('mailDropdown');

	// Determine if mobile
	const isMobile = window.innerWidth <= 768;
	const [touchStart, setTouchStart] = useState(null);
	const [touchEnd, setTouchEnd] = useState(null);
	const minSwipeDistance = 50;

	// Touch handlers for mobile modal
	const onTouchStart = (e) => {
		setTouchEnd(null);
		setTouchStart(e.targetTouches[0].clientY);
	};

	const onTouchMove = (e) => {
		setTouchEnd(e.targetTouches[0].clientY);
	};

	const onTouchEnd = () => {
		if (!touchStart || !touchEnd) return;
		const distance = touchStart - touchEnd;
		const isUpSwipe = distance > minSwipeDistance;

		if (isUpSwipe) {
			closeMailDropdown();
		}
	};

	const closeMailDropdown = () => {
		setShowMailDropdown(false);
		setOpenedMsgId(null);
		document.body.style.overflow = '';
		if (isMobile) {
			document.body.style.position = '';
			document.body.style.width = '';
		}
	};

	const openMailDropdown = async () => {
		if (isMobile) {
			// Mobile: Always open modal
			setShowMailDropdown(true);
			document.body.style.overflow = 'hidden';
			document.body.style.position = 'fixed';
			document.body.style.width = '100%';
			await fetchMailMessages();
		} else {
			// Desktop: Toggle dropdown
			setShowMailDropdown((prev) => !prev);
			if (!showMailDropdown) {
				await fetchMailMessages();
			}
		}
	};

	// Polling на новые письма (без toast)
	useEffect(() => {
		if (!user) return;
		let timer;
		const fetchUnread = async () => {
			try {
				let res = await axios.get(
					`${API_URL}/api/messages?clerkUserId=${user.id}`,
				);
				let msgs = res.data.messages || [];
				// Оставляем только 5 последних писем
				if (msgs.length > 5) {
					const toDelete = msgs.slice(5);
					const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago

					for (const m of toDelete) {
						// Only delete messages older than 1 hour
						if (new Date(m.createdAt) < oneHourAgo) {
							try {
								await axios.delete(`${API_URL}/api/messages/${m.id}`);
							} catch (e) {
								// Игнорируем ошибки 404 (сообщение уже удалено) и 500 (временные ошибки сервера)
								if (
									e.response &&
									(e.response.status === 404 || e.response.status === 500)
								) {
									console.log(
										`Message ${m.id} could not be deleted:`,
										e.response.status,
									);
								} else {
									console.error('Ошибка удаления сообщения:', e);
								}
							}
						}
					}
					msgs = msgs.slice(0, 5);
				}
				const count = msgs.filter((m) => !m.isRead).length;
				setMailMessages(msgs);
				setUnreadCount(count);

				// Check if we have new unread messages
				if (count > previousUnreadCount) {
					// Play notification sound (optional)
					try {
						const audio = new Audio(
							'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT',
						);
						audio.volume = 0.3;
						audio.play().catch(() => {}); // Ignore errors if audio fails
					} catch {
						// Ignore audio errors
					}
				}
				setPreviousUnreadCount(count);
			} catch {
				// Ошибка загрузки писем
			}
		};
		fetchUnread();
		timer = setInterval(fetchUnread, 15000); // Poll every 15 seconds for faster response
		return () => clearInterval(timer);
	}, [user]);

	// Получение последних писем для dropdown (только 5)
	const fetchMailMessages = async () => {
		if (!user) return;
		setMailLoading(true);
		try {
			const res = await axios.get(
				`${API_URL}/api/messages?clerkUserId=${user.id}`,
			);
			let msgs = res.data.messages?.slice(0, 5) || [];
			setMailMessages(msgs);
		} catch {
			// Ошибка загрузки последних писем
		}
		setMailLoading(false);
	};

	// Закрытие dropdown при клике вне (только для десктопа)
	useEffect(() => {
		if (!showMailDropdown || isMobile) return;
		const handler = (e) => {
			if (mailRef.current && !mailRef.current.contains(e.target)) {
				closeMailDropdown();
			}
		};
		document.addEventListener('mousedown', handler);
		return () => document.removeEventListener('mousedown', handler);
	}, [showMailDropdown, isMobile]);

	// Открывать первое сообщение при открытии popover и помечать его как прочитанное (только при первом открытии)
	useEffect(() => {
		if (showMailDropdown && mailMessages.length > 0) {
			// Если popover только что открыт — выделяем первое письмо
			setOpenedMsgId((prev) => prev ?? mailMessages[0].id);
			// Если первое письмо не прочитано — помечаем как прочитанное
			if (!mailMessages[0].isRead) {
				axios
					.patch(`${API_URL}/api/messages/${mailMessages[0].id}/read`)
					.then(() => {
						setMailMessages((msgs) =>
							msgs.map((m) =>
								m.id === mailMessages[0].id ? { ...m, isRead: true } : m,
							),
						);
						setUnreadCount((count) => (count > 0 ? count - 1 : 0));
					});
			}
		} else if (!showMailDropdown) {
			// При закрытии popover сбрасываем выделение
			setOpenedMsgId(null);
		}
	}, [showMailDropdown, mailMessages]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			document.body.style.overflow = '';
			if (isMobile) {
				document.body.style.position = '';
				document.body.style.width = '';
			}
		};
	}, [isMobile]);

	const modalStyle = {
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

	const contentStyle = {
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
	};

	return (
		<>
			<style>
				{`
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.8;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-2px);
            }
          }
          
          @keyframes glow {
            0%, 100% {
              box-shadow: 0 0 5px rgba(25, 118, 210, 0.3);
            }
            50% {
              box-shadow: 0 0 20px rgba(25, 118, 210, 0.6);
            }
          }
          
          .mail-badge-pulse {
            animation: pulse 2s infinite;
          }
          
          .envelope-icon {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
          }
          
          .envelope-icon:hover {
            transform: scale(1.15) rotate(-5deg);
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
          }
          
          .envelope-icon.has-unread {
            color: #1976d2 !important;
            animation: float 3s ease-in-out infinite;
          }
          
          .envelope-icon.has-unread:hover {
            animation: glow 2s ease-in-out infinite;
          }
          
          .mail-button {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border: 2px solid transparent;
            border-radius: 12px;
            padding: 8px 12px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          
          .mail-button:hover {
            background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
            border-color: #1976d2;
            box-shadow: 0 4px 16px rgba(25, 118, 210, 0.3);
            transform: translateY(-2px);
          }
          
          .mail-button:active {
            transform: translateY(0px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          }
        `}
			</style>
			<div ref={mailRef} className="position-relative me-2">
				<button
					className="btn mail-button position-relative"
					title="Почта"
					onClick={openMailDropdown}
					style={{ outline: 'none', boxShadow: 'none' }}
				>
					<i
						className={`bi bi-envelope envelope-icon ${unreadCount > 0 ? 'has-unread' : ''}`}
						style={{
							fontSize: 22,
							color: unreadCount > 0 ? '#1976d2' : '#495057',
							textShadow:
								unreadCount > 0 ? '0 0 8px rgba(25, 118, 210, 0.3)' : 'none',
						}}
					/>
					{unreadCount > 0 && (
						<span
							className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger mail-badge-pulse"
							style={{
								fontSize: 12,
								fontWeight: 'bold',
								minWidth: '20px',
								height: '20px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								boxShadow: '0 4px 12px rgba(220, 53, 69, 0.4)',
								border: '2px solid #fff',
							}}
						>
							{unreadCount > 99 ? '99+' : unreadCount}
						</span>
					)}
				</button>

				{/* Desktop Dropdown */}
				{showMailDropdown && !isMobile && (
					<div
						className="shadow rounded bg-white position-absolute end-0 mt-2"
						style={{ minWidth: 340, zIndex: 9999, maxWidth: 400 }}
					>
						<div className="p-2 border-bottom fw-bold d-flex justify-content-between align-items-center">
							<span>Входящие</span>
							{unreadCount > 0 && (
								<span className="badge bg-danger" style={{ fontSize: '10px' }}>
									{unreadCount}{' '}
									{unreadCount === 1
										? 'новое'
										: unreadCount < 5
											? 'новых'
											: 'новых'}
								</span>
							)}
						</div>
						{mailLoading ? (
							<div className="p-3 text-center text-muted">
								{content.loading.value}
							</div>
						) : mailMessages.length === 0 ? (
							<div className="p-3 text-center text-muted">Нет сообщений</div>
						) : (
							<ul
								className="list-group list-group-flush"
								style={{ maxHeight: 350, overflowY: 'auto' }}
							>
								{mailMessages.map((msg) => (
									<li
										key={msg.id}
										className={`list-group-item px-3 py-2 ${openedMsgId === msg.id ? 'bg-primary-subtle' : ''}`}
										style={{
											cursor: 'pointer',
											borderLeft:
												openedMsgId === msg.id
													? '4px solid #1976d2'
													: '4px solid transparent',
											transition: 'background 0.2s, border 0.2s',
										}}
										onClick={async () => {
											setOpenedMsgId(msg.id);
											if (!msg.isRead) {
												await axios.patch(
													`${API_URL}/api/messages/${msg.id}/read`,
												);
												setMailMessages((msgs) =>
													msgs.map((m) =>
														m.id === msg.id ? { ...m, isRead: true } : m,
													),
												);
												setUnreadCount((count) => (count > 0 ? count - 1 : 0));
											}
										}}
									>
										<div className="d-flex justify-content-between align-items-center">
											<span
												style={{
													fontWeight: msg.isRead ? 400 : 600,
													color: msg.isRead ? '#333' : '#1976d2',
													fontSize:
														msg.title.includes('Premium') ||
														msg.title.includes('Deluxe')
															? '14px'
															: '13px',
												}}
											>
												{msg.title}
											</span>
											{!msg.isRead && (
												<span
													className="badge ms-2"
													style={{
														backgroundColor:
															msg.title.includes('Premium') ||
															msg.title.includes('Deluxe')
																? '#28a745'
																: '#007bff',
														fontSize: '10px',
														fontWeight: 'bold',
													}}
												>
													{content.mailNewBadge.value}
												</span>
											)}
										</div>
										<div className="small text-muted mt-1">
											{new Date(msg.createdAt).toLocaleString()}
										</div>
										{openedMsgId === msg.id && (
											<div
												className="mt-2 small text-dark"
												style={{ fontSize: 15 }}
												dangerouslySetInnerHTML={{ __html: msg.body }}
											/>
										)}
									</li>
								))}
							</ul>
						)}
					</div>
				)}

				{/* Mobile Modal */}
				{showMailDropdown && isMobile && (
					<div
						style={modalStyle}
						onTouchStart={onTouchStart}
						onTouchMove={onTouchMove}
						onTouchEnd={onTouchEnd}
					>
						<div style={contentStyle}>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									marginBottom: '24px',
								}}
							>
								<div
									style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
								>
									<h5
										style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}
									>
										Входящие
									</h5>
									{unreadCount > 0 && (
										<span
											className="badge bg-danger"
											style={{ fontSize: '11px' }}
										>
											{unreadCount}{' '}
											{unreadCount === 1
												? 'новое'
												: unreadCount < 5
													? 'новых'
													: 'новых'}
										</span>
									)}
								</div>
								<button
									type="button"
									className="btn-close"
									aria-label="Close"
									onClick={closeMailDropdown}
									style={{ fontSize: '15px' }}
								></button>
							</div>

							<div style={{ flex: 1, overflowY: 'auto' }}>
								{mailLoading ? (
									<div className="p-3 text-center text-muted">
										{content.loading.value}
									</div>
								) : mailMessages.length === 0 ? (
									<div className="p-3 text-center text-muted">
										Нет сообщений
									</div>
								) : (
									<ul className="list-group list-group-flush">
										{mailMessages.map((msg) => (
											<li
												key={msg.id}
												className={`list-group-item px-3 py-3 ${openedMsgId === msg.id ? 'bg-primary-subtle' : ''}`}
												style={{
													cursor: 'pointer',
													borderLeft:
														openedMsgId === msg.id
															? '4px solid #1976d2'
															: '4px solid transparent',
													transition: 'background 0.2s, border 0.2s',
													fontSize: '16px',
												}}
												onClick={async () => {
													setOpenedMsgId(msg.id);
													if (!msg.isRead) {
														await axios.patch(
															`${API_URL}/api/messages/${msg.id}/read`,
														);
														setMailMessages((msgs) =>
															msgs.map((m) =>
																m.id === msg.id ? { ...m, isRead: true } : m,
															),
														);
														setUnreadCount((count) =>
															count > 0 ? count - 1 : 0,
														);
													}
												}}
											>
												<div className="d-flex justify-content-between align-items-center mb-2">
													<span
														style={{
															fontWeight: msg.isRead ? 400 : 600,
															color: msg.isRead ? '#333' : '#1976d2',
															fontSize:
																msg.title.includes('Premium') ||
																msg.title.includes('Deluxe')
																	? '17px'
																	: '16px',
														}}
													>
														{msg.title}
													</span>
													{!msg.isRead && (
														<span
															className="badge ms-2"
															style={{
																backgroundColor:
																	msg.title.includes('Premium') ||
																	msg.title.includes('Deluxe')
																		? '#28a745'
																		: '#007bff',
																fontSize: '11px',
																fontWeight: 'bold',
															}}
														>
															{content.mailNewBadge.value}
														</span>
													)}
												</div>
												<div
													className="small text-muted mb-2"
													style={{ fontSize: '14px' }}
												>
													{new Date(msg.createdAt).toLocaleString()}
												</div>
												{openedMsgId === msg.id && (
													<div
														className="mt-3 text-dark"
														style={{ fontSize: '15px', lineHeight: '1.5' }}
														dangerouslySetInnerHTML={{ __html: msg.body }}
													/>
												)}
											</li>
										))}
									</ul>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
