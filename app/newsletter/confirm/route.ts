import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;

  if (!token) {
    return NextResponse.redirect(`${siteUrl}/newsletter/status?result=invalid`);
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .update({ status: "confirmed", confirmed_at: new Date().toISOString() })
    .eq("confirm_token", token)
    .neq("status", "unsubscribed")
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return NextResponse.redirect(`${siteUrl}/newsletter/status?result=invalid`);
  }

  return NextResponse.redirect(`${siteUrl}/newsletter/status?result=confirmed`);
}
