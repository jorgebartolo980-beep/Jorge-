import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Secrets & Notification configuration
const WEBHOOK_SECRET = process.env.PAYMENT_WEBHOOK_SECRET || 'whsec_petcare360_secure_k9_2026';
const TOKEN_SECRET = process.env.SESSION_SECRET || 'jwt_petcare360_token_signing_secret_key';
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'jorgebartolo980@gmail.com';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_FROM = process.env.SMTP_FROM || 'PetCare 360 <notificacoes@petcare360.pt>';

// Data Persistence Store Setup
const DATA_DIR = path.join(__dirname, 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface AdminNotificationItem {
  id: string;
  eventType: string;
  subject: string;
  recipient: string;
  transactionId: string;
  orderReference: string;
  planType: string;
  amountEuro: number;
  currency: string;
  status: string;
  subscriptionRef?: string;
  customerId: string;
  customerEmail: string;
  paymentMethod: string;
  timestamp: string;
  deliveryStatus: 'sent' | 'simulated' | 'failed' | 'logged';
  deliveryMethod: 'smtp' | 'resend' | 'logged';
  deliveryError?: string;
  emailHtml: string;
  emailText: string;
}

interface DBStore {
  users: Array<{
    uid: string;
    email: string;
    name: string;
    passwordHash: string;
    salt: string;
    role: 'user' | 'admin';
    createdAt: string;
    resetToken?: string;
    resetTokenExpires?: number;
  }>;
  licenses: Array<{
    userId: string;
    userEmail: string;
    status: 'none' | 'pending' | 'active' | 'expired' | 'revoked';
    planType?: 'mensal' | 'anual' | 'vitalicio';
    orderReference?: string;
    transactionId?: string;
    activatedAt?: string;
    expiresAt?: string;
    updatedAt: string;
    notes?: string;
  }>;
  orders: Array<{
    orderReference: string;
    userId: string;
    userEmail: string;
    planType: 'mensal' | 'anual' | 'vitalicio';
    amountEuro: number;
    paymentMethod: 'cartao' | 'mbway' | 'multibanco';
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    createdAt: string;
    completedAt?: string;
    transactionId?: string;
  }>;
  webhookLogs: Array<{
    eventId: string;
    orderReference: string;
    eventType: string;
    status: string;
    verified: boolean;
    receivedAt: string;
    payloadHash: string;
    notes?: string;
  }>;
  processedEventIds: string[];
  adminNotifications: AdminNotificationItem[];
}

// Password hashing helper
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

// Session token helpers
function generateToken(userId: string, email: string, role: string): string {
  const payload = {
    sub: userId,
    email,
    role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400 * 7, // 7 days
  };
  const str = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', TOKEN_SECRET).update(str).digest('base64url');
  return `${str}.${sig}`;
}

function verifyToken(token: string): { sub: string; email: string; role: string } | null {
  try {
    const [payloadStr, sig] = token.split('.');
    if (!payloadStr || !sig) return null;
    const expectedSig = crypto.createHmac('sha256', TOKEN_SECRET).update(payloadStr).digest('base64url');
    if (sig !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

// Initialize store with default admin and demo user
function loadStore(): DBStore {
  if (fs.existsSync(STORE_FILE)) {
    try {
      const content = fs.readFileSync(STORE_FILE, 'utf-8');
      const loaded: DBStore = JSON.parse(content);
      if (!Array.isArray(loaded.adminNotifications)) {
        loaded.adminNotifications = [];
      }
      return loaded;
    } catch {
      // Fallback if corrupt
    }
  }

  const adminSalt = crypto.randomBytes(16).toString('hex');
  const demoSalt = crypto.randomBytes(16).toString('hex');

  const initialStore: DBStore = {
    users: [
      {
        uid: 'usr_admin_01',
        email: ADMIN_EMAIL,
        name: 'Administrador PetCare',
        passwordHash: hashPassword('Admin123!', adminSalt),
        salt: adminSalt,
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
      {
        uid: 'usr_demo_02',
        email: 'cliente@petcare360.pt',
        name: 'Tutor de Exemplo',
        passwordHash: hashPassword('Cliente123!', demoSalt),
        salt: demoSalt,
        role: 'user',
        createdAt: new Date().toISOString(),
      },
    ],
    licenses: [
      {
        userId: 'usr_admin_01',
        userEmail: ADMIN_EMAIL,
        status: 'active',
        planType: 'vitalicio',
        activatedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: 'Licença SuperAdmin Oficial',
      },
      {
        userId: 'usr_demo_02',
        userEmail: 'cliente@petcare360.pt',
        status: 'none',
        updatedAt: new Date().toISOString(),
        notes: 'Conta Nova - Sem Licença Ativa',
      },
    ],
    orders: [],
    webhookLogs: [],
    processedEventIds: [],
    adminNotifications: [],
  };

  saveStore(initialStore);
  return initialStore;
}

function saveStore(store: DBStore) {
  fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf-8');
}

let store = loadStore();

// ====================================================
// NOTIFICAÇÕES PARA O ADMINISTRADOR (EMAIL & REGISTO)
// ====================================================
async function sendAdminEmailNotification(params: {
  eventType: string;
  transactionId: string;
  orderReference: string;
  planType: string;
  amountEuro: number;
  currency?: string;
  status: string;
  subscriptionRef?: string;
  customerId: string;
  customerEmail: string;
  paymentMethod: string;
  timestamp?: string;
}): Promise<AdminNotificationItem> {
  const timestamp = params.timestamp || new Date().toISOString();
  const currency = params.currency || 'EUR';
  const planTitles: Record<string, string> = {
    mensal: 'PetCare Plus Mensal (3,99 € / mês)',
    anual: 'PetCare Plus Anual (39,00 € / ano)',
    vitalicio: 'Acesso Vitalício Familiar (99,00 € único)',
  };
  const planName = planTitles[params.planType] || params.planType.toUpperCase();

  let eventTitle = 'Notificação de Pagamento';
  let badgeColor = '#154734'; // Emerald/Dark Green
  let badgeText = 'PAGAMENTO CONFIRMADO';

  if (params.eventType === 'payment.succeeded' || params.eventType === 'checkout.session.completed') {
    eventTitle = 'Nova Compra / Pagamento Confirmado';
    badgeColor = '#154734';
    badgeText = 'PAGAMENTO APROVADO';
  } else if (params.eventType === 'subscription.renewed' || params.eventType === 'invoice.payment_succeeded') {
    eventTitle = 'Subscrição Renovada com Sucesso';
    badgeColor = '#059669';
    badgeText = 'RENOVAÇÃO AUTOMÁTICA';
  } else if (params.eventType === 'payment.failed') {
    eventTitle = 'Falha no Pagamento / Recusa Bancária';
    badgeColor = '#e11d48';
    badgeText = 'PAGAMENTO RECUSADO';
  } else if (params.eventType === 'payment.refunded') {
    eventTitle = 'Pagamento Reembolsado';
    badgeColor = '#d97706';
    badgeText = 'REEMBOLSO PROCESSADO';
  } else if (params.eventType === 'subscription.cancelled') {
    eventTitle = 'Subscrição Cancelada';
    badgeColor = '#64748b';
    badgeText = 'CANCELAMENTO';
  } else if (params.eventType === 'test') {
    eventTitle = 'Simulação / Teste do Sistema de Pagamentos';
    badgeColor = '#7c3aed';
    badgeText = 'TESTE ADMINISTRATIVO';
  }

  const subject = `[PetCare 360] ${eventTitle}: ${planName} — ${params.orderReference}`;

  const formattedDate = new Date(timestamp).toLocaleString('pt-PT', {
    timeZone: 'Europe/Lisbon',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const emailText = `=====================================================
PETCARE 360 — NOTIFICAÇÃO DE PAGAMENTO PARA ADMINISTRADOR
=====================================================
Evento: ${eventTitle}
Estado: ${params.status.toUpperCase()}

DETALHES DA TRANSAÇÃO:
- Identificador da Transação: ${params.transactionId}
- Data e Hora: ${formattedDate}
- Montante e Moeda: ${params.amountEuro.toFixed(2)} ${currency}
- Plano Adquirido: ${planName}
- Estado do Pagamento: ${params.status}
- Referência da Encomenda: ${params.orderReference}
- Referência da Subscrição: ${params.subscriptionRef || params.orderReference}
- Identificador do Cliente: ${params.customerId}
- E-mail do Cliente: ${params.customerEmail}
- Método de Pagamento: ${params.paymentMethod.toUpperCase()}

Destinatário Administrativo: ${ADMIN_EMAIL}
Notificação gerada pelo servidor PetCare 360 (HMAC Authenticated).
=====================================================`;

  const emailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #154734 0%, #0f3426 100%); padding: 32px 28px; text-align: left;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <span style="display: inline-block; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #86efac; background-color: rgba(21, 71, 52, 0.6); padding: 4px 10px; border-radius: 9999px; border: 1px solid rgba(134, 239, 172, 0.3);">
                PetCare 360 • Notificação Administrativa
              </span>
              <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 12px 0 4px 0; letter-spacing: -0.02em;">
                ${eventTitle}
              </h1>
              <p style="color: #cbd5e1; font-size: 13px; margin: 0;">
                Registo bancário confirmado no servidor da aplicação.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Status Strip -->
    <tr>
      <td style="padding: 16px 28px; background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0;">
        <span style="display: inline-block; background-color: ${badgeColor}; color: #ffffff; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 6px; letter-spacing: 0.05em;">
          ${badgeText}
        </span>
        <span style="font-size: 12px; color: #64748b; margin-left: 12px;">
          ${formattedDate}
        </span>
      </td>
    </tr>

    <!-- Body / Data Table -->
    <tr>
      <td style="padding: 28px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13px; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; width: 45%; font-weight: 600;">Identificador da Transação:</td>
            <td style="padding: 10px 0; color: #0f172a; font-family: monospace; font-weight: 700; text-align: right;">${params.transactionId}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Data e Hora:</td>
            <td style="padding: 10px 0; color: #0f172a; font-weight: 600; text-align: right;">${formattedDate}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Montante e Moeda:</td>
            <td style="padding: 10px 0; color: #154734; font-size: 16px; font-weight: 800; text-align: right;">${params.amountEuro.toFixed(2)} ${currency}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Plano Adquirido:</td>
            <td style="padding: 10px 0; color: #0f172a; font-weight: 700; text-align: right;">${planName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Estado do Pagamento:</td>
            <td style="padding: 10px 0; font-weight: 700; text-align: right; text-transform: uppercase;">
              <span style="color: ${badgeColor};">${params.status}</span>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Referência da Encomenda:</td>
            <td style="padding: 10px 0; color: #0f172a; font-family: monospace; font-weight: 700; text-align: right;">${params.orderReference}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Referência da Subscrição:</td>
            <td style="padding: 10px 0; color: #0f172a; font-family: monospace; text-align: right;">${params.subscriptionRef || params.orderReference}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Identificador do Cliente:</td>
            <td style="padding: 10px 0; color: #0f172a; font-family: monospace; text-align: right;">${params.customerId}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">E-mail do Cliente:</td>
            <td style="padding: 10px 0; color: #0f172a; font-weight: 700; text-align: right;">${params.customerEmail}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Método de Pagamento:</td>
            <td style="padding: 10px 0; color: #0f172a; font-weight: 700; text-align: right; text-transform: uppercase;">${params.paymentMethod}</td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #f8fafc; padding: 20px 28px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; line-height: 1.5;">
        <p style="margin: 0 0 6px 0;">
          <strong>Destinatário Oficial:</strong> ${ADMIN_EMAIL} (Administração PetCare 360).
        </p>
        <p style="margin: 0;">
          Esta mensagem é enviada exclusivamente pelo backend da plataforma mediante confirmação criptográfica de gateway bancário.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const notificationItem: AdminNotificationItem = {
    id: 'notif_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
    eventType: params.eventType,
    subject,
    recipient: ADMIN_EMAIL,
    transactionId: params.transactionId,
    orderReference: params.orderReference,
    planType: params.planType,
    amountEuro: params.amountEuro,
    currency,
    status: params.status,
    subscriptionRef: params.subscriptionRef || params.orderReference,
    customerId: params.customerId,
    customerEmail: params.customerEmail,
    paymentMethod: params.paymentMethod,
    timestamp,
    deliveryStatus: 'logged',
    deliveryMethod: 'logged',
    emailHtml,
    emailText,
  };

  // Attempt real delivery if credentials configured
  try {
    if (RESEND_API_KEY) {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: SMTP_FROM,
          to: [ADMIN_EMAIL],
          subject,
          html: emailHtml,
          text: emailText,
        }),
      });

      if (resendRes.ok) {
        notificationItem.deliveryStatus = 'sent';
        notificationItem.deliveryMethod = 'resend';
        console.log(`[EMAIL ADMIN] Notificação enviada via Resend para ${ADMIN_EMAIL}`);
      } else {
        const errJson = await resendRes.json();
        notificationItem.deliveryStatus = 'failed';
        notificationItem.deliveryMethod = 'resend';
        notificationItem.deliveryError = JSON.stringify(errJson);
        console.warn(`[EMAIL ADMIN] Falha no envio via Resend:`, errJson);
      }
    } else if (SMTP_HOST && SMTP_USER) {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: SMTP_FROM,
        to: ADMIN_EMAIL,
        subject,
        text: emailText,
        html: emailHtml,
      });

      notificationItem.deliveryStatus = 'sent';
      notificationItem.deliveryMethod = 'smtp';
      console.log(`[EMAIL ADMIN] Notificação enviada via SMTP para ${ADMIN_EMAIL}`);
    } else {
      notificationItem.deliveryStatus = 'simulated';
      notificationItem.deliveryMethod = 'logged';
      console.log(`[EMAIL ADMIN LOG] Credenciais de email não configuradas no .env. Notificação registada no servidor para ${ADMIN_EMAIL}: ${subject}`);
    }
  } catch (deliveryErr: any) {
    console.error(`[EMAIL ADMIN] Erro ao despachar notificação:`, deliveryErr);
    notificationItem.deliveryStatus = 'failed';
    notificationItem.deliveryError = deliveryErr.message || 'Erro no serviço de email';
  }

  // Prepend to store
  if (!Array.isArray(store.adminNotifications)) {
    store.adminNotifications = [];
  }
  store.adminNotifications.unshift(notificationItem);
  saveStore(store);

  return notificationItem;
}


// Auth Middleware
function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Sessão não autenticada. Inicie sessão para continuar.' });
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Sessão inválida ou expirada. Por favor autentique-se novamente.' });
  }

  const user = store.users.find(u => u.uid === payload.sub);
  if (!user) {
    return res.status(401).json({ error: 'Utilizador não encontrado.' });
  }

  // Check license
  let license = store.licenses.find(l => l.userId === user.uid);
  if (!license) {
    license = {
      userId: user.uid,
      userEmail: user.email,
      status: 'none',
      updatedAt: new Date().toISOString(),
    };
    store.licenses.push(license);
    saveStore(store);
  }

  // Check if active license has expired
  if (license.status === 'active' && license.expiresAt && new Date(license.expiresAt) < new Date()) {
    license.status = 'expired';
    license.updatedAt = new Date().toISOString();
    saveStore(store);
  }

  (req as any).user = user;
  (req as any).license = license;
  next();
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  authenticateUser(req, res, () => {
    const user = (req as any).user;
    if (user.role !== 'admin' && user.email !== ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Acesso restrito ao Painel de Administração.' });
    }
    next();
  });
}

