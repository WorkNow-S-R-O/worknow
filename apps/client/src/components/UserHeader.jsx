/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';

const UserHeader = ({ user }) => (
	<div className="d-flex flex-column align-items-center mb-4">
		<img
			src={user.imageUrl || '/images/default-avatar.png'}
			alt="User Avatar"
			className="rounded-circle mb-3"
			style={{ width: '100px', height: '100px', objectFit: 'cover' }}
		/>
		<div>
			<h2>
				{user.firstName
					? `${user.firstName} ${user.lastName || ''}`
					: 'Анонимный пользователь'}
			</h2>
			<p className="text-muted">{user.email || 'Email не указан'}</p>
		</div>
	</div>
);

UserHeader.propTypes = {
	user: PropTypes.shape({
		imageUrl: PropTypes.string,
		firstName: PropTypes.string,
		lastName: PropTypes.string,
		email: PropTypes.string,
	}).isRequired,
};

export default UserHeader;
