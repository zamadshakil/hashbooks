import type { APIRoute } from 'astro';

export const prerender = false; // Runs on demand

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, phone, company, message, subject, services, budget, platforms, transactions } = data;

    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: 'Name and email are required fields.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const brevoApiKey = import.meta.env.BREVO_API_KEY || process.env.BREVO_API_KEY;

    if (!brevoApiKey || brevoApiKey === 'YOUR_BREVO_API_KEY_HERE') {
      console.error('Brevo API key is missing or not configured.');
      return new Response(
        JSON.stringify({ error: 'Mail server configuration error. Please contact the administrator.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Build details HTML
    let detailsHtml = '';
    if (phone) detailsHtml += `<p><strong>Phone:</strong> ${phone}</p>`;
    if (company) detailsHtml += `<p><strong>Company:</strong> ${company}</p>`;
    if (services && services.length > 0) {
      detailsHtml += `<p><strong>Requested Services:</strong> ${services.join(', ')}</p>`;
    }
    if (transactions) detailsHtml += `<p><strong>Monthly Transactions:</strong> ${transactions}</p>`;
    if (platforms && platforms.length > 0) {
      detailsHtml += `<p><strong>Accounting Software/Platforms:</strong> ${platforms.join(', ')}</p>`;
    }
    if (budget) detailsHtml += `<p><strong>Estimated Monthly Budget:</strong> ${budget}</p>`;

    const mailBody = {
      sender: { name: 'Hashbooks Website', email: 'contact@hashbooks.site' },
      to: [{ email: 'contact@hashbooks.site', name: 'Hashbooks Team' }],
      replyTo: { email, name },
      subject: subject || 'New Form Submission from Hashbooks Website',
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333333; }
            .container { padding: 20px; border: 1px solid #dddddd; border-radius: 5px; max-width: 600px; }
            .header { background-color: #072049; color: #ffffff; padding: 15px; border-radius: 5px 5px 0 0; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { font-size: 12px; color: #777777; margin-top: 20px; text-align: center; border-top: 1px solid #dddddd; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Inquiry Received</h2>
            </div>
            <div class="content">
              <p><strong>From:</strong> ${name} (&lt;${email}&gt;)</p>
              ${detailsHtml}
              <hr style="border: 0; border-top: 1px solid #cccccc; margin: 20px 0;" />
              <p><strong>Message / Requirements:</strong></p>
              <p style="white-space: pre-wrap; background-color: #ffffff; padding: 15px; border: 1px solid #eeeeee; border-radius: 4px;">${message}</p>
            </div>
            <div class="footer">
              This email was sent automatically from the contact form on Hashbooks.site.
            </div>
          </div>
        </body>
        </html>
      `
    };

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'api-key': brevoApiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mailBody)
    });

    if (!response.ok) {
      const errorResponseText = await response.text();
      console.error('Brevo API Error:', errorResponseText);
      return new Response(
        JSON.stringify({ error: `Failed to send email via Brevo.` }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('API Endpoint Error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error occurred.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
