import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormSkeleton } from './skeleton';
import { Loader2, Save, X } from 'lucide-react';

/**
 * Componente de formulario reutilizable con validación
 */
const FormBuilder = React.memo(({
  fields = [],
  initialData = {},
  onSubmit,
  onCancel,
  loading = false,
  submitText = "Guardar",
  cancelText = "Cancelar",
  title = "",
  description = "",
  className = "",
  validationSchema = null,
  ...props
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Actualizar formData cuando cambie initialData
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // Validar campo individual
  const validateField = (fieldName, value) => {
    if (!validationSchema) return null;

    try {
      validationSchema.validateSyncAt(fieldName, { [fieldName]: value });
      return null;
    } catch (error) {
      return error.message;
    }
  };

  // Manejar cambio de campo
  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Validar campo en tiempo real
    if (validationSchema) {
      const fieldError = validateField(fieldName, value);
      setErrors(prev => ({
        ...prev,
        [fieldName]: fieldError
      }));
    }
  };

  // Validar formulario completo
  const validateForm = () => {
    if (!validationSchema) return true;

    try {
      validationSchema.validateSync(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach(error => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderizar campo según su tipo
  const renderField = (field) => {
    const {
      name,
      label,
      type = 'text',
      placeholder,
      required = false,
      options = [],
      validation,
      ...fieldProps
    } = field;

    const error = errors[name];
    const value = formData[name] || '';

    const commonProps = {
      id: name,
      name,
      value,
      onChange: (e) => handleFieldChange(name, e.target.value),
      className: error ? 'border-red-500' : '',
      required,
      ...fieldProps
    };

    switch (type) {
      case 'textarea':
        return (
          <div key={name} className="space-y-2">
            <Label htmlFor={name} className="text-sm font-medium">
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              {...commonProps}
              placeholder={placeholder}
              rows={4}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={name} className="space-y-2">
            <Label htmlFor={name} className="text-sm font-medium">
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Select
              value={value}
              onValueChange={(val) => handleFieldChange(name, val)}
            >
              <SelectTrigger className={error ? 'border-red-500' : ''}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={name} className="flex items-center space-x-2">
            <Checkbox
              id={name}
              checked={value}
              onCheckedChange={(checked) => handleFieldChange(name, checked)}
              {...fieldProps}
            />
            <Label htmlFor={name} className="text-sm font-medium">
              {label}
            </Label>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        );

      case 'radio':
        return (
          <div key={name} className="space-y-2">
            <Label className="text-sm font-medium">
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <RadioGroup
              value={value}
              onValueChange={(val) => handleFieldChange(name, val)}
            >
              {options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${name}-${option.value}`} />
                  <Label htmlFor={`${name}-${option.value}`} className="text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        );

      case 'email':
        return (
          <div key={name} className="space-y-2">
            <Label htmlFor={name} className="text-sm font-medium">
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              {...commonProps}
              type="email"
              placeholder={placeholder}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        );

      case 'password':
        return (
          <div key={name} className="space-y-2">
            <Label htmlFor={name} className="text-sm font-medium">
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              {...commonProps}
              type="password"
              placeholder={placeholder}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        );

      case 'number':
        return (
          <div key={name} className="space-y-2">
            <Label htmlFor={name} className="text-sm font-medium">
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              {...commonProps}
              type="number"
              placeholder={placeholder}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        );

      case 'date':
        return (
          <div key={name} className="space-y-2">
            <Label htmlFor={name} className="text-sm font-medium">
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              {...commonProps}
              type="date"
              placeholder={placeholder}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        );

      default:
        return (
          <div key={name} className="space-y-2">
            <Label htmlFor={name} className="text-sm font-medium">
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              {...commonProps}
              placeholder={placeholder}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        );
    }
  };

  if (loading) {
    return <FormSkeleton />;
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`} {...props}>
      {/* Header del formulario */}
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Campos del formulario */}
      <div className="space-y-4">
        {fields.map(renderField)}
      </div>

      {/* Botones de acción */}
      <div className="flex items-center justify-end space-x-2 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4 mr-2" />
            {cancelText}
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {submitText}
        </Button>
      </div>
    </form>
  );
});

FormBuilder.displayName = 'FormBuilder';

export default FormBuilder; 