import * as MailComposer from "expo-mail-composer";
import { Service, ServiceStatus, STATUS_LABELS, Customer, Device, DEVICE_TYPE_LABELS } from "./types";

export async function checkEmailAvailability(): Promise<boolean> {
  return await MailComposer.isAvailableAsync();
}

export async function sendServiceStatusEmail(
  customer: Customer,
  device: Device,
  service: Service
): Promise<MailComposer.MailComposerResult> {
  const statusText = STATUS_LABELS[service.status];
  const deviceTypeText = DEVICE_TYPE_LABELS[device.type];
  
  const subject = `FST Servis - Status servisa: ${statusText}`;
  
  let body = `Poštovani/a ${customer.name},\n\n`;
  body += `Obaveštavamo Vas o statusu servisa Vašeg uređaja.\n\n`;
  body += `DETALJI SERVISA\n`;
  body += `─────────────────────────────\n`;
  body += `Uređaj: ${device.brand} ${device.model}\n`;
  body += `Tip: ${deviceTypeText}\n`;
  body += `Serijski broj: ${device.serialNumber || "N/A"}\n`;
  body += `Status: ${statusText}\n`;
  body += `Datum prijave: ${service.createdAt}\n\n`;
  
  body += `OPIS PROBLEMA\n`;
  body += `─────────────────────────────\n`;
  body += `${service.description}\n\n`;
  
  if (service.diagnosis) {
    body += `DIJAGNOZA\n`;
    body += `─────────────────────────────\n`;
    body += `${service.diagnosis}\n\n`;
  }
  
  if (service.solution) {
    body += `REŠENJE\n`;
    body += `─────────────────────────────\n`;
    body += `${service.solution}\n\n`;
  }
  
  if (service.cost) {
    body += `CENA SERVISA\n`;
    body += `─────────────────────────────\n`;
    body += `${service.cost} EUR\n\n`;
  }
  
  if (service.completedDate) {
    body += `Datum završetka: ${service.completedDate}\n\n`;
  }
  
  body += `─────────────────────────────\n`;
  body += `S poštovanjem,\n`;
  body += `FST Servis\n`;
  body += `Vaš partner za belu tehniku`;

  return await MailComposer.composeAsync({
    recipients: customer.email ? [customer.email] : [],
    subject,
    body,
    isHtml: false,
  });
}

export async function sendServiceCompletedEmail(
  customer: Customer,
  device: Device,
  service: Service
): Promise<MailComposer.MailComposerResult> {
  const deviceTypeText = DEVICE_TYPE_LABELS[device.type];
  
  const subject = `FST Servis - Servis uspešno završen`;
  
  let body = `Poštovani/a ${customer.name},\n\n`;
  body += `Sa zadovoljstvom Vas obaveštavamo da je servis Vašeg uređaja uspešno završen!\n\n`;
  body += `DETALJI SERVISA\n`;
  body += `─────────────────────────────\n`;
  body += `Uređaj: ${device.brand} ${device.model}\n`;
  body += `Tip: ${deviceTypeText}\n`;
  body += `Serijski broj: ${device.serialNumber || "N/A"}\n\n`;
  
  body += `OPIS PROBLEMA\n`;
  body += `─────────────────────────────\n`;
  body += `${service.description}\n\n`;
  
  if (service.diagnosis) {
    body += `DIJAGNOZA\n`;
    body += `─────────────────────────────\n`;
    body += `${service.diagnosis}\n\n`;
  }
  
  if (service.solution) {
    body += `REŠENJE\n`;
    body += `─────────────────────────────\n`;
    body += `${service.solution}\n\n`;
  }
  
  if (service.cost) {
    body += `UKUPNA CENA\n`;
    body += `─────────────────────────────\n`;
    body += `${service.cost} EUR\n\n`;
  }
  
  body += `Datum završetka: ${service.completedDate || new Date().toISOString().split('T')[0]}\n\n`;
  
  body += `Molimo Vas da nas kontaktirate za preuzimanje uređaja.\n\n`;
  body += `─────────────────────────────\n`;
  body += `Hvala Vam na poverenju!\n`;
  body += `S poštovanjem,\n`;
  body += `FST Servis`;

  return await MailComposer.composeAsync({
    recipients: customer.email ? [customer.email] : [],
    subject,
    body,
    isHtml: false,
  });
}

export async function sendMaintenanceReminderEmail(
  customer: Customer,
  device: Device,
  scheduledDate: string
): Promise<MailComposer.MailComposerResult> {
  const deviceTypeText = DEVICE_TYPE_LABELS[device.type];
  
  const subject = `FST Servis - Podsetnik za održavanje`;
  
  let body = `Poštovani/a ${customer.name},\n\n`;
  body += `Podećamo Vas da je zakazano redovno održavanje Vašeg uređaja.\n\n`;
  body += `DETALJI\n`;
  body += `─────────────────────────────\n`;
  body += `Uređaj: ${device.brand} ${device.model}\n`;
  body += `Tip: ${deviceTypeText}\n`;
  body += `Zakazani datum: ${scheduledDate}\n\n`;
  body += `Molimo Vas da potvrdite termin ili nas kontaktirate za zakazivanje novog termina.\n\n`;
  body += `─────────────────────────────\n`;
  body += `S poštovanjem,\n`;
  body += `FST Servis`;

  return await MailComposer.composeAsync({
    recipients: customer.email ? [customer.email] : [],
    subject,
    body,
    isHtml: false,
  });
}
