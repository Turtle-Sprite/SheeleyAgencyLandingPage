import { useState } from "react";
import { CheckCircle2, ArrowRight, Star } from "./Icons";
import { AddressAutocomplete } from "./AddressAutocomplete";
import emailjs from '@emailjs/browser';
import profileImage from 'figma:asset/baf04cd22f350e24551cf8dfa7dd1dcb307b8a7d.png';

export function LeadForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    phone: "",
    insuranceTypes: [] as string[],
    specialConsiderations: [] as string[],
    otherConsideration: "",
    callImmediately: false,
    appointmentDate: "",
    appointmentTime: "",
    message: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    agreeToContact: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");

    // EmailJS Configuration - Using environment variables
    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
    const TEMPLATE_ID_CUSTOMER = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CUSTOMER || '';
    const TEMPLATE_ID_ADMIN = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_ADMIN || '';
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

    // Google Sheets Configuration - Using environment variables
    const GOOGLE_SHEETS_WEB_APP_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL || '';
                                      
    // Debug: Log environment variable status (remove after debugging)
    console.log('Environment Variables Status:', {
      hasServiceId: !!SERVICE_ID,
      hasCustomerTemplate: !!TEMPLATE_ID_CUSTOMER,
      hasAdminTemplate: !!TEMPLATE_ID_ADMIN,
      hasPublicKey: !!PUBLIC_KEY,
      hasSheetsUrl: !!GOOGLE_SHEETS_WEB_APP_URL
    });

    // Check if EmailJS is configured
    if (!SERVICE_ID || !TEMPLATE_ID_CUSTOMER || !TEMPLATE_ID_ADMIN || !PUBLIC_KEY) {
      setError('EmailJS is not configured yet. Please add your credentials to the .env file. See EMAILJS_SETUP.md for instructions. For now, we\'ll save your info locally.');
      console.log("Form submitted (EmailJS not configured):", formData);
      setSending(false);
      setSubmitted(true);
      return;
    }

    try {
      // Format data for emails
      const formattedData = {
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_email: formData.email,
        customer_phone: formData.phone,
        insurance_types: formData.insuranceTypes.join(', ') || 'Not specified',
        special_considerations: formData.specialConsiderations.map(item => {
          if (item === 'other' && formData.otherConsideration) {
            return `Other: ${formData.otherConsideration}`;
          }
          return item;
        }).join(', ') || 'None',
        call_immediately: formData.callImmediately ? 'Yes' : 'No',
        appointment_date: formData.appointmentDate || 'Not selected',
        appointment_time: formData.appointmentTime || 'Not selected',
        message: formData.message || 'No additional message',
        address: formData.address || 'Not provided',
        city: formData.city || 'Not provided',
        state: formData.state || 'Not provided',
        zip_code: formData.zipCode || 'Not provided',
        full_address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`.replace(/^, |, , |, $/g, '') || 'Not provided',
      };

      // Send thank you email to customer
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID_CUSTOMER,
        {
          to_email: formData.email,
          to_name: formData.firstName,
          ...formattedData,
        },
        PUBLIC_KEY
      );

      // Send lead notification to admin
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID_ADMIN,
        {
          ...formattedData,
        },
        PUBLIC_KEY
      );

      // Send data to Google Sheets
      if (GOOGLE_SHEETS_WEB_APP_URL) {
        try {
          await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              timestamp: new Date().toISOString(),
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phone: formData.phone,
              insuranceTypes: formData.insuranceTypes.join(', '),
              specialConsiderations: formData.specialConsiderations.map(item => {
                if (item === 'other' && formData.otherConsideration) {
                  return `Other: ${formData.otherConsideration}`;
                }
                return item;
              }).join(', '),
              callImmediately: formData.callImmediately ? 'Yes' : 'No',
              appointmentDate: formData.appointmentDate,
              appointmentTime: formData.appointmentTime,
              message: formData.message,
              address: formData.address,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
              fullAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`.replace(/^, |, , |, $/g, ''),
            }),
          });
          console.log('Data sent to Google Sheets successfully');
        } catch (sheetsError) {
          console.error('Failed to send to Google Sheets (non-critical):', sheetsError);
          // Don't fail the form submission if Google Sheets fails
        }
      }

      console.log("Form submitted:", formData);
      setSubmitted(true);
    } catch (err: any) {
      console.error('Failed to send email:', err);
      
      // Provide specific error messages
      let errorMessage = 'Failed to send your request. ';
      
      if (err.status === 400) {
        if (err.text && err.text.includes('Public Key')) {
          errorMessage = '❌ Invalid Public Key. Go to https://dashboard.emailjs.com/admin/account and copy your Public Key. ';
        } else if (err.text && err.text.includes('Service')) {
          errorMessage = '❌ Invalid Service ID. Check your EmailJS Service ID. ';
        } else if (err.text && err.text.includes('Template')) {
          errorMessage = '❌ Invalid Template ID. Check your EmailJS Template IDs. ';
        } else {
          errorMessage = '❌ EmailJS Error: ' + (err.text || 'Please check your EmailJS configuration. ');
        }
      }
      
      errorMessage += 'Please call us directly at 724-609-7115.';
      setError(errorMessage);
    } finally {
      setSending(false);
    }
  };

  const handleNewSubmission = () => {
    setSubmitted(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      phone: "",
      insuranceTypes: [],
      specialConsiderations: [],
      otherConsideration: "",
      callImmediately: false,
      appointmentDate: "",
      appointmentTime: "",
      message: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      agreeToContact: false,
    });
    setError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      insuranceTypes: prev.insuranceTypes.includes(value)
        ? prev.insuranceTypes.filter(type => type !== value)
        : [...prev.insuranceTypes, value]
    }));
  };

  const handleSpecialConsiderationChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      specialConsiderations: prev.specialConsiderations.includes(value)
        ? prev.specialConsiderations.filter(type => type !== value)
        : [...prev.specialConsiderations, value]
    }));
  };

  const handleAddressChange = (components: { address: string; city: string; state: string; zipCode: string }) => {
    setFormData(prev => ({
      ...prev,
      address: components.address,
      city: components.city,
      state: components.state,
      zipCode: components.zipCode
    }));
  };

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const formatDate = (year: number, month: number, day: number) => {
    const date = new Date(year, month, day);
    return date.toISOString().split('T')[0];
  };

  const handleDateSelect = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const dateString = formatDate(year, month, day);
    setFormData(prev => ({ ...prev, appointmentDate: dateString }));
    setShowCalendar(false);
  };

  const changeMonth = (offset: number) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    });
  };

  const getFormattedDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-4">
          <h2 className="text-2xl md:order-1">Deborah Sheeley Agency</h2>
          <a 
            href="tel:724-609-7115"
            className="bg-yellow-500 text-slate-900 px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors font-semibold md:order-3 flex flex-col items-center"
          >
            <span>Click to Call for A Quote</span>
            <span className="text-sm">724-609-7115</span>
          </a>
          <div className="border-2 border-yellow-500 px-6 py-3 rounded-lg md:order-2">
            <div className="text-yellow-500 font-bold">
              Call Hours: 10:00 AM - 4:30 PM
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-60 right-1/3 w-80 h-80 bg-pink-400/15 rounded-full blur-3xl"></div>
        
        {/* Geometric patterns */}
        <div className="absolute top-10 right-10 w-32 h-32 border-2 border-white/10 rotate-45 rounded-lg"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 border-2 border-cyan-300/20 rotate-12 rounded-lg"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full"></div>
        <div className="absolute top-32 left-1/3 w-20 h-20 border-2 border-purple-300/15 -rotate-12 rounded-lg"></div>
        <div className="absolute bottom-60 right-1/3 w-28 h-28 border-2 border-pink-300/15 rotate-45 rounded-lg"></div>
        <div className="absolute top-1/4 left-1/2 w-12 h-12 border border-blue-300/20 rotate-90 rounded-lg"></div>
        <div className="absolute bottom-32 right-12 w-18 h-18 border-2 border-cyan-400/15 -rotate-45 rounded-lg"></div>
        <div className="absolute top-3/4 left-16 w-14 h-14 bg-gradient-to-tr from-cyan-400/10 to-blue-400/10 rotate-12 rounded-lg"></div>
        
        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
        
        <div className="grid lg:grid-cols-[2fr_3fr] gap-12 items-start relative z-10">
          <div className="lg:pt-12 order-2 lg:order-1">
            
            {/* Profile image */}
            <img src={profileImage} alt="Deborah Sheeley" className="w-48 h-48 rounded-full mx-auto mb-6 object-cover" />

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <div className="text-lg mb-1">Talk Directly with a PA Agent</div>
                  <div className="text-slate-300">Personalized guidance and maximum savings opportunities!</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <div className="text-lg mb-1">Expert Guidance</div>
                  <div className="text-slate-300">Get Insurance You Need From People You Trust</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <div className="text-lg mb-1">No Obligation Quotes</div>
                  <div className="text-slate-300">Compare plans and prices with zero commitment.</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <div className="text-lg mb-1">Skip Call Centers</div>
                  <div className="text-slate-300">No automated systems or endless hold times.</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <div className="text-lg mb-1">Skip AI Bots</div>
                  <div className="text-slate-300">Real human experts, not chatbots or algorithms.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl mb-6 text-center">
              Get Fast &amp; Accurate Quotes
            </h1>
            
            <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-2xl">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl mb-2">Thank you!</h3>
                <p className="text-gray-600">
                  We've received your information and will be in touch within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={handleNewSubmission}
                  className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                >
                  Submit Another Quote Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} id="lead-form">
                <div className="mb-6">
                  <h2 className="text-3xl mb-2 text-center">Easy Local Auto &amp; Home Insurance Quotes</h2>
                  <p className="text-gray-600">Talk with a Pennsylvania Agent today. Finding the right insurance plan should never be a hassle. Schedule an appointment and let us guide you through tailored options that fit your needs.</p>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                        placeholder="Jane"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                        placeholder="jane@gmail.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                        placeholder="(000) 000-0000"
                        pattern="[\(]?[0-9]{3}[\)]?[\s\-]?[0-9]{3}[\s\-]?[0-9]{4}"
                      />
                    </div>
                  </div>
                  <AddressAutocomplete
                    address={formData.address}
                    city={formData.city}
                    state={formData.state}
                    zipCode={formData.zipCode}
                    onAddressChange={handleAddressChange}
                  />
                  <div>
                    <label className="block text-sm mb-3">
                      What insurance do you need?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.insuranceTypes.includes('home')}
                          onChange={() => handleCheckboxChange('home')}
                          className="appearance-none w-4 h-4 rounded border-2 border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer relative checked:after:content-['✓'] checked:after:absolute checked:after:text-white checked:after:text-xs checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2"
                        />
                        <span className="text-sm">Home</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.insuranceTypes.includes('auto')}
                          onChange={() => handleCheckboxChange('auto')}
                          className="appearance-none w-4 h-4 rounded border-2 border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer relative checked:after:content-['✓'] checked:after:absolute checked:after:text-white checked:after:text-xs checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2"
                        />
                        <span className="text-sm">Auto</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.insuranceTypes.includes('renters')}
                          onChange={() => handleCheckboxChange('renters')}
                          className="appearance-none w-4 h-4 rounded border-2 border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer relative checked:after:content-['✓'] checked:after:absolute checked:after:text-white checked:after:text-xs checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2"
                        />
                        <span className="text-sm">Renters</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.insuranceTypes.includes('motorcycle')}
                          onChange={() => handleCheckboxChange('motorcycle')}
                          className="appearance-none w-4 h-4 rounded border-2 border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer relative checked:after:content-['✓'] checked:after:absolute checked:after:text-white checked:after:text-xs checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2"
                        />
                        <span className="text-sm">Motorcycle</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.insuranceTypes.includes('boat')}
                          onChange={() => handleCheckboxChange('boat')}
                          className="appearance-none w-4 h-4 rounded border-2 border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer relative checked:after:content-['✓'] checked:after:absolute checked:after:text-white checked:after:text-xs checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2"
                        />
                        <span className="text-sm">Boat</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.insuranceTypes.includes('off-road')}
                          onChange={() => handleCheckboxChange('off-road')}
                          className="appearance-none w-4 h-4 rounded border-2 border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer relative checked:after:content-['✓'] checked:after:absolute checked:after:text-white checked:after:text-xs checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2"
                        />
                        <span className="text-sm">Off-road</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-3">
                      Any special considerations?
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.specialConsiderations.includes('teen-driver')}
                          onChange={() => handleSpecialConsiderationChange('teen-driver')}
                          className="appearance-none w-4 h-4 rounded border-2 border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer relative checked:after:content-['✓'] checked:after:absolute checked:after:text-white checked:after:text-xs checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2"
                        />
                        <span className="text-sm">Teen driver</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.specialConsiderations.includes('multiple-vehicles')}
                          onChange={() => handleSpecialConsiderationChange('multiple-vehicles')}
                          className="appearance-none w-4 h-4 rounded border-2 border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer relative checked:after:content-['✓'] checked:after:absolute checked:after:text-white checked:after:text-xs checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2"
                        />
                        <span className="text-sm">Multiple vehicles</span>
                      </label>
                      <div>
                        <label className="flex items-center gap-2 cursor-pointer mb-2">
                          <input
                            type="checkbox"
                            checked={formData.specialConsiderations.includes('other')}
                            onChange={() => handleSpecialConsiderationChange('other')}
                            className="appearance-none w-4 h-4 rounded border-2 border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer relative checked:after:content-['✓'] checked:after:absolute checked:after:text-white checked:after:text-xs checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2"
                          />
                          <span className="text-sm">Other</span>
                        </label>
                        {formData.specialConsiderations.includes('other') && (
                          <input
                            type="text"
                            name="otherConsideration"
                            value={formData.otherConsideration}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                            placeholder="Please specify..."
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm mb-2">
                    Select the best time for us to call back
                  </div>
                  <div className="mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="callImmediately"
                        checked={formData.callImmediately}
                        onChange={(e) => setFormData(prev => ({ ...prev, callImmediately: e.target.checked }))}
                        className="appearance-none w-4 h-4 rounded border-2 border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer relative checked:after:content-['✓'] checked:after:absolute checked:after:text-white checked:after:text-xs checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2"
                      />
                      <span className="text-sm">Call immediately</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="appointmentDate" className="block text-sm mb-2">
                        Appointment Date
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="appointmentDate"
                          name="appointmentDate"
                          value={formData.appointmentDate ? getFormattedDate(formData.appointmentDate) : ''}
                          onClick={() => setShowCalendar(!showCalendar)}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none cursor-pointer"
                          placeholder="Select a date"
                        />
                        {showCalendar && (
                          <div className="absolute top-full left-0 mt-2 bg-white border-2 border-slate-900 rounded-lg shadow-xl z-50 p-4 w-80">
                            {/* Calendar Header */}
                            <div className="flex items-center justify-between mb-4">
                              <button
                                type="button"
                                onClick={() => changeMonth(-1)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                ‹
                              </button>
                              <div className="font-semibold">
                                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                              </div>
                              <button
                                type="button"
                                onClick={() => changeMonth(1)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                ›
                              </button>
                            </div>
                            
                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-1 mb-2">
                              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="text-center text-xs text-gray-500 py-2">
                                  {day}
                                </div>
                              ))}
                            </div>
                            
                            <div className="grid grid-cols-7 gap-1">
                              {(() => {
                                const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
                                const days = [];
                                const today = new Date();
                                const year = currentMonth.getFullYear();
                                const month = currentMonth.getMonth();
                                
                                // Empty cells before first day
                                for (let i = 0; i < startingDayOfWeek; i++) {
                                  days.push(<div key={`empty-${i}`} className="p-2"></div>);
                                }
                                
                                // Days of the month
                                for (let day = 1; day <= daysInMonth; day++) {
                                  const dateString = formatDate(year, month, day);
                                  const isSelected = formData.appointmentDate === dateString;
                                  const isPast = new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                                  const dayOfWeek = new Date(year, month, day).getDay();
                                  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                                  const isDisabled = isPast || isWeekend;
                                  
                                  days.push(
                                    <button
                                      key={day}
                                      type="button"
                                      onClick={() => !isDisabled && handleDateSelect(day)}
                                      disabled={isDisabled}
                                      className={`p-2 text-sm rounded-lg transition-colors ${
                                        isSelected 
                                          ? 'bg-slate-900 text-white' 
                                          : isDisabled
                                          ? 'text-gray-300 cursor-not-allowed'
                                          : 'hover:bg-slate-100'
                                      }`}
                                    >
                                      {day}
                                    </button>
                                  );
                                }
                                
                                return days;
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="appointmentTime" className="block text-sm mb-2">
                        Appointment Time
                      </label>
                      <select
                        id="appointmentTime"
                        name="appointmentTime"
                        value={formData.appointmentTime}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                      >
                        <option value="">Select a time</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none resize-none"
                      placeholder="Tell us about your insurance needs..."
                    />
                  </div>
                  <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreeToContact"
                        checked={formData.agreeToContact}
                        onChange={(e) => setFormData(prev => ({ ...prev, agreeToContact: e.target.checked }))}
                        required
                        className="appearance-none w-5 h-5 mt-0.5 rounded border-2 border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer relative checked:after:content-['✓'] checked:after:absolute checked:after:text-white checked:after:text-xs checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 flex-shrink-0"
                      />
                      <span className="text-sm text-gray-700">
                        I agree to receive emails and phone calls from Deborah Sheeley Agency regarding my insurance quote and related services. *
                      </span>
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-yellow-500 text-slate-900 py-4 rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? 'Sending...' : 'Send Your Quote Request'}
                    <ArrowRight className="h-5 w-5" />
                  </button>
                  {error && <p className="text-xs text-red-500 text-center mt-2">{error}</p>}
                  <p className="text-xs text-gray-500 text-center">
                    By submitting this form, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </form>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}