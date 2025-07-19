import { useState } from "react";

type ValidationRule = (value: string) => string | null;
type ValidationSchema = {
  [key: string]: ValidationRule[];
};

export const useForm = (validationSchema: ValidationSchema = {}) => {
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (name: string, value: string): string | null => {
    const rules = validationSchema[name];
    if (!rules) return null;

    for (const rule of rules) {
      const error = rule(value);
      if (error) return error;
    }

    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Ejecuta validación en tiempo real
    const error = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error || "",
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    for (const field in validationSchema) {
      const value = formData[field] || "";
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const resetValues = () => {
    setFormData({});
    setErrors({});
  };

  return {
    formData,
    handleChange,
    resetValues,
    errors,
    validateField,
    validateForm,
  };
};
