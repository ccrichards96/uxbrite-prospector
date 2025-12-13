import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'reCAPTCHA token is required' },
        { status: 400 }
      );
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
      console.error('RECAPTCHA_SECRET_KEY is not configured');
      return NextResponse.json(
        { success: false, error: 'reCAPTCHA is not configured' },
        { status: 500 }
      );
    }

    // Verify the token with Google
    const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify';
    const response = await fetch(verificationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });

    const data = await response.json();

    // reCAPTCHA v2 just returns success: true/false (no score like v3)
    if (data.success) {
      return NextResponse.json({
        success: true,
      });
    } else {
      console.log('reCAPTCHA verification failed:', data);
      return NextResponse.json(
        {
          success: false,
          error: 'reCAPTCHA verification failed',
          errorCodes: data['error-codes'],
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
