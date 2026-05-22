import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { reference, name, businessName, logoUrl, amount } = await req.json()

    // 1. Verify payment with Paystack
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    )

    const paystackData = await paystackRes.json()

    if (!paystackData.status || paystackData.data.status !== 'success') {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      )
    }

    // 2. Confirm amount matches (amount from Paystack is in kobo)
    const paidAmount = paystackData.data.amount / 100
    if (paidAmount < amount) {
      return NextResponse.json(
        { error: 'Amount mismatch' },
        { status: 400 }
      )
    }

    // 3. Get supporter email from Paystack response
    const supporterEmail = paystackData.data.customer.email

    // 4. Save supporter to Supabase
    const { data, error } = await supabase
      .from('supporters')
      .insert([
        {
          name,
          business_name: businessName,
          logo_url: logoUrl,
          amount: paidAmount,
          paystack_reference: reference,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save supporter' },
        { status: 500 }
      )
    }

    // 5. Send appreciation email
    const formattedAmount = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(paidAmount)

    await resend.emails.send({
      from: 'GREX 8.0 <no-reply@grexconcertour.com.ng>', // replace with your verified domain
      to: supporterEmail,
      subject: '🙏 Thank you for supporting Grace Explosion 8.0!',
      html: `
        <!DOCTYPE html>
        <html>
          <body style="margin:0;padding:0;background-color:#f9f9f9;font-family:Arial,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f9f9;padding:40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);max-width:600px;width:100%;">
                    
                    <!-- Header -->
                    <tr>
                      <td style="background-color:#050063;padding:32px;text-align:center;">
                        <h1 style="color:#ffffff;margin:0;font-size:24px;letter-spacing:1px;">GRACE EXPLOSION 8.0</h1>
                        <p style="color:orange;margin:6px 0 0;font-size:14px;font-weight:600;">A Night of Worship & Thanksgiving · Osogbo</p>
                      </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                      <td style="padding:40px 36px;">
                        <p style="font-size:18px;font-weight:600;color:#171717;margin:0 0 12px;">Dear ${name},</p>
                        <p style="font-size:15px;color:#444;line-height:1.7;margin:0 0 20px;">
                          We are deeply grateful for your generous support of <strong>Grace Explosion 8.0</strong>. 
                          Your contribution of <strong style="color:orange;">${formattedAmount}</strong> is making this 
                          night of worship and thanksgiving possible.
                        </p>
                        <p style="font-size:15px;color:#444;line-height:1.7;margin:0 0 20px;">
                          Your name${businessName ? ` and <strong>${businessName}</strong>` : ''} will be 
                          celebrated among our supporters on the concert website. We believe God will 
                          honour your sacrifice and generosity.
                        </p>

                        <!-- Amount box -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
                          <tr>
                            <td style="background-color:#fff8ed;border:1px solid #fac775;border-radius:10px;padding:20px;text-align:center;">
                              <p style="margin:0;font-size:13px;color:#854f0b;font-weight:500;text-transform:uppercase;letter-spacing:.05em;">Your Contribution</p>
                              <p style="margin:8px 0 0;font-size:2rem;font-weight:700;color:orange;">${formattedAmount}</p>
                              <p style="margin:6px 0 0;font-size:12px;color:#aaa;">Reference: ${reference}</p>
                            </td>
                          </tr>
                        </table>

                        <p style="font-size:15px;color:#444;line-height:1.7;margin:0 0 8px;">
                          We look forward to seeing you at the concert. Come and experience 
                          the power of God's presence firsthand.
                        </p>
                        <p style="font-size:15px;color:#444;line-height:1.7;margin:0;">
                          With love and gratitude,<br/>
                          <strong style="color:#050063;">The GREX 8.0 Team</strong><br/>
                        </p>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background-color:#f5f5f5;padding:20px 36px;text-align:center;border-top:1px solid #eee;">
                        <p style="margin:0;font-size:12px;color:#999;">
                          This is an automated message. Please do not reply to this email.<br/>
                          © 2025 Standard Life Int'l Church · Osogbo & Lekki
                        </p>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    })

    return NextResponse.json({ success: true, supporter: data })
  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}