import { NextResponse } from 'next/server';

export async function GET() {
  const GITHUB_APK_URL =
    'https://github.com/Younesouani/Macro-Terminal-Apk/releases/download/V2.0.0/Macro.Terminal.v2.0.0.apk';

  try {
    const response = await fetch(GITHUB_APK_URL);

    if (!response.ok) {
      return new NextResponse('Failed to fetch APK', { status: response.status });
    }

    const fileBuffer = await response.arrayBuffer();

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.android.package-archive',
        'Content-Disposition': 'attachment; filename="MacroTerminal-v2.0.0.apk"',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
