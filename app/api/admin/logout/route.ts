import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import { Admin } from '@/lib/db/models';
import { verifyRefreshToken, clearAuthCookies } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refreshToken')?.value;

    if (refreshToken) {
      await connectDB();
      const decoded = verifyRefreshToken(refreshToken);
      if (decoded) {
        // Revoke token in DB
        await Admin.findByIdAndUpdate(decoded.userId, { $unset: { refreshToken: 1 } });
      }
    }

    const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });

    // Clear Cookies
    const cookies = clearAuthCookies();
    cookies.forEach(cookie => {
      response.headers.append('Set-Cookie', cookie);
    });

    return response;
  } catch (error: any) {
    console.error('Logout Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
