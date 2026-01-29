// EmailJS stillingar
// Til að nota þetta þarftu að:
// 1. Búa til aðgang á https://www.emailjs.com/
// 2. Búa til Email Service (Gmail, Outlook, etc.)
// 3. Búa til Email Template með breytum: to_email, to_name, subject, message
// 4. Setja inn rétt gildi hér að neðan

export const EMAIL_CONFIG = {
  serviceId: 'YOUR_SERVICE_ID',      // Frá EmailJS dashboard
  templateId: 'YOUR_TEMPLATE_ID',    // Frá EmailJS dashboard
  publicKey: 'YOUR_PUBLIC_KEY',      // Frá EmailJS dashboard -> Account -> API Keys

  // Sett á true þegar stillingar eru tilbúnar
  isConfigured: false,
}

// Template variables sem þarf að nota í EmailJS template:
// {{to_email}} - Netfang móttakanda
// {{to_name}} - Nafn móttakanda
// {{subject}} - Efni pósts
// {{message}} - Texti pósts
// {{from_name}} - Nafn sendanda (sveitarfélag)
