import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { paypalEmail, amount, clientId, clientSecret } = body

    if (!paypalEmail || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: "PayPal credentials not provided. Please configure them in the Profile settings." },
        { status: 400 },
      )
    }

    const paypalClientId = clientId.trim()
    const paypalClientSecret = clientSecret.trim()

    console.log("[v0] ===== PayPal Instant Payout =====")
    console.log("[v0] Client ID starts with:", paypalClientId.substring(0, 15))
    console.log("[v0] Amount:", amount, "GBP")
    console.log("[v0] Recipient:", paypalEmail)

    const isSandbox = paypalClientId.startsWith("AZa") || paypalClientId.startsWith("Aca")
    const baseUrl = isSandbox ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com"

    console.log("[v0] Environment:", isSandbox ? "SANDBOX" : "LIVE")
    console.log("[v0] Base URL:", baseUrl)

    const auth = Buffer.from(`${paypalClientId}:${paypalClientSecret}`).toString("base64")

    // Step 1: Get access token
    const tokenResponse = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        "Accept-Language": "en_US",
      },
      body: "grant_type=client_credentials",
    })

    const tokenText = await tokenResponse.text()
    console.log("[v0] Token response status:", tokenResponse.status)

    if (!tokenResponse.ok) {
      console.error("[v0] ❌ PayPal authentication failed")
      console.error("[v0] Response:", tokenText)
      return NextResponse.json(
        {
          error: "PayPal authentication failed. Please verify your Client ID and Client Secret are correct.",
          details: tokenText,
        },
        { status: 401 },
      )
    }

    const tokenData = JSON.parse(tokenText)
    console.log("[v0] ✓ Successfully authenticated with PayPal")

    // Step 2: Create payout
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const requestId = `payout_${Date.now()}_${Math.random().toString(36).substring(7)}`

    const payoutBody = {
      sender_batch_header: {
        sender_batch_id: batchId,
        email_subject: "You have received a payout!",
        email_message: "Your commission from Hotel Rating App has been sent.",
      },
      items: [
        {
          recipient_type: "EMAIL",
          amount: {
            value: Number(amount).toFixed(2),
            currency: "GBP",
          },
          receiver: paypalEmail,
          note: "Hotel rating commission withdrawal",
          sender_item_id: `item_${Date.now()}`,
        },
      ],
    }

    console.log("[v0] Sending payout request...")

    const payoutResponse = await fetch(`${baseUrl}/v1/payments/payouts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": requestId,
      },
      body: JSON.stringify(payoutBody),
    })

    const payoutText = await payoutResponse.text()
    console.log("[v0] Payout response status:", payoutResponse.status)

    if (!payoutResponse.ok) {
      let errorData
      try {
        errorData = JSON.parse(payoutText)
      } catch {
        errorData = { message: payoutText }
      }

      console.error("[v0] ❌ Payout failed:", errorData)

      if (errorData.name === "AUTHORIZATION_ERROR" || payoutResponse.status === 403) {
        return NextResponse.json(
          {
            error: "PayPal Payouts not enabled for your account.",
            details:
              "Please enable Payouts:\n1. Go to developer.paypal.com\n2. My Apps & Credentials\n3. Select your LIVE app\n4. Enable 'Payouts' checkbox\n5. Save",
            debugId: errorData.debug_id,
          },
          { status: 403 },
        )
      }

      return NextResponse.json(
        {
          error: errorData.message || "Payout failed",
          details: errorData.details || payoutText,
          debugId: errorData.debug_id,
        },
        { status: payoutResponse.status },
      )
    }

    const payoutData = JSON.parse(payoutText)
    console.log("[v0] ✓ Payout successful!")
    console.log("[v0] Batch ID:", payoutData.batch_header?.payout_batch_id)
    console.log("[v0] Status:", payoutData.batch_header?.batch_status)

    return NextResponse.json({
      success: true,
      batchId: payoutData.batch_header?.payout_batch_id,
      status: payoutData.batch_header?.batch_status,
      message: `£${amount} sent to ${paypalEmail}`,
    })
  } catch (error) {
    console.error("[v0] ❌ Unexpected error:", error)
    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 })
  }
}