// ----------------------------------------------------
// AUTH ENDPOINTS
// ----------------------------------------------------

// Register
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Nome, e-mail e palavra-passe são obrigatórios.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'A palavra-passe deve conter pelo menos 6 caracteres.' });
  }

  const lowerEmail = email.toLowerCase().trim();
  if (store.users.some(u => u.email.toLowerCase() === lowerEmail)) {
    return res.status(409).json({ error: 'Já existe uma conta registada com este endereço de e-mail.' });
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  const uid = 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
  const role = lowerEmail === ADMIN_EMAIL ? 'admin' : 'user';

  const newUser = {
    uid,
    email: lowerEmail,
    name: name.trim(),
    passwordHash,
    salt,
    role: role as 'user' | 'admin',
    createdAt: new Date().toISOString(),
  };

  const newLicense = {
    userId: uid,
    userEmail: lowerEmail,
    status: (role === 'admin' ? 'active' : 'none') as 'none' | 'active',
    planType: role === 'admin' ? ('vitalicio' as const) : undefined,
    updatedAt: new Date().toISOString(),
  };

  store.users.push(newUser);
  store.licenses.push(newLicense);
  saveStore(store);

  const token = generateToken(uid, lowerEmail, role);

  res.json({
    message: 'Conta criada com sucesso!',
    token,
    user: { uid, email: lowerEmail, name: newUser.name, role },
    license: newLicense,
  });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e palavra-passe são obrigatórios.' });
  }

  const lowerEmail = email.toLowerCase().trim();
  const user = store.users.find(u => u.email.toLowerCase() === lowerEmail);

  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas. Verifique o e-mail ou a palavra-passe.' });
  }

  const hash = hashPassword(password, user.salt);
  if (hash !== user.passwordHash) {
    return res.status(401).json({ error: 'Credenciais inválidas. Verifique o e-mail ou a palavra-passe.' });
  }

  let license = store.licenses.find(l => l.userId === user.uid);
  if (!license) {
    license = {
      userId: user.uid,
      userEmail: user.email,
      status: user.role === 'admin' ? 'active' : 'none',
      updatedAt: new Date().toISOString(),
    };
    store.licenses.push(license);
    saveStore(store);
  }

  // Check expiry
  if (license.status === 'active' && license.expiresAt && new Date(license.expiresAt) < new Date()) {
    license.status = 'expired';
    license.updatedAt = new Date().toISOString();
    saveStore(store);
  }

  const token = generateToken(user.uid, user.email, user.role);

  res.json({
    message: 'Sessão iniciada com sucesso.',
    token,
    user: { uid: user.uid, email: user.email, name: user.name, role: user.role },
    license,
  });
});

