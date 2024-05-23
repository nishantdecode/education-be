// utils/generateInvoice.js
const jsPDF = require('jspdf');
require('jspdf-invoice-template');

function generateInvoice(order) {
  const { userId, slotId, amount, currency, razorpay_order_id, status } = order;

  const doc = new jsPDF();

  const props = {
    outputType: 'blob',
    returnJsPDFDocObject: true,
    fileName: `Invoice_${order.id}`,
    orientationLandscape: false,
    compress: true,
    logo: {
      src: 'https://your-logo-url.com/logo.png',
      width: 53.33, // Aspect ratio = width/height
      height: 26.66,
      margin: {
        top: 0, // In units declared above
        left: 0, // Same as above
      },
    },
    business: {
      name: 'Your Company Name',
      address: 'Company Address',
      phone: '(123) 456-7890',
      email: 'company@example.com',
      website: 'www.example.com',
    },
    contact: {
      label: 'Invoice issued for:',
      name: `User ID: ${userId}`,
      address: `Slot ID: ${slotId}`,
      phone: 'Contact Number',
      email: 'user@example.com',
    },
    invoice: {
      label: 'Invoice #: ',
      num: razorpay_order_id,
      invDate: `Payment Status: ${status}`,
      invGenDate: `Generated on: ${new Date().toLocaleDateString()}`,
      headerBorder: false,
      tableBodyBorder: false,
      header: [
        {
          title: '#',
          style: { width: 10 },
        },
        {
          title: 'Description',
          style: { width: 30 },
        },
        {
          title: 'Price',
          style: { width: 15 },
        },
        {
          title: 'Quantity',
          style: { width: 10 },
        },
        {
          title: 'Total',
          style: { width: 15 },
        },
      ],
      table: [
        [1, 'Booking Slot', amount, 1, amount],
      ],
      additionalRows: [{
        col1: 'Total:',
        col2: `${amount} ${currency}`,
        col3: 'ALL',
        style: { fontSize: 14 }, // Style to be applied
      }],
      invDescLabel: 'Invoice Note',
      invDesc: 'Thank you for your business.',
    },
    footer: {
      text: 'This is a system-generated invoice.',
    },
    pageEnable: true,
    pageLabel: 'Page ',
  };

  jsPDFInvoiceTemplate(props);
  return doc;
}

module.exports = generateInvoice;
