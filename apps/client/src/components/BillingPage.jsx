import { useUser } from '@clerk/clerk-react';
import { useClerk } from '@clerk/clerk-react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useIntlayer } from 'react-intlayer';

const API_URL = import.meta.env.VITE_API_URL;
const PAGE_SIZE = 10;

const BillingPage = () => {
	const content = useIntlayer('billingPage');
	const { user } = useUser();
	const { redirectToSignIn } = useClerk();
	const [history, setHistory] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [pageStack, setPageStack] = useState([]); // для keyset пагинации (массив id)
	const [currentPage, setCurrentPage] = useState(0);
	const [hasNext, setHasNext] = useState(false);
	const [hasPrev, setHasPrev] = useState(false);

	const fetchHistory = async (startingAfter = null, page = 0) => {
		if (!user) return;
		setLoading(true);
		setError('');
		try {
			let url = `${API_URL}/api/payments/stripe-history?clerkUserId=${user.id}&limit=${PAGE_SIZE}`;
			if (startingAfter) url += `&starting_after=${startingAfter}`;
			const res = await axios.get(url);
			setHistory(res.data.payments || []);
			setHasNext((res.data.payments || []).length === PAGE_SIZE);
			setHasPrev(page > 0);
		} catch {
			setError(content.error_loading_history);
			setHistory([]);
			setHasNext(false);
			setHasPrev(page > 0);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setPageStack([]);
		setCurrentPage(0);
		fetchHistory(null, 0);
		// eslint-disable-next-line
	}, [user]);

	const handleNext = () => {
		if (history.length === 0) return;
		const lastId = history[history.length - 1].id;
		setPageStack((prev) => [...prev, lastId]);
		setCurrentPage((prev) => prev + 1);
		fetchHistory(lastId, currentPage + 1);
	};

	const handlePrev = () => {
		if (pageStack.length === 0) return;
		const newStack = [...pageStack];
		newStack.pop();
		setPageStack(newStack);
		setCurrentPage((prev) => prev - 1);
		fetchHistory(newStack[newStack.length - 1] || null, currentPage - 1);
	};

	return (
		<div
			className="container"
			style={{ maxWidth: 600, margin: '0 auto', paddingTop: 60 }}
		>
			<h2 className="text-center mb-4">{content.billing_title}</h2>
			<div className="mb-4 text-center">
				<Link
					to="/cancel-subscription"
					className="text-secondary"
					style={{ textDecoration: 'underline', cursor: 'pointer' }}
				>
					{content.cancel_subscription}
				</Link>
			</div>
			<h5 className="mb-3">{content.payment_history}</h5>
			{!user ? (
				<div className="alert alert-info text-center">
					{content.no_transaction_history}{' '}
					<button
						className="btn btn-primary ms-2"
						onClick={() => redirectToSignIn()}
						type="button"
					>
						{content.sign_in}
					</button>
				</div>
			) : loading ? (
				<div>{content.loading}</div>
			) : error ? (
				<div className="alert alert-danger">{error}</div>
			) : history.length === 0 ? (
				<div className="alert alert-info">{content.no_payments}</div>
			) : (
				<>
					<div className="table-responsive">
						<table className="table table-striped table-hover table-bordered shadow rounded text-center align-middle">
							<thead className="table-primary">
								<tr>
									<th className="align-middle">{content.month}</th>
									<th className="align-middle">{content.amount}</th>
									<th className="align-middle">{content.subscription_type}</th>
									<th className="align-middle">{content.date}</th>
								</tr>
							</thead>
							<tbody>
								{history.map((item) => {
									let periodStr = '-';
									if (item.period) {
										let periodDate = item.period;
										if (
											typeof periodDate === 'string' ||
											typeof periodDate === 'number'
										) {
											periodDate = new Date(periodDate);
										}
										if (periodDate instanceof Date && !isNaN(periodDate)) {
											periodStr = periodDate.toLocaleDateString('ru-RU', {
												month: 'long',
												year: 'numeric',
											});
										}
									}
									return (
										<tr key={item.id}>
											<td className="align-middle">{periodStr}</td>
											<td className="align-middle fw-bold">
												{item.amount ? `${item.amount}₪` : '-'}
											</td>
											<td className="align-middle">{item.type || '-'}</td>
											<td className="align-middle">
												{item.date
													? new Date(item.date).toLocaleDateString()
													: '-'}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
					<nav className="d-flex justify-content-center mt-3">
						<ul className="pagination mb-0">
							<li className="page-item">
								<button
									className="page-link"
									onClick={handlePrev}
									disabled={!hasPrev}
								>
									&laquo; {content.previous}
								</button>
							</li>
							<li className="page-item">
								<button
									className="page-link"
									onClick={handleNext}
									disabled={!hasNext}
								>
									{content.next} &raquo;
								</button>
							</li>
						</ul>
					</nav>
				</>
			)}
		</div>
	);
};

export default BillingPage;