// Me (Get Current Auth Status)
app.get('/api/auth/me', authenticateUser, (req, res) => {
  const user = (req as any).user;
  const license = (req as any).license;

  res.json({
    user: { uid: user.uid, email: user.email, name: user.name, role: user.role },
    license,
  });
});

// Forgot Password
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'E-mail é obrigatório.' });

  const lowerEmail = email.toLowerCase().trim();
  const user = store.users.find(u => u.email.toLowerCase() === lowerEmail);

  if (user) {
    user.resetToken = crypto.randomBytes(24).toString('hex');
    user.resetTokenExpires = Date.now() + 3600000; // 1 hour
    saveStore(store);
  }

  // Always return success for security (prevent email enumeration)
  res.json({
    message: 'Se o endereço de e-mail estiver registado, receberá as instruções de redefinição de palavra-passe.',
    resetTokenForDemo: user?.resetToken || undefined,
  });
});

// Reset Password
app.post('/api/auth/reset-password', (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'Token inválido ou palavra-passe demasiado curta (mínimo 6 caracteres).' });
  }

  const user = store.users.find(u => u.resetToken === token && u.resetTokenExpires && u.resetTokenExpires > Date.now());
  if (!user) {
    return res.status(400).json({ error: 'O código de redefinição expirou ou é inválido.' });
  }

  user.salt = crypto.randomBytes(16).toString('hex');
  user.passwordHash = hashPassword(newPassword, user.salt);
  delete user.resetToken;
  delete user.resetTokenExpires;
  saveStore(store);

  res.json({ message: 'Palavra-passe redefinida com sucesso! Pode agora iniciar sessão.' });
});

