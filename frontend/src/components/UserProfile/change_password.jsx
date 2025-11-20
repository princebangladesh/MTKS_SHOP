import React, { useState } from 'react';
import axios from 'axios';
import './ChangePasswordForm.css'; // Custom styles
import Toast from '../shared/toast';
import { BASE_URL } from '../../config/api';

const ChangePasswordForm = ({ setActiveTab }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, name, type) => {
        setToast({ message, name, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            showToast("Passwords do not match", "Error", "error");
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('access');
            const response = await axios.post(
                `${BASE_URL}/api/auth/change_password/`,
                {
                    current_password: currentPassword,
                    new_password: newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                showToast("Password Changed Successfully", "Success", "success");
                if (typeof setActiveTab === 'function') {
                    setTimeout(() => setActiveTab('dashboard'), 2000);
                }
            }
        } catch (err) {
            showToast("Failed to change password", "Error", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="password-change-container">
            <h2 className="form-title">Change Your Password</h2>
            <form onSubmit={handlePasswordChange} className="password-form">
                <div className="input-group">
                    <label htmlFor="current-password">Current Password</label>
                    <input
                        type="password"
                        id="current-password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="new-password">New Password</label>
                    <input
                        type="password"
                        id="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="confirm-password">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? (
                        <span>
                            <i className="fa fa-spinner fa-spin"></i> Loading
                        </span>
                    ) : (
                        'Change Password'
                    )}
                </button>
            </form>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    title={toast.name}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default ChangePasswordForm;
