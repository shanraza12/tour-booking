import jsPDF from 'jspdf';
import QRCode from 'qrcode';

/**
 * Generates a SkyLiners-branded PDF ticket.
 * @param {Object} booking - Booking data object
 * @param {string} booking.ticketNumber
 * @param {string} booking.tourName
 * @param {string} booking.fullName
 * @param {string} booking.phone
 * @param {string} booking.bookAt
 * @param {number} booking.groupSize
 * @param {number} booking.totalPaid
 * @param {string} booking.userEmail
 */
export const generateTicketPDF = async (booking) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });

  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  // ── Brand colors ──────────────────────────────────────────────
  const NAVY   = [26,  43, 109];   // #1a2b6d
  const ORANGE = [245, 166,  35];  // #f5a623
  const WHITE  = [255, 255, 255];
  const LIGHT  = [245, 247, 252];
  const GREY   = [120, 130, 150];

  // ── Header band ───────────────────────────────────────────────
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, W, 38, 'F');

  // Company name
  doc.setTextColor(...ORANGE);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('SkyLiners', 10, 16);

  doc.setTextColor(...WHITE);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('TOURS & ADVENTURES', 10, 22);

  // Pakistan flag emoji substitute — just label
  doc.setFontSize(7);
  doc.setTextColor(...ORANGE);
  doc.text('🇵🇰  Pakistan\'s Premier Travel Experience', 10, 28);

  // BOARDING PASS label top-right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...WHITE);
  doc.text('BOOKING TICKET', W - 10, 16, { align: 'right' });
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('Keep this for your records', W - 10, 22, { align: 'right' });

  // ── Ticket number band ────────────────────────────────────────
  doc.setFillColor(...ORANGE);
  doc.rect(0, 38, W, 10, 'F');
  doc.setTextColor(...NAVY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`Ticket #: ${booking.ticketNumber || 'SKY-XXXXXXXX'}`, W / 2, 45, { align: 'center' });

  // ── Info card background ──────────────────────────────────────
  doc.setFillColor(...LIGHT);
  doc.roundedRect(8, 52, W - 16, 80, 3, 3, 'F');

  // Field helper
  const field = (label, value, x, y) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...GREY);
    doc.text(label.toUpperCase(), x, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    doc.text(String(value || '—'), x, y + 6);
  };

  const col1 = 14;
  const col2 = W / 2 + 4;
  field('Tour Name',    booking.tourName,   col1, 62);
  field('Traveller',    booking.fullName,   col2, 62);
  field('Email',        booking.userEmail,  col1, 80);
  field('Phone',        booking.phone,      col2, 80);
  field('Travel Date',  new Date(booking.bookAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' }), col1, 98);
  field('Group Size',   `${booking.groupSize} Person(s)`, col2, 98);
  field('Total Paid',   `PKR ${Number(booking.totalPaid || 0).toLocaleString('en-PK')}`, col1, 116);
  field('Status',       'CONFIRMED ✓',      col2, 116);

  // ── Divider ───────────────────────────────────────────────────
  doc.setDrawColor(...ORANGE);
  doc.setLineWidth(0.5);
  doc.line(8, 136, W - 8, 136);

  // ── QR Code ───────────────────────────────────────────────────
  const qrText = `SKYLINERS|${booking.ticketNumber}|${booking.tourName}|${booking.fullName}`;
  try {
    const qrDataUrl = await QRCode.toDataURL(qrText, { width: 80, margin: 1 });
    doc.addImage(qrDataUrl, 'PNG', W/2 - 15, 140, 30, 30);
  } catch (_) { /* skip if QR fails */ }

  // Scan label
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...GREY);
  doc.text('Scan to verify booking', W / 2, 173, { align: 'center' });

  // ── Footer ────────────────────────────────────────────────────
  doc.setFillColor(...NAVY);
  doc.rect(0, H - 16, W, 16, 'F');
  doc.setTextColor(...WHITE);
  doc.setFontSize(7);
  doc.text('SkyLiners Tours & Adventures | Pakistan  |  skyliners.pk', W / 2, H - 8, { align: 'center' });
  doc.setTextColor(...ORANGE);
  doc.setFontSize(6);
  doc.text('For support: support@skyliners.pk  |  +92-300-0000000', W / 2, H - 3, { align: 'center' });

  // ── Save ──────────────────────────────────────────────────────
  doc.save(`SkyLiners-Ticket-${booking.ticketNumber || 'booking'}.pdf`);
};