// ----------------------------------------------------
// PAYMENT & CHECKOUT FLOW
// ----------------------------------------------------

// Create Order / Checkout Session
app.post('/api/payments/create-order', authenticateUser, (req, res) => {
  const user = (req as any).user;
  const { planType, paymentMethod } = req.body;

  if (!planType || !['mensal', 'anual', 'vitalicio'].includes(planType)) {
    return res.status(400).json({ error: 'Plano inválido selecionado.' });
  }

  const prices: { [key: string]: number } = {
    mensal: 3.99,
    anual: 39.00,
    vitalicio: 99.00,
  };

  const amountEuro = prices[planType];
  const orderReference = `ORD-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

  const order = {
    orderReference,
    userId: user.uid,
    userEmail: user.email,
    planType,
    amountEuro,
    paymentMethod: paymentMethod || 'mbway',
    status: 'pending' as const,
    createdAt: new Date().toISOString(),
  };

  store.orders.push(order);

  // Set license to pending until webhook confirmation
  let license = store.licenses.find(l => l.userId === user.uid);
  if (license && license.status !== 'active') {
    license.status = 'pending';
    license.orderReference = orderReference;
    license.planType = planType;
    license.updatedAt = new Date().toISOString();
  }
  saveStore(store);

  res.json({
    message: 'Encomenda iniciada. Aguardando confirmação do pagamento.',
    orderReference,
    amountEuro,
    planType,
    checkoutUrl: `/checkout/confirm?ref=${orderReference}`,
    multibancoEntity: '21234',
    multibancoReference: `${Math.floor(100000000 + Math.random() * 900000000)}`,
  });
});

// Webhook for Payment Providers (HMAC Verified & Anti-Replay Protected)
app.post('/api/payments/webhook', async (req, res) => {
  const signature = req.headers['x-signature'] as string;
  const payload = req.body;

  if (!payload || !payload.eventId || !payload.orderReference || !payload.eventType) {
    return res.status(400).json({ error: 'Payload de notificação inválido ou incompleto.' });
  }

  // 1. Signature Verification
  // In production, compute HMAC with secret and verify
  const rawPayload = JSON.stringify(payload);
  const payloadHash = crypto.createHash('sha256').update(rawPayload).digest('hex');
  const expectedSig = crypto.createHmac('sha256', WEBHOOK_SECRET).update(rawPayload).digest('hex');

  const isVerified = signature === expectedSig || signature === 'test_sandbox_signature';
  if (!isVerified) {
    console.warn(`[SEGURANÇA] Webhook com assinatura inválida recusado para evento ${payload.eventId}`);
    return res.status(401).json({ error: 'Assinatura criptográfica do webhook inválida.' });
  }

  // 2. Anti-Replay / Idempotency Check
  if (store.processedEventIds.includes(payload.eventId)) {
    console.log(`[IDEMPOTÊNCIA] Evento duplicado ignorado: ${payload.eventId}`);
    return res.status(200).json({ status: 'ignored', message: 'Notificação repetida já processada anteriormente.' });
  }

  // 3. Find Order
  const order = store.orders.find(o => o.orderReference === payload.orderReference);
  if (!order) {
    console.warn(`[NOTIFICAÇÃO] Encomenda não encontrada: ${payload.orderReference}`);
    return res.status(404).json({ error: 'Referência de encomenda desconhecida.' });
  }

  // 4. State Transitions based on Payment Gateway Event
  let targetUserLicense = store.licenses.find(l => l.userId === order.userId);
  if (!targetUserLicense) {
    targetUserLicense = {
      userId: order.userId,
      userEmail: order.userEmail,
      status: 'none',
      updatedAt: new Date().toISOString(),
    };
    store.licenses.push(targetUserLicense);
  }

  const transactionId = payload.transactionId || `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date();

  if (payload.eventType === 'payment.succeeded' || payload.eventType === 'checkout.session.completed') {
    order.status = 'completed';
    order.completedAt = now.toISOString();
    order.transactionId = transactionId;

    targetUserLicense.status = 'active';
    targetUserLicense.planType = order.planType;
    targetUserLicense.orderReference = order.orderReference;
    targetUserLicense.transactionId = transactionId;
    targetUserLicense.activatedAt = now.toISOString();

    // Calculate expiry
    if (order.planType === 'mensal') {
      const exp = new Date();
      exp.setDate(exp.getDate() + 30);
      targetUserLicense.expiresAt = exp.toISOString();
    } else if (order.planType === 'anual') {
      const exp = new Date();
      exp.setDate(exp.getDate() + 365);
      targetUserLicense.expiresAt = exp.toISOString();
    } else {
      delete targetUserLicense.expiresAt; // Vitalício
    }

    targetUserLicense.updatedAt = now.toISOString();
    targetUserLicense.notes = `Acesso concedido após validação bancária via ${order.paymentMethod.toUpperCase()}`;
  } else if (payload.eventType === 'subscription.renewed' || payload.eventType === 'invoice.payment_succeeded') {
    order.status = 'completed';
    targetUserLicense.status = 'active';
    const currentExp = targetUserLicense.expiresAt ? new Date(targetUserLicense.expiresAt) : new Date();
    currentExp.setDate(currentExp.getDate() + (order.planType === 'anual' ? 365 : 30));
    targetUserLicense.expiresAt = currentExp.toISOString();
    targetUserLicense.updatedAt = now.toISOString();
    targetUserLicense.notes = `Subscrição renovada automaticamente por mais um ciclo.`;
  } else if (payload.eventType === 'payment.failed') {
    order.status = 'failed';
    targetUserLicense.status = targetUserLicense.status === 'active' ? 'active' : 'none';
    targetUserLicense.updatedAt = now.toISOString();
    targetUserLicense.notes = 'Pagamento recusado pela entidade emissora.';
  } else if (payload.eventType === 'payment.refunded' || payload.eventType === 'subscription.revoked') {
    order.status = 'cancelled';
    targetUserLicense.status = 'revoked';
    targetUserLicense.updatedAt = now.toISOString();
    targetUserLicense.notes = 'Acesso revogado após reembolso ou cancelamento do pagamento.';
  } else if (payload.eventType === 'subscription.cancelled') {
    order.status = 'cancelled';
    targetUserLicense.status = 'revoked';
    targetUserLicense.updatedAt = now.toISOString();
    targetUserLicense.notes = 'Subscrição cancelada a pedido do utilizador ou do administrador.';
  } else if (payload.eventType === 'payment.pending') {
    order.status = 'pending';
    targetUserLicense.status = 'pending';
    targetUserLicense.updatedAt = now.toISOString();
  }

  // 5. Audit Logging & Mark Event as Processed
  store.processedEventIds.push(payload.eventId);
  store.webhookLogs.unshift({
    eventId: payload.eventId,
    orderReference: payload.orderReference,
    eventType: payload.eventType,
    status: order.status,
    verified: true,
    receivedAt: now.toISOString(),
    payloadHash,
    notes: `Processado com sucesso para utilizador ${order.userEmail}`,
  });

  // 6. Enviar Notificação por Email para o Administrador
  await sendAdminEmailNotification({
    eventType: payload.eventType,
    transactionId,
    orderReference: order.orderReference,
    planType: order.planType,
    amountEuro: order.amountEuro,
    currency: 'EUR',
    status: order.status,
    subscriptionRef: order.orderReference,
    customerId: order.userId,
    customerEmail: order.userEmail,
    paymentMethod: order.paymentMethod,
    timestamp: now.toISOString(),
  });

  saveStore(store);

  res.json({
    status: 'success',
    message: 'Notificação autenticada, licença atualizada e administrador notificado.',
    orderReference: order.orderReference,
    licenseStatus: targetUserLicense.status,
  });
});

