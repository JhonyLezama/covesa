import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

interface ContactFormProps {
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  context?: 'contacto' | 'vende' | 'proyecto' | 'refiere';
  onSubmit?: (data: FormData) => void;
  isProcessing?: boolean;
  errors?: Record<string, string>;
  successMessage?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyType?: string;
  budget?: string;
}

const contextConfig = {
  contacto: {
    title: 'Contáctanos',
    subtitle: 'Déjanos tus datos y un asesor se comunicará contigo a la brevedad.',
    submitLabel: 'Enviar mensaje',
  },
  vende: {
    title: 'Vende tu propiedad con nosotros',
    subtitle: 'Déjanos los datos de tu propiedad y te daremos una evaluación gratuita.',
    submitLabel: 'Enviar datos de propiedad',
  },
  proyecto: {
    title: 'Solicita más información',
    subtitle: 'Completa el formulario y recibe toda la información del proyecto.',
    submitLabel: 'Solicitar información',
  },
  refiere: {
    title: 'Refiere y gana',
    subtitle: 'Conoce a alguien interesado? Refiérelo y obtén beneficios exclusivos.',
    submitLabel: 'Enviar referencia',
  },
};

export default function ContactForm({
  title,
  subtitle,
  submitLabel,
  context = 'contacto',
  onSubmit,
  isProcessing = false,
  errors: externalErrors,
  successMessage,
}: ContactFormProps) {
  const config = contextConfig[context];
  const formTitle = title || config.title;
  const formSubtitle = subtitle || config.subtitle;
  const formSubmitLabel = submitLabel || config.submitLabel;

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    propertyType: '',
    budget: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un email válido';
    }
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
    if (context === 'vende' && !formData.message.trim()) {
      newErrors.message = 'Describe tu propiedad';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    if (onSubmit) {
      onSubmit(formData);
    } else {
      setIsSubmitted(true);
    }
  };

  if (isSubmitted || successMessage) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sm:p-8 text-center">
        <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-text mb-2">
          {successMessage || '¡Mensaje enviado correctamente!'}
        </h3>
        <p className="text-sm text-gray-muted">
          Nos comunicaremos contigo a la brevedad. Gracias por tu interés en COVESA.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sm:p-8">
      <div className="mb-6">
        <h3 className="text-xl font-medium text-gray-text mb-1">{formTitle}</h3>
        <p className="text-sm text-gray-muted">{formSubtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm text-gray-text mb-1.5">
            Nombre completo <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors ${
              errors.name ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
            }`}
            placeholder="Tu nombre"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm text-gray-text mb-1.5">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors ${
              errors.email ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
            }`}
            placeholder="tu@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm text-gray-text mb-1.5">
            Teléfono <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors ${
              errors.phone ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
            }`}
            placeholder="+51 999 999 999"
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.phone}
            </p>
          )}
        </div>

        {/* Extra fields for 'vende' context */}
        {context === 'vende' && (
          <>
            <div>
              <label htmlFor="propertyType" className="block text-sm text-gray-text mb-1.5">
                Tipo de propiedad
              </label>
              <select
                id="propertyType"
                value={formData.propertyType}
                onChange={(e) => handleChange('propertyType', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy bg-white"
              >
                <option value="">Seleccionar tipo</option>
                <option value="departamento">Departamento</option>
                <option value="casa">Casa</option>
                <option value="terreno">Terreno</option>
                <option value="local-comercial">Local comercial</option>
                <option value="oficina">Oficina</option>
              </select>
            </div>
            <div>
              <label htmlFor="budget" className="block text-sm text-gray-text mb-1.5">
                Precio estimado
              </label>
              <select
                id="budget"
                value={formData.budget}
                onChange={(e) => handleChange('budget', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy bg-white"
              >
                <option value="">Seleccionar rango</option>
                <option value="0-100000">Hasta $100,000</option>
                <option value="100000-250000">$100,000 - $250,000</option>
                <option value="250000-500000">$250,000 - $500,000</option>
                <option value="500000+">Más de $500,000</option>
              </select>
            </div>
          </>
        )}

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm text-gray-text mb-1.5">
            {context === 'vende' ? 'Descripción de la propiedad' : 'Mensaje'}
            {context === 'vende' && <span className="text-red-500"> *</span>}
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            rows={4}
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors resize-none ${
              errors.message ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
            }`}
            placeholder={context === 'vende' ? 'Ubicación, área, características...' : '¿En qué podemos ayudarte?'}
          />
          {errors.message && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.message}
            </p>
          )}
        </div>

        {/* External errors (from Laravel validation) */}
        {externalErrors && Object.keys(externalErrors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            {Object.entries(externalErrors).map(([key, error]) => (
              <p key={key} className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle size={12} /> {error}
              </p>
            ))}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-2 bg-navy text-white py-3 rounded-lg text-sm font-medium hover:bg-navy-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Enviando...
            </>
          ) : (
            <>
              <Send size={15} />
              {formSubmitLabel}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
