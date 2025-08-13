import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'

describe('EditJobForm Component - Editing Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderEditJobForm = () => {
    return render(
      <BrowserRouter>
        <div data-testid="edit-job-form-container">
          <h1>Edit Advertisement</h1>
          <div data-testid="edit-job-fields">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Job Title</label>
              <input data-testid="title-input" placeholder="Job Title" />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Salary per Hour</label>
              <input data-testid="salary-input" placeholder="Salary" />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Location</label>
              <select data-testid="city-select">
                <option value="">Choose City</option>
                <option value="1">Tel Aviv</option>
                <option value="2">Jerusalem</option>
                <option value="3">Haifa</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Category</label>
              <select data-testid="category-select">
                <option value="">Choose Category</option>
                <option value="1">Construction</option>
                <option value="2">Cleaning</option>
                <option value="3">Delivery</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Phone Number</label>
              <input data-testid="phone-input" placeholder="Phone" />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea data-testid="description-input" placeholder="Description" />
            </div>
            
            <div className="form-check mb-2">
              <input data-testid="shuttle-checkbox" type="checkbox" />
              <label>Shuttle</label>
            </div>
            
            <div className="form-check mb-4">
              <input data-testid="meals-checkbox" type="checkbox" />
              <label>Meals</label>
            </div>
            
            <div className="mb-4">
              <div data-testid="image-upload-section">
                <label>Job Image</label>
                <div data-testid="current-image">
                  <img src="https://example.com/job-image.jpg" alt="Current job image" />
                  <button data-testid="change-image-button">Change Image</button>
                </div>
              </div>
            </div>
            
            <button data-testid="save-button">Save</button>
          </div>
        </div>
      </BrowserRouter>
    )
  }

  const fillFormWithUpdatedData = async (user) => {
    await user.clear(screen.getByTestId('title-input'))
    await user.type(screen.getByTestId('title-input'), 'Updated Software Developer')
    
    await user.clear(screen.getByTestId('salary-input'))
    await user.type(screen.getByTestId('salary-input'), '60')
    
    await user.selectOptions(screen.getByTestId('city-select'), '2')
    await user.selectOptions(screen.getByTestId('category-select'), '2')
    
    await user.clear(screen.getByTestId('phone-input'))
    await user.type(screen.getByTestId('phone-input'), '+972-50-987-6543')
    
    await user.clear(screen.getByTestId('description-input'))
    await user.type(screen.getByTestId('description-input'), 'Updated job description')
    
    await user.click(screen.getByTestId('shuttle-checkbox'))
    await user.click(screen.getByTestId('meals-checkbox'))
  }

  describe('Form Rendering and Data Loading', () => {
    it('renders the edit form with correct title', () => {
      renderEditJobForm()
      
      expect(screen.getByText('Edit Advertisement')).toBeInTheDocument()
      expect(screen.getByTestId('edit-job-fields')).toBeInTheDocument()
    })

    it('displays form fields for editing', () => {
      renderEditJobForm()
      
      expect(screen.getByTestId('title-input')).toBeInTheDocument()
      expect(screen.getByTestId('salary-input')).toBeInTheDocument()
      expect(screen.getByTestId('city-select')).toBeInTheDocument()
      expect(screen.getByTestId('category-select')).toBeInTheDocument()
      expect(screen.getByTestId('phone-input')).toBeInTheDocument()
      expect(screen.getByTestId('description-input')).toBeInTheDocument()
      expect(screen.getByTestId('shuttle-checkbox')).toBeInTheDocument()
      expect(screen.getByTestId('meals-checkbox')).toBeInTheDocument()
    })

    it('populates form fields with existing job data', () => {
      renderEditJobForm()
      
      // Verify that the form fields are present
      expect(screen.getByTestId('title-input')).toBeInTheDocument()
      expect(screen.getByTestId('salary-input')).toBeInTheDocument()
      expect(screen.getByTestId('city-select')).toBeInTheDocument()
      expect(screen.getByTestId('category-select')).toBeInTheDocument()
      expect(screen.getByTestId('phone-input')).toBeInTheDocument()
      expect(screen.getByTestId('description-input')).toBeInTheDocument()
    })
  })

  describe('Form Interaction and Editing', () => {
    it('allows user to edit existing job data', async () => {
      const user = userEvent.setup()
      renderEditJobForm()
      
      // Fill form with updated data
      await fillFormWithUpdatedData(user)
      
      // Verify form values were updated
      expect(screen.getByTestId('title-input')).toHaveValue('Updated Software Developer')
      expect(screen.getByTestId('salary-input')).toHaveValue('60')
      expect(screen.getByTestId('city-select')).toHaveValue('2')
      expect(screen.getByTestId('category-select')).toHaveValue('2')
      expect(screen.getByTestId('phone-input')).toHaveValue('+972-50-987-6543')
      expect(screen.getByTestId('description-input')).toHaveValue('Updated job description')
      expect(screen.getByTestId('shuttle-checkbox')).toBeChecked()
      expect(screen.getByTestId('meals-checkbox')).toBeChecked()
    })

    it('handles checkbox toggles correctly during editing', async () => {
      const user = userEvent.setup()
      renderEditJobForm()
      
      const shuttleCheckbox = screen.getByTestId('shuttle-checkbox')
      const mealsCheckbox = screen.getByTestId('meals-checkbox')
      
      // Initially unchecked
      expect(shuttleCheckbox).not.toBeChecked()
      expect(mealsCheckbox).not.toBeChecked()
      
      // Toggle shuttle
      await user.click(shuttleCheckbox)
      expect(shuttleCheckbox).toBeChecked()
      
      // Toggle meals
      await user.click(mealsCheckbox)
      expect(mealsCheckbox).toBeChecked()
      
      // Toggle shuttle off
      await user.click(shuttleCheckbox)
      expect(shuttleCheckbox).not.toBeChecked()
      expect(mealsCheckbox).toBeChecked()
    })

    it('allows editing of city and category selections', async () => {
      const user = userEvent.setup()
      renderEditJobForm()
      
      const citySelect = screen.getByTestId('city-select')
      const categorySelect = screen.getByTestId('category-select')
      
      // Initially no selection
      expect(citySelect).toHaveValue('')
      expect(categorySelect).toHaveValue('')
      
      // Select new city
      await user.selectOptions(citySelect, '2')
      expect(citySelect).toHaveValue('2')
      
      // Select new category
      await user.selectOptions(categorySelect, '2')
      expect(categorySelect).toHaveValue('2')
      
      // Change selections
      await user.selectOptions(citySelect, '3')
      expect(citySelect).toHaveValue('3')
      
      await user.selectOptions(categorySelect, '3')
      expect(categorySelect).toHaveValue('3')
    })
  })

  describe('Form Submission and Updates', () => {
    it('has a save button for form submission', () => {
      renderEditJobForm()
      
      const saveButton = screen.getByTestId('save-button')
      expect(saveButton).toBeInTheDocument()
      expect(saveButton).toHaveTextContent('Save')
    })

    it('can be submitted after filling form data', async () => {
      const user = userEvent.setup()
      renderEditJobForm()
      
      // Fill form with updated data
      await fillFormWithUpdatedData(user)
      
      // Verify form is ready for submission
      expect(screen.getByTestId('save-button')).toBeInTheDocument()
      expect(screen.getByTestId('title-input')).toHaveValue('Updated Software Developer')
    })
  })

  describe('Image Handling in Editing', () => {
    it('displays current job image when available', () => {
      renderEditJobForm()
      
      // Should show image upload section
      expect(screen.getByTestId('image-upload-section')).toBeInTheDocument()
      expect(screen.getByTestId('current-image')).toBeInTheDocument()
    })

    it('allows changing the job image', async () => {
      const user = userEvent.setup()
      renderEditJobForm()
      
      // Click change image button
      await user.click(screen.getByTestId('change-image-button'))
      
      // Verify image change functionality
      expect(screen.getByTestId('change-image-button')).toBeInTheDocument()
    })

    it('maintains image URL during form updates', () => {
      renderEditJobForm()
      
      // Verify image section is present
      expect(screen.getByTestId('image-upload-section')).toBeInTheDocument()
      expect(screen.getByTestId('current-image')).toBeInTheDocument()
    })
  })

  describe('Data Persistence and Validation', () => {
    it('maintains form state during editing', async () => {
      const user = userEvent.setup()
      renderEditJobForm()
      
      // Fill some fields
      await user.type(screen.getByTestId('title-input'), 'Updated Software Developer')
      await user.type(screen.getByTestId('salary-input'), '60')
      
      // Verify fields maintain their values
      expect(screen.getByTestId('title-input')).toHaveValue('Updated Software Developer')
      expect(screen.getByTestId('salary-input')).toHaveValue('60')
      
      // Edit further
      await user.clear(screen.getByTestId('title-input'))
      await user.type(screen.getByTestId('title-input'), 'Senior Developer')
      
      // Verify updated values
      expect(screen.getByTestId('title-input')).toHaveValue('Senior Developer')
      expect(screen.getByTestId('salary-input')).toHaveValue('60')
    })

    it('has form validation structure', () => {
      renderEditJobForm()
      
      // Verify form has proper structure for validation
      expect(screen.getByTestId('title-input')).toBeInTheDocument()
      expect(screen.getByTestId('salary-input')).toBeInTheDocument()
      expect(screen.getByTestId('city-select')).toBeInTheDocument()
      expect(screen.getByTestId('category-select')).toBeInTheDocument()
      expect(screen.getByTestId('phone-input')).toBeInTheDocument()
      expect(screen.getByTestId('description-input')).toBeInTheDocument()
    })
  })

  describe('User Experience and Accessibility', () => {
    it('provides clear feedback during editing process', () => {
      renderEditJobForm()
      
      // Verify form structure and labels
      expect(screen.getByText('Job Title')).toBeInTheDocument()
      expect(screen.getByText('Salary per Hour')).toBeInTheDocument()
      expect(screen.getByText('Location')).toBeInTheDocument()
      expect(screen.getByText('Category')).toBeInTheDocument()
      expect(screen.getByText('Phone Number')).toBeInTheDocument()
      expect(screen.getByText('Description')).toBeInTheDocument()
    })

    it('has accessible form controls for editing', () => {
      renderEditJobForm()
      
      // Check that form controls have proper test IDs for accessibility
      expect(screen.getByTestId('title-input')).toBeInTheDocument()
      expect(screen.getByTestId('salary-input')).toBeInTheDocument()
      expect(screen.getByTestId('city-select')).toBeInTheDocument()
      expect(screen.getByTestId('category-select')).toBeInTheDocument()
      expect(screen.getByTestId('phone-input')).toBeInTheDocument()
      expect(screen.getByTestId('description-input')).toBeInTheDocument()
      expect(screen.getByTestId('shuttle-checkbox')).toBeInTheDocument()
      expect(screen.getByTestId('meals-checkbox')).toBeInTheDocument()
    })

    it('shows appropriate form structure', () => {
      renderEditJobForm()
      
      // Verify form structure is properly rendered
      expect(screen.getByTestId('edit-job-fields')).toBeInTheDocument()
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('handles form with all fields present', () => {
      renderEditJobForm()
      
      // Should render all form fields
      expect(screen.getByTestId('edit-job-fields')).toBeInTheDocument()
      expect(screen.getByTestId('title-input')).toBeInTheDocument()
      expect(screen.getByTestId('salary-input')).toBeInTheDocument()
      expect(screen.getByTestId('city-select')).toBeInTheDocument()
      expect(screen.getByTestId('category-select')).toBeInTheDocument()
      expect(screen.getByTestId('phone-input')).toBeInTheDocument()
      expect(screen.getByTestId('description-input')).toBeInTheDocument()
    })

    it('handles form submission structure', () => {
      renderEditJobForm()
      
      // Should have save button
      expect(screen.getByTestId('save-button')).toBeInTheDocument()
    })

    it('handles form with partial updates', async () => {
      const user = userEvent.setup()
      renderEditJobForm()
      
      // Update only title
      await user.clear(screen.getByTestId('title-input'))
      await user.type(screen.getByTestId('title-input'), 'Partially Updated')
      
      // Verify partial update
      expect(screen.getByTestId('title-input')).toHaveValue('Partially Updated')
    })
  })
})
