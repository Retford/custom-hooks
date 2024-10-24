import { useEffect, useMemo, useState } from 'react';

export const useForm = (initialForm = {}, formValidations = {}) => {
  const [formState, setFormState] = useState(initialForm);
  const [formValidation, setFormValidation] = useState({});

  useEffect(() => {
    createValidators();
  }, [formState]);

  const isFormValid = useMemo(() => {
    for (const formValue of Object.keys(formValidation)) {
      if (formValidation[formValue] !== null) return false;
    }

    return true;
  }, [formValidation]);

  const handleInputChange = ({ target }) => {
    const { name, value } = target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleResetForm = () => {
    setFormState(initialForm);
  };

  const createValidators = () => {
    const formCheckValues = {};

    for (const formField of Object.keys(formValidations)) {
      const [fn, errorMessage] = formValidations[formField];

      formCheckValues[`${formField}Valid`] = fn(formState[formField])
        ? null
        : errorMessage;
    }
    setFormValidation(formCheckValues);
  };

  return {
    ...formState,
    formState,
    handleInputChange,
    handleResetForm,

    ...formValidation,
    isFormValid,
  };
};

// Example to use:

// const formValidations = {
//   fullName: [(value) => value.length >= 1, 'El nombre es obligatorio'],
//   email: [(value) => value.includes('@'), 'El correo debe de tener @'],
//   password: [
//     (value) => value.length >= 6,
//     'El password debe de tener más de 6 letras',
//   ],
// };

// const {
//   formState,
//   fullName,
//   email,
//   password,
//   handleInputChange,
//   isFormValid,
//   fullNameValid,
//   emailValid,
//   passwordValid,
// } = useForm(formData, formValidations);