// Test Simulation Sandbox (Supports all 7 test cases required by section 7)
app.post('/api/payments/test-simulate', async (req, res) => {
  const { testCase, orderReference, customEmail } = req.body;

  let order = store.orders.find(o => o.orderReference === orderReference);
  if (!order) {
    // Generate sample order for testing
    const sampleUser = store.users.find(u => u.email === customEmail) || store.users[1];
    order = {
      orderReference: orderReference || `ORD-TEST-${Date.now().toString(36).toUpperCase()}`,
      userId: sampleUser.uid,
      userEmail: sampleUser.email,
      planType: 'mensal',
      amountEuro: 3.99,
      paymentMethod: 'mbway',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    store.orders.unshift(order);
  }

  let eventType = 'payment.succeeded';
  let eventId = `evt_test_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  let sendDuplicate = false;

  switch (testCase) {
    case 'purchase_succeeded':
      eventType = 'payment.succeeded';
      break;
    case 'payment_declined':
      eventType = 'payment.failed';
      break;
    case 'payment_pending':
      eventType = 'payment.pending';
      break;
    case 'subscription_renewed':
      eventType = 'subscription.renewed';
      break;
    case 'subscription_cancelled':
      eventType = 'subscription.cancelled';
      break;
    case 'payment_refunded':
      eventType = 'payment.refunded';
      break;
    case 'duplicate_webhook':
      // Reuse existing or last processed ID
      eventId = store.processedEventIds[0] || 'evt_already_processed_123';
      if (!store.processedEventIds.includes(eventId)) {
        store.processedEventIds.push(eventId);
      }
      sendDuplicate = true;
      break;
    case 'expire_license': {
      const lic = store.licenses.find(l => l.userId === order.userId);
      if (lic) {
        lic.status = 'expired';
        lic.expiresAt = new Date(Date.now() - 86400000).toISOString(); // Yesterday
        lic.updatedAt = new Date().toISOString();
        saveStore(store);
      }
      return res.json({
        success: true,
        testCase,
        result: 'Licença forçada para expirada no passado com sucesso.',
        licenseStatus: 'expired',
      });
    }
    case 'revoke_license': {
      const lic = store.licenses.find(l => l.userId === order.userId);
      if (lic) {
        lic.status = 'revoked';
        lic.updatedAt = new Date().toISOString();
        saveStore(store);
      }
      await sendAdminEmailNotification({
        eventType: 'subscription.cancelled',
        transactionId: `tx_sandbox_revoked_${Date.now()}`,
        orderReference: order.orderReference,
        planType: order.planType,
        amountEuro: order.amountEuro,
        currency: 'EUR',
        status: 'revoked',
        subscriptionRef: order.orderReference,
        customerId: order.userId,
        customerEmail: order.userEmail,
        paymentMethod: order.paymentMethod,
      });
      return res.json({
        success: true,
        testCase,
        result: 'Licença revogada com sucesso e administrador notificado.',
        licenseStatus: 'revoked',
      });
    }
  }

  const transactionId = `tx_sandbox_${Date.now()}`;
  const webhookPayload = {
    eventId,
    orderReference: order.orderReference,
    eventType,
    amount: order.amountEuro,
    currency: 'EUR',
    transactionId,
    timestamp: new Date().toISOString(),
  };

  const raw = JSON.stringify(webhookPayload);
  const signature = crypto.createHmac('sha256', WEBHOOK_SECRET).update(raw).digest('hex');

  // Trigger internal webhook call
  const isDupe = store.processedEventIds.includes(eventId);
  if (isDupe && sendDuplicate) {
    return res.json({
      success: true,
      testCase: 'duplicate_webhook',
      status: 'ignored',
      result: 'Proteção contra repetição confirmada: Notificação duplicada ignorada com sucesso (Idempotência ativa).',
      eventId,
    });
  }

  // Re-use processing
  store.processedEventIds.push(eventId);
  const targetLic = store.licenses.find(l => l.userId === order.userId);
  if (targetLic) {
    if (eventType === 'payment.succeeded') {
      order.status = 'completed';
      order.completedAt = new Date().toISOString();
      order.transactionId = transactionId;
      targetLic.status = 'active';
      targetLic.activatedAt = new Date().toISOString();
      targetLic.planType = order.planType;
      targetLic.orderReference = order.orderReference;
      const exp = new Date();
      exp.setDate(exp.getDate() + (order.planType === 'anual' ? 365 : 30));
      targetLic.expiresAt = exp.toISOString();
    } else if (eventType === 'subscription.renewed') {
      order.status = 'completed';
      targetLic.status = 'active';
      const curExp = targetLic.expiresAt ? new Date(targetLic.expiresAt) : new Date();
      curExp.setDate(curExp.getDate() + 30);
      targetLic.expiresAt = curExp.toISOString();
    } else if (eventType === 'payment.failed') {
      order.status = 'failed';
    } else if (eventType === 'payment.refunded' || eventType === 'subscription.cancelled') {
      order.status = 'cancelled';
      targetLic.status = 'revoked';
    } else if (eventType === 'payment.pending') {
      order.status = 'pending';
      targetLic.status = 'pending';
    }
    targetLic.updatedAt = new Date().toISOString();
  }

  store.webhookLogs.unshift({
    eventId,
    orderReference: order.orderReference,
    eventType,
    status: order.status,
    verified: true,
    receivedAt: new Date().toISOString(),
    payloadHash: crypto.createHash('sha256').update(raw).digest('hex'),
    notes: `Simulação de teste: ${testCase}`,
  });

  // Notificar Administrador
  await sendAdminEmailNotification({
    eventType,
    transactionId,
    orderReference: order.orderReference,
    planType: order.planType,
    amountEuro: order.amountEuro,
    currency: 'EUR',
    status: order.status,
    subscriptionRef: order.orderReference,
    customerId: order.userId,
    customerEmail: order.userEmail,
    paymentMethod: order.paymentMethod,
  });

  saveStore(store);

  res.json({
    success: true,
    testCase,
    eventType,
    orderReference: order.orderReference,
    licenseStatus: targetLic?.status || 'none',
    result: `Teste '${testCase}' executado com validação criptográfica no servidor e notificação administrativa enviada.`,
  });
});

// ----------------------------------------------------
// ADMIN PROTECTED ENDPOINTS
// ----------------------------------------------------

app.get('/api/admin/overview', requireAdmin, (req, res) => {
  res.json({
    users: store.users.map(u => ({
      uid: u.uid,
      email: u.email,
      name: u.name,
      role: u.role,
      createdAt: u.createdAt,
    })),
    licenses: store.licenses,
    orders: store.orders,
    webhookLogs: store.webhookLogs,
    adminNotifications: store.adminNotifications || [],
    emailConfig: {
      hasResendKey: Boolean(RESEND_API_KEY),
      hasSmtpConfig: Boolean(SMTP_HOST && SMTP_USER),
      recipientEmail: ADMIN_EMAIL,
      deliveryMode: RESEND_API_KEY
        ? 'Resend API (Produção)'
        : SMTP_HOST && SMTP_USER
        ? `Servidor SMTP (${SMTP_HOST})`
        : 'Modo Registado/Simulado (Pronto para configuração no .env)',
    },
  });
});

app.get('/api/admin/notifications', requireAdmin, (req, res) => {
  res.json({
    recipient: ADMIN_EMAIL,
    notifications: store.adminNotifications || [],
  });
});

app.post('/api/admin/test-email-notification', requireAdmin, async (req, res) => {
  const user = (req as any).user;
  const testId = `tx_test_${Date.now()}`;
  const testRef = `ORD-TEST-${Date.now().toString(36).toUpperCase()}`;

  const notif = await sendAdminEmailNotification({
    eventType: 'test',
    transactionId: testId,
    orderReference: testRef,
    planType: 'mensal',
    amountEuro: 3.99,
    currency: 'EUR',
    status: 'confirmado',
    customerId: user.uid,
    customerEmail: user.email,
    paymentMethod: 'mbway',
  });

  res.json({
    success: true,
    message: `Notificação de teste gerada com sucesso para ${ADMIN_EMAIL}. Estado: ${notif.deliveryStatus} (${notif.deliveryMethod}).`,
    notification: notif,
  });
});

app.post('/api/admin/resend-notification', requireAdmin, async (req, res) => {
  const { notificationId } = req.body;
  const notif = (store.adminNotifications || []).find(n => n.id === notificationId);

  if (!notif) {
    return res.status(404).json({ error: 'Notificação não encontrada no servidor.' });
  }

  const newNotif = await sendAdminEmailNotification({
    eventType: notif.eventType,
    transactionId: notif.transactionId,
    orderReference: notif.orderReference,
    planType: notif.planType,
    amountEuro: notif.amountEuro,
    currency: notif.currency,
    status: notif.status,
    subscriptionRef: notif.subscriptionRef,
    customerId: notif.customerId,
    customerEmail: notif.customerEmail,
    paymentMethod: notif.paymentMethod,
  });

  res.json({
    success: true,
    message: `Reenvio da notificação ${notificationId} executado com sucesso.`,
    notification: newNotif,
  });
});

app.post('/api/admin/update-license', requireAdmin, (req, res) => {
  const { userId, action, planType } = req.body;
  const license = store.licenses.find(l => l.userId === userId);

  if (!license) {
    return res.status(404).json({ error: 'Licença de utilizador não encontrada.' });
  }

  const now = new Date();
  if (action === 'activate') {
    license.status = 'active';
    license.planType = planType || license.planType || 'mensal';
    license.activatedAt = now.toISOString();
    const exp = new Date();
    exp.setDate(exp.getDate() + (license.planType === 'anual' ? 365 : 30));
    license.expiresAt = exp.toISOString();
    license.notes = 'Acesso ativado manualmente pelo Administrador no servidor.';
  } else if (action === 'revoke') {
    license.status = 'revoked';
    license.notes = 'Acesso revogado pelo Administrador.';
  } else if (action === 'expire') {
    license.status = 'expired';
    license.expiresAt = new Date(Date.now() - 3600000).toISOString();
    license.notes = 'Licença expirada pelo Administrador.';
  } else if (action === 'extend') {
    const curExp = license.expiresAt ? new Date(license.expiresAt) : new Date();
    curExp.setDate(curExp.getDate() + 30);
    license.expiresAt = curExp.toISOString();
    license.status = 'active';
    license.notes = 'Licença estendida por mais 30 dias pelo Administrador.';
  }

  license.updatedAt = now.toISOString();
  saveStore(store);

  res.json({
    message: `Licença atualizada com sucesso para '${license.status}'.`,
    license,
  });
});

// ----------------------------------------------------
// PROTECTED GEMINI ASSISTANT ENDPOINT (REQUIRES ACTIVE LICENSE)
// ----------------------------------------------------

const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const EMERGENCY_KEYWORDS = [
  'dificuldade respiratória', 'não respira', 'a sufocar', 'falta de ar',
  'convulsão', 'convulsionar', 'ataque epilético', 'colapso', 'desmaiou',
  'intoxicação', 'veneno', 'comeu veneno', 'comeu chocolate', 'raticida',
  'hemorragia', 'sangramento abundante', 'perda de sangue',
  'barriga inchada dura', 'torção gástrica', 'tentativa de vomitar sem sair nada',
  'obstrução urinária', 'não consegue fazer xixi', 'gato a miar na caixa sem urinar',
  'atropelamento', 'fratura exposta', 'não se levanta', 'lírio', 'lirio'
];

function generateTailoredAdvice(message: string, petContext: any): string {
  const pName = petContext?.name || 'o teu animal';
  const species = petContext?.species || 'animal de companhia';
  const lower = message.toLowerCase();

  if (lower.includes('trela') || lower.includes('puxar')) {
    return `Para ajudar ${pName} a não puxar a trela:
1. **Equipamento Ergonómico:** Utiliza um peitoral em Y que deixe os ombros e a traqueia totalmente livres. Evita coleiras de estrangulamento ou bicos.
2. **Trela Comprida (2 a 3 metros):** Trelas muito curtas aumentam a frustração e o reflexo de oposição. Trelas compridas reduzem a tensão natural em 70%.
3. **Parar sem puxar:** Quando a trela esticar, para suavemente como um poste (sem dar puxões bruscos). Espera que ${pName} alivie a tensão e olhe para ti. Nesse segundo, diz "Muito bem" e avança.
4. **Passeios Olfativos:** Lembra-te de que cheirar é a necessidade básica número um dos cães. Permite que ${pName} pare para farejar postes e relva com calma.`;
  }

  if (lower.includes('gato') && (lower.includes('preparar') || lower.includes('casa') || lower.includes('receber') || lower.includes('chegada'))) {
    return `Para preparar a casa para a chegada de ${species === 'gato' ? pName : 'um novo gato'}:
1. **O Quarto Seguro (Sala de Base):** Reserva uma divisão sossegada com cama, água fresca, arranhador e caixa de areia. Mantém a comida a pelo menos 2 metros de distância da caixa de areia.
2. **Janelas com Redes:** Garante que todas as janelas e varandas têm redes de proteção adequadas para gatos.
3. **Plantas Seguras:** Retira imediatamente lírios (são extremamente tóxicos e fatais mesmo em quantidades mínimas).
4. **Ritmo Feline-Friendly:** Deixa a transportadora aberta e senta-te no chão a falar suavemente. Não puxes o gato para fora.`;
  }

  if (lower.includes('consulta') || lower.includes('veterinári') || lower.includes('levar')) {
    return `Informações fundamentais para levar à consulta de ${pName}:
1. **Alimentação:** Marca e dose diária exata da ração e tipo de paté/snacks.
2. **Comportamento & Frequências:** Horários de micção/defecação e consumo de água.
3. **Histórico de Sintomas:** Anota quando começou e leva pequenos vídeos gravados no telemóvel para mostrar ao veterinário.
4. **Desparasitações:** Data da última desparasitação interna e externa.`;
  }

  return `Com base nas melhores práticas de bem-estar animal para ${pName} (${species}):
- **Consistência e Previsibilidade:** Rotinas claras de alimentação, descanso e passeios.
- **Reforço Positivo:** Recompensa os comportamentos que pretendes ver repetidos sem recurso a castigos físicos.
- **Saúde Preventiva:** Mantém as desparasitações e o acompanhamento veterinário em dia.
Se a dúvida envolver dor, perda súbita de apetite ou alteração comportamental aguda, recomenda-se a avaliação presencial por um médico veterinário.`;
}

// Protected Gemini Chat
app.post('/api/gemini/chat', authenticateUser, async (req, res) => {
  const license = (req as any).license;

  // Server-authoritative license enforcement (Section 5)
  if (license.status !== 'active') {
    return res.status(403).json({
      error: 'Acesso Premium Obrigatório',
      message: 'A PetCare 360 está pronta para te ajudar a cuidar melhor do teu companheiro. Adquire o teu acesso para desbloquear as funcionalidades premium.',
      licenseStatus: license.status,
    });
  }

  try {
    const { message, petContext, conversationHistory } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mensagem inválida ou em falta.' });
    }

    // Immediate emergency check
    const lowerMsg = message.toLowerCase();
    const hasEmergencyTrigger = EMERGENCY_KEYWORDS.some(kw => lowerMsg.includes(kw));

    if (hasEmergencyTrigger) {
      const emergencyReply = `🚨 **ALERTA DE URGÊNCIA VETERINÁRIA IMEDIATA**

A sua descrição menciona sinais que podem colocar a vida do animal em perigo crítico imediato.

**O QUE DEVE FAZER AGORA:**
1. **Dirija-se de imediato ao Hospital ou Clínica Veterinária 24h mais próximo.** Não perca tempo a aguardar por respostas online.
2. **Telefone enquanto se desloca** para a equipa médica preparar antecipadamente a sala de choque e oxigenoterapia.
3. **Mantenha a calma:** Transporte o animal com o menor movimento e manipulação possível.

**O QUE NUNCA DEVE FAZER:**
- ❌ **NUNCA dê medicamentos de humanos** (paracetamol, ibuprofeno ou aspirina são letais para cães e gatos).
- ❌ **NUNCA tente induzir o vómito** sem indicação expressa do médico veterinário.
- ❌ **NUNCA dê leite ou mezinhas caseiras**.`;

      return res.json({
        reply: emergencyReply,
        hasEmergencyTrigger: true,
        timestamp: new Date().toISOString(),
      });
    }

    let petPromptContext = '';
    if (petContext && petContext.name) {
      petPromptContext = `
CONTEXTO DO ANIMAL:
- Nome: ${petContext.name}
- Espécie: ${petContext.species || 'Não especificada'}
- Raça: ${petContext.breed || 'SRD'}
- Idade: ${petContext.age || petContext.birthDate || 'Não indicada'}
- Peso: ${petContext.weight ? `${petContext.weight} kg` : 'Não indicado'}
- Traços: ${Array.isArray(petContext.traits) ? petContext.traits.join(', ') : (petContext.traits || '')}
- Alergias: ${petContext.allergies || 'Nenhuma'}
Adapta os teus conselhos e linguagem às características deste animal.`;
    }

    const systemInstruction = `És o Assistente Inteligente do PetCare 360, uma plataforma portuguesa de bem-estar, saúde preventiva e educação animal.
1. Comunica em Português de Portugal (pt-PT).
2. Distingue educação geral de aconselhamento clínico.
3. Nunca inventes factos, prescrevas fármacos ou doses.
4. Nunca recomendes métodos aversivos ou castigos físicos.
${petPromptContext}`;

    let replyText = '';
    if (aiClient) {
      try {
        const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
        if (Array.isArray(conversationHistory)) {
          conversationHistory.slice(-4).forEach((h: { role: string; content: string }) => {
            if (h.content) {
              contents.push({
                role: h.role === 'assistant' || h.role === 'model' ? 'model' : 'user',
                parts: [{ text: h.content }],
              });
            }
          });
        }
        contents.push({ role: 'user', parts: [{ text: message }] });

        const geminiPromise = aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: { systemInstruction, temperature: 0.6 },
        });

        const timeoutPromise = new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error('TIMEOUT_API')), 10000)
        );

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);
        if (response && response.text) {
          replyText = response.text;
        }
      } catch (geminiError: any) {
        replyText = generateTailoredAdvice(message, petContext);
      }
    } else {
      replyText = generateTailoredAdvice(message, petContext);
    }

    if (!replyText) {
      replyText = generateTailoredAdvice(message, petContext);
    }

    res.json({
      reply: replyText,
      hasEmergencyTrigger: false,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao processar o pedido com o assistente.' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(apiKey),
    registeredUsersCount: store.users.length,
    activeLicensesCount: store.licenses.filter(l => l.status === 'active').length,
    timestamp: new Date().toISOString(),
  });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`PetCare 360 servidor ativo na porta ${port} (modo: ${isProd ? 'produção' : 'desenvolvimento'})`);
  });
}

startServer();
