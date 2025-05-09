import { useState } from 'react';

/**
 * Custom hook để xử lý form
 * @param {Object} initialValues - Giá trị ban đầu của form
 * @param {Function} onSubmit - Function xử lý khi submit form
 * @param {Function} validate - Function validate (optional)
 * @returns {Object} - { values, errors, handleChange, handleSubmit, resetForm, setValues, isSubmitting }
 */
const useForm = (initialValues = {}, onSubmit, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues({
      ...values,
      [name]: type === 'checkbox' ? checked : value
    });

    // Xóa error khi người dùng bắt đầu sửa lại field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Set giá trị form từ bên ngoài
  const setFormValues = (newValues) => {
    setValues(newValues);
  };

  // Reset form về giá trị ban đầu
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let validationErrors = {};
    
    if (validate) {
      validationErrors = validate(values);
      setErrors(validationErrors);
    }
    
    // Chỉ submit nếu không có lỗi
    if (validate && Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    resetForm,
    setValues: setFormValues,
    isSubmitting
  };
};

export default useForm;