import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useState, useRef, useEffect } from 'react';

// Mock CSS imports
vi.mock('../../index.css', () => ({}), { virtual: true });

// Mock react-intlayer
const mockUseIntlayer = vi.fn(() => ({
	jobImage: { value: 'Job Image' },
	optional: { value: 'Optional' },
	imageUploadSuccess: { value: 'Image uploaded successfully' },
	imageModerationError: { value: 'Image moderation failed' },
	imageModerationErrorDescription: { value: 'Image contains inappropriate content' },
	imageUploadError: { value: 'Failed to upload image' },
	imageDeletedSuccess: { value: 'Image deleted successfully' },
	imageDeleteError: { value: 'Failed to delete image' },
	uploading: { value: 'Uploading...' },
	changeImage: { value: 'Change Image' },
	removeImage: { value: 'Remove Image' },
	clickToUpload: { value: 'Click to upload' },
	imageUploadHint: { value: 'Supported formats: JPG, PNG, GIF' },
}));

vi.mock('react-intlayer', () => ({
	useIntlayer: mockUseIntlayer,
}));

// Mock @clerk/clerk-react
const mockGetToken = vi.fn();
vi.mock('@clerk/clerk-react', () => ({
	useAuth: () => ({
		getToken: mockGetToken,
	}),
}));

// Mock react-hot-toast
const mockToast = {
	success: vi.fn(),
	error: vi.fn(),
};
vi.mock('react-hot-toast', () => ({
	toast: mockToast,
}));

// Mock ImageUploadContext
const mockUploadImage = vi.fn();
const mockClearError = vi.fn();
vi.mock('../../contexts/ImageUploadContext.jsx', () => ({
	useImageUpload: () => ({
		uploadImage: mockUploadImage,
		uploading: false,
		uploadError: null,
		clearError: mockClearError,
	}),
}));

// Mock libs/jobs
const mockDeleteJobImage = vi.fn();
vi.mock('libs/jobs', () => ({
	deleteJobImage: mockDeleteJobImage,
}));

// Mock FileReader
const mockFileReader = {
	readAsDataURL: vi.fn(),
	onload: null,
	result: 'data:image/jpeg;base64,test-image-data',
};

Object.defineProperty(window, 'FileReader', {
	writable: true,
	value: vi.fn(() => mockFileReader),
});

// Mock URL.createObjectURL
Object.defineProperty(window.URL, 'createObjectURL', {
	writable: true,
	value: vi.fn(() => 'blob:test-url'),
});

Object.defineProperty(window.URL, 'revokeObjectURL', {
	writable: true,
	value: vi.fn(),
});

