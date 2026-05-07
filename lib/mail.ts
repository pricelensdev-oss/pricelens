import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPriceAlertEmail(
  to: string,
  productName: string,
  targetPrice: number,
  currentPrice: number,
  productUrl: string,
  productImage: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'PriceLens <alerts@pricelens.app>',
      to: [to],
      subject: `🔥 Price Drop Alert: ${productName} hit your target!`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Price Drop Alert</title>
        </head>
        <body style="margin:0;padding:0;background-color:#0d0d0d;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d0d0d;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#1a1a1a;border-radius:16px;border:1px solid #2a2a2a;overflow:hidden;">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background:linear-gradient(135deg,#0d0d0d 0%,#1a1a2e 100%);padding:32px;text-align:center;border-bottom:1px solid #00d4aa30;">
                      <div style="display:inline-block;">
                        <span style="font-size:28px;font-weight:900;letter-spacing:-0.05em;color:#00d4aa;">Price</span><span style="font-size:28px;font-weight:900;letter-spacing:-0.05em;color:#ffffff;">Lens</span>
                      </div>
                      <p style="margin:8px 0 0;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#00d4aa80;">Agentic Intel Alerts</p>
                    </td>
                  </tr>

                  <!-- Alert Badge -->
                  <tr>
                    <td style="padding:32px 32px 0;text-align:center;">
                      <div style="display:inline-block;background:linear-gradient(135deg,#00d4aa20,#00d4aa10);border:1px solid #00d4aa40;border-radius:100px;padding:8px 20px;margin-bottom:20px;">
                        <span style="font-size:12px;font-weight:800;letter-spacing:0.15em;text-transform:uppercase;color:#00d4aa;">🎯 Target Price Reached</span>
                      </div>
                      <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#ffffff;line-height:1.3;">${productName}</h1>
                      <p style="margin:0;font-size:15px;color:#888888;">dropped to your target price.</p>
                    </td>
                  </tr>

                  <!-- Product Image -->
                  <tr>
                    <td style="padding:24px 32px;">
                      <div style="border-radius:12px;overflow:hidden;border:1px solid #2a2a2a;background:#111111;text-align:center;padding:16px;">
                        <img src="${productImage}" alt="${productName}" style="max-width:280px;width:100%;height:auto;border-radius:8px;display:block;margin:0 auto;" />
                      </div>
                    </td>
                  </tr>

                  <!-- Price Comparison -->
                  <tr>
                    <td style="padding:0 32px 24px;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td width="48%" style="background:#111111;border:1px solid #2a2a2a;border-radius:12px;padding:20px;text-align:center;vertical-align:top;">
                            <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#555555;">Your Target</p>
                            <p style="margin:0;font-size:26px;font-weight:900;color:#888888;">₹${targetPrice.toLocaleString('en-IN')}</p>
                          </td>
                          <td width="4%" style="text-align:center;vertical-align:middle;">
                            <span style="font-size:20px;color:#444;">→</span>
                          </td>
                          <td width="48%" style="background:linear-gradient(135deg,#00d4aa15,#00d4aa05);border:1px solid #00d4aa40;border-radius:12px;padding:20px;text-align:center;vertical-align:top;">
                            <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#00d4aa;">Current Best</p>
                            <p style="margin:0;font-size:26px;font-weight:900;color:#00d4aa;">₹${currentPrice.toLocaleString('en-IN')}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- CTA -->
                  <tr>
                    <td style="padding:0 32px 32px;text-align:center;">
                      <a href="${productUrl}" style="display:inline-block;background:linear-gradient(135deg,#00d4aa,#00b899);color:#000000;padding:16px 40px;border-radius:12px;text-decoration:none;font-weight:800;font-size:16px;letter-spacing:0.02em;">
                        View Deal on PriceLens →
                      </a>
                      <p style="margin:16px 0 0;font-size:13px;color:#555555;">Prices can change quickly. Act fast!</p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background:#111111;border-top:1px solid #2a2a2a;padding:20px 32px;text-align:center;">
                      <p style="margin:0 0 4px;font-size:12px;color:#444444;">© 2026 PriceLens. All rights reserved.</p>
                      <p style="margin:0;font-size:12px;color:#333333;">You received this because you set a price alert for this product.</p>
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

    if (error) {
      console.error("Resend Error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Failed to send email", err);
    return { success: false, error: err };
  }
}
