// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

function getTransporter() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
        throw new Error('Configuration SMTP manquante (SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASSWORD).');
    }

    return nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASSWORD,
        },
    });
}

export async function POST(request: NextRequest) {
    try {
        const { nom, email, sujet, telephone, message } = await request.json();
        console.log('📩 Nouvelle requête de contact reçue:', { nom, email, sujet, telephone });

        // Validation basique
        if (!nom || !email || !sujet || !message) {
            return NextResponse.json(
                { error: 'Tous les champs sont requis.' },
                { status: 400 }
            );
        }

        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Adresse email invalide.' },
                { status: 400 }
            );
        }

        // Validation longueur
        if (nom.length < 2 || nom.length > 100) {
            return NextResponse.json(
                { error: 'Le nom doit contenir entre 2 et 100 caractères.' },
                { status: 400 }
            );
        }

        if (sujet.length < 3 || sujet.length > 200) {
            return NextResponse.json(
                { error: 'Le sujet doit contenir entre 3 et 200 caractères.' },
                { status: 400 }
            );
        }

        if (message.length < 10 || message.length > 5000) {
            return NextResponse.json(
                { error: 'Le message doit contenir entre 10 et 5000 caractères.' },
                { status: 400 }
            );
        }

        // Sanitize input (basic XSS protection)
        const sanitize = (str: string) =>
            str.replace(/[<>]/g, '').trim();

        const nomSanitized = sanitize(nom);
        const sujetSanitized = sanitize(sujet);
        const messageSanitized = sanitize(message);
        const telephoneSanitized = telephone ? sanitize(telephone) : '';

        const dateString = new Date().toLocaleString('fr-FR', {
            dateStyle: 'full',
            timeStyle: 'short'
        });

        const transporter = getTransporter();
        const businessInbox = process.env.SMTP_USER as string;

        // === EMAIL À L'ÉQUIPE ATHENAEVENT ===
        await transporter.sendMail({
            from: `"Athena Event - Site web" <${businessInbox}>`,
            to: businessInbox,
            replyTo: email,
            subject: `Nouveau message de ${nomSanitized} — ${sujetSanitized}`,
            html: `
<!DOCTYPE html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
  <title>Nouveau message de contact &mdash; Athena Event</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
    table,td{mso-table-lspace:0pt;mso-table-rspace:0pt;}
    img{-ms-interpolation-mode:bicubic;border:0;outline:none;text-decoration:none;}
    body{margin:0;padding:0;width:100%!important;background:#eef1f5;}
    a{color:#163057;}
    @media only screen and (max-width:680px){
      .container{width:100%!important;}
      .px{padding-left:24px!important;padding-right:24px!important;}
      .h1{font-size:26px!important;line-height:32px!important;}
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#eef1f5;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#eef1f5;opacity:0;">
    ${nomSanitized} vous a laiss&eacute; un message via le formulaire de contact du site.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef1f5;">
    <tr>
      <td align="center" style="padding:14px 12px 28px 12px;">
        <table role="presentation" class="container" width="680" cellpadding="0" cellspacing="0" style="width:680px;max-width:680px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 8px 28px rgba(20,41,77,0.10);">

          <!-- EN-TETE -->
          <tr>
            <td style="background:#163057;background-image:linear-gradient(180deg,#1c3a63 0%,#122748 100%);padding:32px 40px 28px 40px;text-align:center;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:4px;color:#9fb0c9;text-transform:uppercase;padding-top:12px;">
                Athena Event &middot; Formulaire de contact
              </div>
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:36px;color:#ffffff;font-style:italic;padding-top:10px;">
                Un nouveau message vous attend
              </div>
              <div style="width:54px;height:2px;background:#c7a253;margin:18px auto 16px auto;line-height:2px;font-size:0;">&nbsp;</div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;letter-spacing:1px;color:#d7deea;">
                Connect &middot; Measure &middot; Grow
              </div>
            </td>
          </tr>

          <!-- CORPS -->
          <tr>
            <td class="px" style="padding:36px 44px 8px 44px;">
              <h1 class="h1" style="margin:0 0 6px 0;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:34px;color:#163057;font-weight:normal;">
                Quelqu'un souhaite vous parler.
              </h1>
              <p style="margin:0 0 18px 0;font-family:Arial,Helvetica,sans-serif;font-size:12.5px;letter-spacing:.5px;color:#c7a253;text-transform:uppercase;font-weight:bold;">
                Nouvelle demande de contact
              </p>
              <p style="margin:0 0 24px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:#3b4453;">
                Un message a &eacute;t&eacute; d&eacute;pos&eacute; via le formulaire de contact du site.
                Vous trouverez ci-dessous les coordonn&eacute;es de l'exp&eacute;diteur ainsi que son message.
              </p>
            </td>
          </tr>

          <!-- CARTE DU MESSAGE -->
          <tr>
            <td class="px" style="padding:0 44px 8px 44px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f8fb;border-radius:12px;">
                <tr>
                  <td style="padding:22px 24px;border-left:3px solid #c7a253;">
                    <p style="margin:0 0 4px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:1px;color:#8a97ab;text-transform:uppercase;">Exp&eacute;diteur</p>
                    <p style="margin:0 0 14px 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#163057;">${nomSanitized}</p>

                    <p style="margin:0 0 4px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:1px;color:#8a97ab;text-transform:uppercase;">Email</p>
                    <p style="margin:0 0 14px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;"><a href="mailto:${email}" style="color:#163057;text-decoration:none;">${email}</a></p>

                    ${telephoneSanitized ? `<p style="margin:0 0 4px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:1px;color:#8a97ab;text-transform:uppercase;">T&eacute;l&eacute;phone</p>
                    <p style="margin:0 0 14px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#3b4453;">${telephoneSanitized}</p>` : ''}

                    <p style="margin:0 0 4px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:1px;color:#8a97ab;text-transform:uppercase;">Sujet</p>
                    <p style="margin:0 0 14px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#3b4453;">${sujetSanitized}</p>

                    <p style="margin:0 0 4px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:1px;color:#8a97ab;text-transform:uppercase;">Message</p>
                    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:23px;color:#3b4453;white-space:pre-wrap;">${messageSanitized}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ACTION -->
          <tr>
            <td class="px" align="center" style="padding:26px 44px 8px 44px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:8px;background:#163057;">
                    <a href="mailto:${email}?subject=${encodeURIComponent(`Re: ${sujetSanitized}`)}" style="display:inline-block;padding:14px 32px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#ffffff;text-decoration:none;">
                      R&eacute;pondre &agrave; ${nomSanitized.split(' ')[0]}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- SIGNATURE -->
          <tr>
            <td class="px" style="padding:24px 44px 26px 44px;">
              <p style="margin:0 0 2px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;color:#8a97ab;">
                Re&ccedil;u le ${dateString}
              </p>
            </td>
          </tr>

          <!-- PIED DE PAGE -->
          <tr>
            <td style="background:#122748;padding:26px 40px;text-align:center;">
              <div style="font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:14px;color:#c7d0df;padding-bottom:12px;">
                Connect. Measure. Grow.
              </div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#8ea0bb;padding-bottom:14px;">
                <a href="https://athena-event.com/" target="_blank" style="color:#c7d0df;text-decoration:none;">athena-event.com</a>
                &nbsp;&middot;&nbsp;
                <a href="mailto:${businessInbox}" style="color:#c7d0df;text-decoration:none;">${businessInbox}</a>
              </div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:16px;color:#6f83a0;">
                Vous recevez cet e-mail car un visiteur a utilis&eacute; le formulaire de contact du site Athena Event.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
            `,
        });

        // === EMAIL DE CONFIRMATION AU VISITEUR ===
        await transporter.sendMail({
            from: `"Athena Event" <${businessInbox}>`,
            to: email,
            subject: 'Votre message est bien arrivé — Athena Event',
            html: `
<!DOCTYPE html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml"
      xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Athena Event</title>
    <!--[if mso]>
    <noscript><xml><o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings></xml></noscript>
    <![endif]-->
    <style>
        body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
        table, td           { mso-table-lspace:0pt; mso-table-rspace:0pt; }
        img                 { -ms-interpolation-mode:bicubic; border:0; display:block; }
        .ReadMsgBody        { width:100%; }
        .ExternalClass      { width:100%; }
        .ExternalClass, .ExternalClass p, .ExternalClass span,
        .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height:100%; }

        @media only screen and (max-width:680px) {
            .email-outer-td { padding:0 !important; }
            .email-shell    { width:100% !important; min-width:100% !important;
                               border-radius:0 !important; }
            .hero-td        { padding:26px 20px 24px 20px !important; }
            .logo-brand-td  { display:block !important; width:100% !important; }
            .logo-img       { width:34px !important; height:34px !important; }
            .brand-name     { font-size:16px !important; }
            .brand-sub      { font-size:9px !important; }
            .ref-badge-td    { display:block !important; width:100% !important;
                               text-align:left !important;
                               padding-top:12px !important; padding-left:0 !important; }
            .ref-badge-inner { text-align:left !important; }
            .hero-title     { font-size:21px !important; line-height:27px !important; }
            .hero-sub       { font-size:12px !important; }
            .body-td        { padding:26px 20px 0 20px !important; }
            .card-td        { padding:16px !important; }
            .footer-td      { padding:24px 20px !important; }
            .below-note     { padding:0 16px !important; }
        }
    </style>
</head>
<body style="margin:0;padding:0;background-color:#eef1f5;word-spacing:normal;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;color:#eef1f5;line-height:1px;">Merci de nous avoir contact&eacute;s, ${nomSanitized} &mdash; nous revenons vers vous sous 24 heures&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;</div>
<!--[if mso | IE]>
<table role="presentation" border="0" cellpadding="0" cellspacing="0"
       width="100%" style="background-color:#eef1f5;"><tr><td>
<![endif]-->
<table role="presentation" border="0" cellpadding="0" cellspacing="0"
       width="100%" style="background-color:#eef1f5;">
  <tr>
    <td class="email-outer-td" align="center" style="padding:28px 16px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"
             class="email-shell"
             style="width:680px;max-width:680px;background-color:#ffffff;
                    border-radius:14px;overflow:hidden;
                    box-shadow:0 8px 28px rgba(20,41,77,0.10);">

    <!--[if mso | IE]>
    <tr><td style="background-color:#163057;padding:32px 36px 30px 36px;">
    <![endif]-->
    <!--[if !mso]><!-->
    <tr>
      <td class="hero-td"
          style="background-color:#163057;
                 background-image:linear-gradient(rgba(22,48,87,0.78),rgba(18,39,72,0.86)),url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80&auto=format&fit=crop');
                 background-size:cover;background-position:center center;
                 background-repeat:no-repeat;
                 padding:32px 36px 30px 36px;">
    <!--<![endif]-->

        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">

          <!-- Ligne 1 : Logo + marque + badge type email -->
          <tr>
            <td class="logo-brand-td" valign="middle" style="vertical-align:middle;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td valign="middle" style="padding-right:12px;vertical-align:middle;">
                    <img class="logo-img" src="https://athena-event.com/logo.png" alt="Athena Event"
                         width="40" height="40"
                         style="width:40px;height:40px;border-radius:10px;
                                border:1px solid #c7a253;display:block;" />
                  </td>
                  <td valign="middle" style="vertical-align:middle;">
                    <div class="brand-name"
                         style="font-family:Georgia,'Times New Roman',serif;
                                font-size:19px;color:#ffffff;
                                line-height:1.2;margin:0;letter-spacing:.5px;">
                      Athena Event
                    </div>
                    <div class="brand-sub"
                         style="font-family:Arial,sans-serif;font-size:9px;
                                color:#9fb0c9;letter-spacing:2.5px;
                                text-transform:uppercase;margin-top:3px;">
                      by Clearmind Analytics
                    </div>
                  </td>
                </tr>
              </table>
            </td>

            <td class="ref-badge-td" valign="middle" align="right"
                style="vertical-align:middle;padding-left:12px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0"
                     align="right">
                <tr>
                  <td class="ref-badge-inner"
                      style="background-color:#122748;border:1px solid #c7a253;
                             border-radius:20px;padding:7px 16px;text-align:right;">
                    <div style="font-family:Arial,sans-serif;font-size:10px;
                                font-weight:700;color:#d9b979;letter-spacing:1.5px;
                                text-transform:uppercase;line-height:1.3;">
                      Message re&ccedil;u
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Spacer -->
          <tr>
            <td colspan="2" style="height:24px;font-size:1px;line-height:1px;">&nbsp;</td>
          </tr>

          <!-- Ligne 2 : Filet doré + titre + sous-titre -->
          <tr>
            <td colspan="2">
              <div style="width:44px;height:2px;background-color:#c7a253;
                          margin-bottom:14px;font-size:0;line-height:2px;">&nbsp;</div>
              <div class="hero-title"
                   style="font-family:Georgia,'Times New Roman',serif;
                          font-size:25px;color:#ffffff;
                          line-height:31px;margin:0;">
                Merci, ${nomSanitized.split(' ')[0]} !
              </div>
              <div class="hero-sub"
                   style="font-family:Arial,sans-serif;font-size:13px;
                          color:#d7deea;margin-top:8px;letter-spacing:.3px;
                          line-height:1.5;">
                Votre message a bien &eacute;t&eacute; transmis &agrave; notre &eacute;quipe
              </div>
            </td>
          </tr>

        </table>

    <!--[if mso | IE]></td></tr><![endif]-->
    <!--[if !mso]><!-->
      </td>
    </tr>
    <!--<![endif]-->

    <!-- Filet doré accent sous le hero -->
    <tr>
      <td style="height:3px;font-size:3px;line-height:3px;
                 background-color:#c7a253;">&nbsp;</td>
    </tr>

    <tr>
      <td class="body-td" style="padding:36px 40px 0 40px;">
        <p style="margin:0 0 10px 0;font-family:Georgia,'Times New Roman',serif;
                  font-size:20px;color:#163057;line-height:1.35;">
          Bonjour ${nomSanitized},
        </p>
        <p style="margin:0 0 24px 0;font-family:Arial,sans-serif;
                  font-size:15px;color:#3b4453;line-height:1.75;">
          Nous vous remercions d'avoir pris contact avec <strong>Athena Event</strong>. Votre message a bien &eacute;t&eacute; re&ccedil;u et sera trait&eacute; par notre &eacute;quipe dans les meilleurs d&eacute;lais.
        </p>

    <table role="presentation" border="0" cellpadding="0" cellspacing="0"
           width="100%" style="margin:24px 0;">
      <tr>
        <td class="card-td"
            style="background-color:#ffffff;border:1px solid #e6e9ef;
                   border-radius:10px;padding:20px 22px;">
          <p style="margin:0 0 14px 0;font-family:Arial,sans-serif;font-size:11px;
                     font-weight:700;color:#c7a253;text-transform:uppercase;
                     letter-spacing:2px;">
            R&eacute;capitulatif de votre message
          </p>

    <table role="presentation" border="0" cellpadding="0" cellspacing="0"
           width="100%" style="margin-bottom:10px;">
      <tr>
        <td valign="top" style="font-family:Arial,sans-serif;font-size:14px;
                                 color:#3b4453;line-height:1.55;vertical-align:top;">
          <strong style="color:#163057;">Sujet&nbsp;:</strong> ${sujetSanitized}
        </td>
      </tr>
    </table>

    <table role="presentation" border="0" cellpadding="0" cellspacing="0"
           width="100%" style="margin-bottom:0;">
      <tr>
        <td valign="top" style="font-family:Arial,sans-serif;font-size:14px;
                                 color:#3b4453;line-height:1.65;vertical-align:top;white-space:pre-wrap;">
          <strong style="color:#163057;">Message&nbsp;:</strong> ${messageSanitized}
        </td>
      </tr>
    </table>

        </td>
      </tr>
    </table>

    <table role="presentation" border="0" cellpadding="0" cellspacing="0"
           width="100%" style="margin:20px 0;">
      <tr>
        <td style="background-color:#faf6ec;border-radius:8px;padding:14px 18px;">
          <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;
                     color:#6d5a35;line-height:1.65;">
            <strong>D&eacute;lai de r&eacute;ponse :</strong> Nous r&eacute;pondons g&eacute;n&eacute;ralement sous 24 heures. Pour toute urgence, vous pouvez nous &eacute;crire directement &agrave; <a href="mailto:${businessInbox}" style="color:#6d5a35;">${businessInbox}</a>.
          </p>
        </td>
      </tr>
    </table>

        <table role="presentation" border="0" cellpadding="0" cellspacing="0"
               width="100%" style="margin-top:32px;">
          <tr>
            <td width="44" style="height:2px;background-color:#c7a253;
                                   font-size:1px;line-height:1px;">&nbsp;</td>
            <td style="height:1px;background-color:#ffffff;
                       font-size:1px;line-height:1px;">&nbsp;</td>
          </tr>
        </table>
        <p style="margin:18px 0 0 0;font-family:Arial,sans-serif;
                  font-size:15px;color:#3b4453;line-height:1.7;">
          Nous sommes ravis de vous compter parmi nos contacts.<br>Cordialement,
        </p>
        <p style="margin:4px 0 0 0;font-family:Georgia,'Times New Roman',serif;
                  font-size:16px;color:#163057;">
          L'&eacute;quipe Athena Event
        </p>
      </td>
    </tr>
    <tr><td style="height:36px;font-size:1px;line-height:1px;">&nbsp;</td></tr>

    <tr>
      <td class="footer-td"
          style="background-color:#122748;padding:28px 36px;text-align:center;">

        <div style="font-family:Georgia,'Times New Roman',serif;font-style:italic;
                    font-size:14px;color:#c7d0df;padding-bottom:14px;">
          Connect. Measure. Grow.
        </div>

        <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center">
          <tr><td style="width:36px;height:1px;background-color:#c7a253;
                          font-size:0;line-height:1px;">&nbsp;</td></tr>
        </table>

        <div style="font-family:Arial,sans-serif;font-size:12px;color:#8ea0bb;
                    padding-top:14px;padding-bottom:12px;line-height:1.9;">
          <a href="tel:+261383204613" style="color:#c7d0df;text-decoration:none;">+261 38 32 046 13</a>
          &nbsp;<span style="color:#c7a253;">&middot;</span>&nbsp;
          <a href="mailto:${businessInbox}" style="color:#c7d0df;text-decoration:none;">${businessInbox}</a>
          &nbsp;<span style="color:#c7a253;">&middot;</span>&nbsp;
          <a href="https://www.athena-event.com" style="color:#c7d0df;text-decoration:none;">www.athena-event.com</a>
        </div>

        <div style="font-family:Arial,sans-serif;font-size:11px;line-height:16px;
                    color:#6f83a0;">
          &copy; 2026 Athena Event by Clearmind Analytics &mdash; Antananarivo, Madagascar
        </div>

      </td>
    </tr>

      </table><!-- /email-shell -->

      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td class="below-note" align="center"
              style="padding:14px 32px 0;font-family:Arial,sans-serif;
                     font-size:11px;color:#8a93a3;line-height:1.6;">
            Cet email de confirmation a &eacute;t&eacute; envoy&eacute; automatiquement par la plateforme Athena Event.<br>
            Pour toute r&eacute;ponse, &eacute;crivez-nous &agrave; ${businessInbox}.
          </td>
        </tr>
      </table>

    </td>
  </tr>
</table>
<!--[if mso | IE]></td></tr></table><![endif]-->
</body>
</html>
            `,
        });

        return NextResponse.json(
            {
                message: 'Message envoyé avec succès ! Vous recevrez une réponse sous 24 heures.',
                success: true
            },
            { status: 200 }
        );

    } catch (error: unknown) {
        console.error('❌ Erreur envoi email:', error);
        const message = error instanceof Error ? error.message : undefined;

        return NextResponse.json(
            {
                error: 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.',
                details: process.env.NODE_ENV === 'development' ? message : undefined
            },
            { status: 500 }
        );
    }
}