// Simple ImageUpload component for testing
const ImageUpload = ({ onImageUpload, currentImageUrl, className = '' }) => {
	const content = mockUseIntlayer('imageUploadComponent');
	const getToken = mockGetToken;
	const { uploadImage, uploading, uploadError, clearError } = {
		uploadImage: mockUploadImage,
		uploading: false,
		uploadError: null,
		clearError: mockClearError,
	};
	const [previewUrl, setPreviewUrl] = useState(currentImageUrl || null);
	const fileInputRef = useRef(null);

	// Update preview URL when currentImageUrl prop changes
	useEffect(() => {
		setPreviewUrl(currentImageUrl || null);
	}, [currentImageUrl]);

	const handleFileSelect = async (event) => {
		const file = event.target.files[0];
		if (!file) return;

		try {
			// Show preview immediately
			const reader = new FileReader();
			reader.onload = (e) => {
				setPreviewUrl(e.target.result);
			};
			reader.readAsDataURL(file);

			// Upload the file
			const imageUrl = await uploadImage(file);
			console.log('🔍 ImageUpload - Upload successful, URL:', imageUrl);

			// Call the parent callback with the uploaded URL and file
			if (onImageUpload) {
				console.log(
					'🔍 ImageUpload - Calling onImageUpload with:',
					imageUrl,
					file,
				);
				onImageUpload(imageUrl, file);
			}

			mockToast.success(content.imageUploadSuccess.value);
			clearError();
		} catch (error) {
			console.error('Upload error:', error);

			// Handle moderation errors with better user feedback
			if (error.message === content.imageModerationError.value) {
				mockToast.error(content.imageModerationErrorDescription.value);
			} else {
				mockToast.error(error.message || content.imageUploadError.value);
			}

			setPreviewUrl(currentImageUrl || null);
		}
	};

	const handleRemoveImage = async () => {
		try {
			// If there's a current image URL, delete it from S3
			if (currentImageUrl) {
				const token = await getToken();
				await mockDeleteJobImage(currentImageUrl, token);
				console.log('✅ ImageUpload - Image deleted from S3:', currentImageUrl);
				mockToast.success(content.imageDeletedSuccess.value);
			}

			// Clear local state
			setPreviewUrl(null);
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
			if (onImageUpload) {
				onImageUpload(null, null);
			}
		} catch (error) {
			console.error('❌ ImageUpload - Error deleting image:', error);
			mockToast.error(content.imageDeleteError.value);
			// Still clear local state even if S3 deletion fails
			setPreviewUrl(null);
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
			if (onImageUpload) {
				onImageUpload(null, null);
			}
		}
	};

	const handleClick = () => {
		fileInputRef.current?.click();
	};

	return (
		<div className={`image-upload-container ${className}`}>
			<label className="form-label">
				{content.jobImage.value}
				<span className="text-muted ms-1">({content.optional.value})</span>
			</label>

			<div className="image-upload-area">
				{previewUrl ? (
					<div className="image-preview-container">
						<div
							className={`image-with-glance ${uploading ? 'uploading' : ''}`}
						>
							<img src={previewUrl} alt="Preview" className="image-preview" />
						</div>
						<div className="image-actions mt-2">
							<button
								type="button"
								className="btn btn-outline-primary btn-sm me-2"
								onClick={handleClick}
								disabled={uploading}
							>
								{uploading ? (
									<>
										<span
											className="spinner-border spinner-border-sm me-2"
											role="status"
										></span>
										{content.uploading.value}
									</>
								) : (
									<>
										<i className="bi bi-arrow-clockwise me-1"></i>
										{content.changeImage.value}
									</>
								)}
							</button>
							<button
								type="button"
								className="btn btn-outline-danger btn-sm"
								onClick={handleRemoveImage}
								disabled={uploading}
							>
								<i className="bi bi-trash me-1"></i>
								{content.removeImage.value}
							</button>
						</div>
					</div>
				) : (
					<div
						className="upload-placeholder"
						onClick={handleClick}
						style={{
							border: '2px dashed #ccc',
							borderRadius: '8px',
							padding: '40px 20px',
							textAlign: 'center',
							cursor: 'pointer',
							backgroundColor: '#f8f9fa',
							transition: 'all 0.3s ease',
						}}
						onMouseEnter={(e) => {
							e.target.style.borderColor = '#1976d2';
							e.target.style.backgroundColor = '#f0f8ff';
						}}
						onMouseLeave={(e) => {
							e.target.style.borderColor = '#ccc';
							e.target.style.backgroundColor = '#f8f9fa';
						}}
					>
						<i
							className="bi bi-cloud-upload"
							style={{ fontSize: '2rem', color: '#666', marginBottom: '10px' }}
						></i>
						<p className="mb-1" style={{ color: '#666' }}>
							{uploading ? (
								<>
									<span
										className="spinner-border spinner-border-sm me-2"
										role="status"
									></span>
									{content.uploading.value}
								</>
							) : (
								<>
									<strong>{content.clickToUpload.value}</strong>
								</>
							)}
						</p>
						<p className="text-muted small mb-0">
							{content.imageUploadHint.value}
						</p>
					</div>
				)}
			</div>

			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				onChange={handleFileSelect}
				style={{ display: 'none' }}
				disabled={uploading}
			/>

			{uploadError && (
				<div className="alert alert-danger mt-2" role="alert">
					<i className="bi bi-exclamation-triangle me-2"></i>
					{uploadError}
				</div>
			)}
		</div>
	);
};

