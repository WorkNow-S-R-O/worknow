import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useIntlayer } from 'react-intlayer';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const NewsletterAdmin = () => {
	const { user } = useUser();
	const content = useIntlayer('newsletterAdmin');
	const [subscribers, setSubscribers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [sending, setSending] = useState(false);
	const [customMessage, setCustomMessage] = useState('');
	const [subject, setSubject] = useState('');

	const isAdmin =
		user?.emailAddresses?.[0]?.emailAddress ===
		'worknow.notifications@gmail.com';

	useEffect(() => {
		if (isAdmin) {
			fetchSubscribers();
		}
	}, [isAdmin]);

	const fetchSubscribers = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`${API_URL}/api/newsletter/subscribers`);
			if (response.data.success) {
				setSubscribers(response.data.data);
			}
		} catch (error) {
			console.error('Error fetching subscribers:', error);
			toast.error('Ошибка при загрузке подписчиков');
		} finally {
			setLoading(false);
		}
	};

	const sendTestNewsletter = async () => {
		if (!subscribers.length) {
			toast.error('Нет подписчиков для отправки');
			return;
		}

		setSending(true);
		try {
			// Get some recent seekers for testing
			const seekersResponse = await axios.get(`${API_URL}/api/seekers?limit=5`);
			const testCandidates = seekersResponse.data.seekers || [];

			const response = await axios.post(`${API_URL}/api/newsletter/send`, {
				candidates: testCandidates,
				subject: subject || 'Тестовая рассылка - Новые соискатели',
				customMessage:
					customMessage ||
					'Это тестовая рассылка для проверки функциональности.',
			});

			if (response.data.success) {
				toast.success(`Рассылка отправлена ${subscribers.length} подписчикам`);
				setSubject('');
				setCustomMessage('');
			} else {
				toast.error(response.data.message || 'Ошибка при отправке рассылки');
			}
		} catch (error) {
			console.error('Error sending newsletter:', error);
			toast.error('Ошибка при отправке рассылки');
		} finally {
			setSending(false);
		}
	};

	const checkAndSendAutomated = async () => {
		setSending(true);
		try {
			const response = await axios.post(
				`${API_URL}/api/newsletter/check-and-send`,
			);
			toast.success(response.data.message);
		} catch (error) {
			console.error('Error checking automated newsletter:', error);
			toast.error('Ошибка при проверке автоматической рассылки');
		} finally {
			setSending(false);
		}
	};

	if (!isAdmin) {
		return (
			<div className="container mt-5">
				<div className="alert alert-warning">
					<h4>Доступ запрещен</h4>
					<p>Эта страница доступна только администраторам.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mt-5">
			<h2 className="mb-4">Управление рассылкой</h2>

			<div className="row">
				<div className="col-md-6">
					<div className="card">
						<div className="card-header">
							<h5>Подписчики ({subscribers.length})</h5>
						</div>
						<div className="card-body">
							{loading ? (
								<p>{content.loading.value}</p>
							) : (
								<div className="table-responsive">
									<table className="table table-sm">
										<thead>
											<tr>
												<th>Email</th>
												<th>Имя</th>
												<th>Дата подписки</th>
												<th>Статус</th>
											</tr>
										</thead>
										<tbody>
											{subscribers.map((subscriber) => (
												<tr key={subscriber.id}>
													<td>{subscriber.email}</td>
													<td>{subscriber.firstName || '-'}</td>
													<td>
														{new Date(
															subscriber.createdAt,
														).toLocaleDateString()}
													</td>
													<td>
														<span
															className={`badge ${subscriber.isActive ? 'bg-success' : 'bg-secondary'}`}
														>
															{subscriber.isActive
																? content.active.value
																: content.inactive.value}
														</span>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="col-md-6">
					<div className="card">
						<div className="card-header">
							<h5>Отправка рассылки</h5>
						</div>
						<div className="card-body">
							<div className="mb-3">
								<label className="form-label">Тема письма</label>
								<input
									type="text"
									className="form-control"
									value={subject}
									onChange={(e) => setSubject(e.target.value)}
									placeholder="Введите тему письма"
								/>
							</div>

							<div className="mb-3">
								<label className="form-label">Дополнительное сообщение</label>
								<textarea
									className="form-control"
									rows="3"
									value={customMessage}
									onChange={(e) => setCustomMessage(e.target.value)}
									placeholder="Введите дополнительное сообщение (необязательно)"
								/>
							</div>

							<div className="d-grid gap-2">
								<button
									className="btn btn-primary"
									onClick={sendTestNewsletter}
									disabled={sending || !subscribers.length}
								>
									{sending ? 'Отправка...' : 'Отправить тестовую рассылку'}
								</button>

								<button
									className="btn btn-outline-secondary"
									onClick={checkAndSendAutomated}
									disabled={sending}
								>
									{sending
										? 'Проверка...'
										: 'Проверить и отправить автоматическую рассылку'}
								</button>

								<button
									className="btn btn-outline-info"
									onClick={fetchSubscribers}
									disabled={loading}
								>
									{loading ? 'Обновление...' : 'Обновить список подписчиков'}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewsletterAdmin;