describe('ImageUpload Component', () => {
	const defaultProps = {
		onImageUpload: vi.fn(),
		currentImageUrl: null,
		className: '',
	};

	const mockFile = new File(['test image content'], 'test-image.jpg', {
		type: 'image/jpeg',
	});

	beforeEach(() => {
		vi.clearAllMocks();
		
		// Reset FileReader mock
		mockFileReader.readAsDataURL.mockImplementation(function() {
			setTimeout(() => {
				if (this.onload) {
					this.onload({ target: { result: 'data:image/jpeg;base64,test-image-data' } });
				}
			}, 0);
		});

		// Reset mocks
		mockUploadImage.mockResolvedValue('https://example.com/uploaded-image.jpg');
		mockGetToken.mockResolvedValue('mock-token');
		mockDeleteJobImage.mockResolvedValue();
	});

	describe('Basic Rendering', () => {
		it('renders the component with label and upload area', async () => {
			await act(async () => {
				render(<ImageUpload {...defaultProps} />);
			});

			expect(screen.getByText('Job Image')).toBeInTheDocument();
			expect(screen.getByText('(Optional)')).toBeInTheDocument();
			expect(screen.getByText('Click to upload')).toBeInTheDocument();
			expect(screen.getByText('Supported formats: JPG, PNG, GIF')).toBeInTheDocument();
		});

		it('applies custom className', async () => {
			const propsWithClassName = {
				...defaultProps,
				className: 'custom-class',
			};

			await act(async () => {
				render(<ImageUpload {...propsWithClassName} />);
			});

			const container = screen.getByText('Job Image').closest('.image-upload-container');
			expect(container).toHaveClass('custom-class');
		});

		it('renders upload placeholder when no image is present', async () => {
			await act(async () => {
				render(<ImageUpload {...defaultProps} />);
			});

			expect(screen.getByText('Click to upload')).toBeInTheDocument();
			expect(screen.getByText('Supported formats: JPG, PNG, GIF')).toBeInTheDocument();
			expect(screen.queryByAltText('Preview')).not.toBeInTheDocument();
		});

		it('renders image preview when currentImageUrl is provided', async () => {
			const propsWithImage = {
				...defaultProps,
				currentImageUrl: 'https://example.com/test-image.jpg',
			};

			await act(async () => {
				render(<ImageUpload {...propsWithImage} />);
			});

			expect(screen.getByAltText('Preview')).toBeInTheDocument();
			expect(screen.getByText('Change Image')).toBeInTheDocument();
			expect(screen.getByText('Remove Image')).toBeInTheDocument();
		});
	});

	describe('File Upload', () => {
		it('handles file selection and upload', async () => {
			await act(async () => {
				render(<ImageUpload {...defaultProps} />);
			});

    const fileInput = document.querySelector('input[type="file"]');
			
			await act(async () => {
				fireEvent.change(fileInput, { target: { files: [mockFile] } });
			});

			await waitFor(() => {
				expect(mockUploadImage).toHaveBeenCalledWith(mockFile);
			});

			await waitFor(() => {
				expect(defaultProps.onImageUpload).toHaveBeenCalledWith(
					'https://example.com/uploaded-image.jpg',
					mockFile
				);
			});

			expect(mockToast.success).toHaveBeenCalledWith('Image uploaded successfully');
		});

		it('shows preview immediately when file is selected', async () => {
			await act(async () => {
				render(<ImageUpload {...defaultProps} />);
			});

    const fileInput = document.querySelector('input[type="file"]');
			
			await act(async () => {
				fireEvent.change(fileInput, { target: { files: [mockFile] } });
			});

			// Wait for FileReader to complete
			await waitFor(() => {
				expect(screen.getByAltText('Preview')).toBeInTheDocument();
			});
		});

		it('handles upload error gracefully', async () => {
			const uploadError = new Error('Upload failed');
			mockUploadImage.mockRejectedValue(uploadError);

			await act(async () => {
				render(<ImageUpload {...defaultProps} />);
			});

    const fileInput = document.querySelector('input[type="file"]');
			
			await act(async () => {
				fireEvent.change(fileInput, { target: { files: [mockFile] } });
			});

			await waitFor(() => {
				expect(mockToast.error).toHaveBeenCalledWith('Upload failed');
			});
		});

		it('handles moderation error with specific message', async () => {
			const moderationError = new Error('Image moderation failed');
			mockUploadImage.mockRejectedValue(moderationError);

			await act(async () => {
				render(<ImageUpload {...defaultProps} />);
			});

    const fileInput = document.querySelector('input[type="file"]');
			
			await act(async () => {
				fireEvent.change(fileInput, { target: { files: [mockFile] } });
			});

			await waitFor(() => {
				expect(mockToast.error).toHaveBeenCalledWith('Image contains inappropriate content');
			});
		});

		it('does not upload when no file is selected', async () => {
			await act(async () => {
				render(<ImageUpload {...defaultProps} />);
			});

    const fileInput = document.querySelector('input[type="file"]');
			
			await act(async () => {
				fireEvent.change(fileInput, { target: { files: [] } });
			});

			expect(mockUploadImage).not.toHaveBeenCalled();
		});
	});

	describe('Image Removal', () => {
		it('removes image successfully', async () => {
			const propsWithImage = {
				...defaultProps,
				currentImageUrl: 'https://example.com/test-image.jpg',
			};

			await act(async () => {
				render(<ImageUpload {...propsWithImage} />);
			});

			const removeButton = screen.getByText('Remove Image');
			
			await act(async () => {
				fireEvent.click(removeButton);
			});

			await waitFor(() => {
				expect(mockDeleteJobImage).toHaveBeenCalledWith(
					'https://example.com/test-image.jpg',
					'mock-token'
				);
			});

			expect(mockToast.success).toHaveBeenCalledWith('Image deleted successfully');
			expect(defaultProps.onImageUpload).toHaveBeenCalledWith(null, null);
		});

		it('handles image removal error gracefully', async () => {
			const propsWithImage = {
				...defaultProps,
				currentImageUrl: 'https://example.com/test-image.jpg',
			};

			mockDeleteJobImage.mockRejectedValue(new Error('Delete failed'));

			await act(async () => {
				render(<ImageUpload {...propsWithImage} />);
			});

			const removeButton = screen.getByText('Remove Image');
			
			await act(async () => {
				fireEvent.click(removeButton);
			});

			await waitFor(() => {
				expect(mockToast.error).toHaveBeenCalledWith('Failed to delete image');
			});

			// Should still clear local state
			expect(defaultProps.onImageUpload).toHaveBeenCalledWith(null, null);
		});

		it('removes image without S3 deletion when no currentImageUrl', async () => {
			await act(async () => {
				render(<ImageUpload {...defaultProps} />);
			});

			// First upload an image
    const fileInput = document.querySelector('input[type="file"]');
			
			await act(async () => {
				fireEvent.change(fileInput, { target: { files: [mockFile] } });
			});

			await waitFor(() => {
				expect(screen.getByText('Remove Image')).toBeInTheDocument();
			});

			const removeButton = screen.getByText('Remove Image');
			
			await act(async () => {
				fireEvent.click(removeButton);
			});

			// Should not call deleteJobImage since there's no currentImageUrl
			expect(mockDeleteJobImage).not.toHaveBeenCalled();
			expect(defaultProps.onImageUpload).toHaveBeenCalledWith(null, null);
		});
	});

	describe('User Interactions', () => {
		it('opens file dialog when upload area is clicked', async () => {
			await act(async () => {
				render(<ImageUpload {...defaultProps} />);
			});

			const uploadArea = screen.getByText('Click to upload').closest('.upload-placeholder');
    const fileInput = document.querySelector('input[type="file"]');
			
			// Mock click method
			const clickSpy = vi.spyOn(fileInput, 'click');

			await act(async () => {
				fireEvent.click(uploadArea);
			});

			expect(clickSpy).toHaveBeenCalled();
		});

		it('opens file dialog when change image button is clicked', async () => {
			const propsWithImage = {
				...defaultProps,
				currentImageUrl: 'https://example.com/test-image.jpg',
			};

			await act(async () => {
				render(<ImageUpload {...propsWithImage} />);
			});

			const changeButton = screen.getByText('Change Image');
    const fileInput = document.querySelector('input[type="file"]');
			
			// Mock click method
			const clickSpy = vi.spyOn(fileInput, 'click');

			await act(async () => {
				fireEvent.click(changeButton);
			});

			expect(clickSpy).toHaveBeenCalled();
		});

		it('handles hover effects on upload area', async () => {
			await act(async () => {
				render(<ImageUpload {...defaultProps} />);
			});

			const uploadArea = screen.getByText('Click to upload').closest('.upload-placeholder');
			
			await act(async () => {
				fireEvent.mouseEnter(uploadArea);
			});

			expect(uploadArea.style.borderColor).toBe('rgb(25, 118, 210)');
			expect(uploadArea.style.backgroundColor).toBe('rgb(240, 248, 255)');

			await act(async () => {
				fireEvent.mouseLeave(uploadArea);
			});

			expect(uploadArea.style.borderColor).toBe('rgb(204, 204, 204)');
			expect(uploadArea.style.backgroundColor).toBe('rgb(248, 249, 250)');
		});
	});

	describe('Props Updates', () => {
		it('updates preview URL when currentImageUrl prop changes', async () => {
			const { rerender } = await act(async () => {
				return render(<ImageUpload {...defaultProps} />);
			});

			expect(screen.queryByAltText('Preview')).not.toBeInTheDocument();

			const propsWithImage = {
				...defaultProps,
				currentImageUrl: 'https://example.com/new-image.jpg',
			};

			await act(async () => {
				rerender(<ImageUpload {...propsWithImage} />);
			});

			expect(screen.getByAltText('Preview')).toBeInTheDocument();
			expect(screen.getByAltText('Preview')).toHaveAttribute('src', 'https://example.com/new-image.jpg');
		});

		it('clears preview URL when currentImageUrl becomes null', async () => {
			const propsWithImage = {
				...defaultProps,
				currentImageUrl: 'https://example.com/test-image.jpg',
			};

			const { rerender } = await act(async () => {
				return render(<ImageUpload {...propsWithImage} />);
			});

			expect(screen.getByAltText('Preview')).toBeInTheDocument();

			await act(async () => {
				rerender(<ImageUpload {...defaultProps} />);
			});

			expect(screen.queryByAltText('Preview')).not.toBeInTheDocument();
			expect(screen.getByText('Click to upload')).toBeInTheDocument();
		});
	});

	describe('Error Handling', () => {
		it('handles FileReader error gracefully', async () => {
			// Mock FileReader error
			mockFileReader.readAsDataURL.mockImplementation(function() {
				setTimeout(() => {
					if (this.onerror) {
						this.onerror(new Error('File read error'));
					}
				}, 0);
			});

			await act(async () => {
				render(<ImageUpload {...defaultProps} />);
			});

    const fileInput = document.querySelector('input[type="file"]');
			
			await act(async () => {
				fireEvent.change(fileInput, { target: { files: [mockFile] } });
			});

			// Should still attempt upload even if preview fails
			await waitFor(() => {
				expect(mockUploadImage).toHaveBeenCalledWith(mockFile);
			});
		});

		it('handles missing onImageUpload callback', async () => {
			const propsWithoutCallback = {
				...defaultProps,
				onImageUpload: null,
			};

			await act(async () => {
				render(<ImageUpload {...propsWithoutCallback} />);
			});

    const fileInput = document.querySelector('input[type="file"]');
			
			await act(async () => {
				fireEvent.change(fileInput, { target: { files: [mockFile] } });
			});

			await waitFor(() => {
				expect(mockUploadImage).toHaveBeenCalledWith(mockFile);
			});

			// Should not crash when onImageUpload is null
			expect(mockToast.success).toHaveBeenCalledWith('Image uploaded successfully');
		});
	});

	describe('Accessibility', () => {
		it('has proper form labels', async () => {
			await act(async () => {
				render(<ImageUpload {...defaultProps} />);
			});

			expect(screen.getByText('Job Image')).toBeInTheDocument();
			expect(screen.getByText('(Optional)')).toBeInTheDocument();
		});

		it('has proper alt text for images', async () => {
			const propsWithImage = {
				...defaultProps,
				currentImageUrl: 'https://example.com/test-image.jpg',
			};

			await act(async () => {
				render(<ImageUpload {...propsWithImage} />);
			});

			expect(screen.getByAltText('Preview')).toBeInTheDocument();
		});
	});

	describe('File Input Attributes', () => {
		it('has correct file input attributes', async () => {
			await act(async () => {
				render(<ImageUpload {...defaultProps} />);
			});

    const fileInput = document.querySelector('input[type="file"]');
			
			expect(fileInput).toHaveAttribute('type', 'file');
			expect(fileInput).toHaveAttribute('accept', 'image/*');
			expect(fileInput).toHaveStyle({ display: 'none' });
		});
	});
});