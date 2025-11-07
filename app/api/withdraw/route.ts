import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { paypalEmail, amount } = body

    if (!paypalEmail || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const clientIdOptions = {
      PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
      PAYPAl_CLIENT_ID: process.env.PAYPAl_CLIENT_ID,
      client_ID: process.env.client_ID,
      Client_ID: process.env.Client_ID,
    }

    const clientSecretOptions = {
      PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,
      Client_Secret: process.env.Client_Secret,
      client_Secret: process.env.client_Secret,
      PAYPAL_SECRET: process.env.PAYPAL_SECRET,
    }

    console.log("[v0] Available Client ID variables:")
    Object.entries(clientIdOptions).forEach(([key, value]) => {
      console.log(`  ${key}: ${value ? `${value.substring(0, 15)}...` : "NOT SET"}`)
    })

    console.log("[v0] Available Client Secret variables:")
    Object.entries(clientSecretOptions).forEach(([key, value]) => {
      console.log(`  ${key}: ${value ? "SET" : "NOT SET"}`)
    })

    // Get the first available credential
    const clientId = Object.values(clientIdOptions)
      .find((v) => v)
      ?.trim()
    const clientSecret = Object.values(clientSecretOptions)
      .find((v) => v)
      ?.trim()

    if (!clientId || !clientSecret) {
      console.error("[v0] PayPal credentials not configured")
      return NextResponse.json(
        {
          error:
            "PayPal credentials not found in environment variables. Please add them with one of these names: PAYPAL_CLIENT_ID, client_ID",
        },
        { status: 500 },
      )
    }

    console.log("[v0] Using Client ID:", clientId.substring(0, 20) + "...")
    console.log("[v0] Using Client Secret:", clientSecret.substring(0, 10) + "...")

    const isSandbox = clientId.includes("sandbox") || clientId.startsWith("AZa") || clientId.startsWith("Aca")
    const baseUrl = isSandbox ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com"

    console.log("[v0] ===== PayPal Instant Payout =====")
    console.log("[v0] Environment:", isSandbox ? "SANDBOX" : "LIVE")
    console.log("[v0] Base URL:", baseUrl)
    console.log("[v0] Amount:", amount, "GBP")
    console.log("[v0] Recipient:", paypalEmail)

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
    console.log("[v0] Auth header length:", auth.length)

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
    console.log("[v0] Token response:", tokenText.substring(0, 200))

    if (!tokenResponse.ok) {
      console.error("[v0] ❌ PayPal authentication failed")
      return NextResponse.json(
        {
          error: "PayPal authentication failed",
          details:
            "Please verify:\n1. Your credentials are REST API credentials (not NVP/SOAP)\n2. Client ID and Secret are correct\n3. No extra spaces in the credentials\n4. Credentials match the environment (Live/Sandbox)",
          response: tokenText,
        },
        { status: 401 },
      )
    }

    const tokenData = JSON.parse(tokenText)
    console.log("[v0] ✓ Successfully authenticated with PayPal")

    const requestId = `payout_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const batchId = `batch_${Date.now()}`

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

    console.log("[v0] Sending instant payout request...")

    const payoutResponse = await fetch(`${baseUrl}/v1/payments/payouts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": requestId,
      },
      body: JSON.stringify(payoutBody),
    })

    const responseText = await payoutResponse.text()

    if (!payoutResponse.ok) {
      let errorData
      try {
        errorData = JSON.parse(responseText)
      } catch {
        errorData = { message: responseText }
      }

      console.error("[v0] ❌ Payout failed:", errorData)

      if (errorData.name === "AUTHORIZATION_ERROR" || payoutResponse.status === 403) {
        return NextResponse.json(
          {
            error: "PayPal Payouts not enabled",
            details:
              "Please enable Payouts in your PayPal app:\n1. Go to developer.paypal.com\n2. Select 'My Apps & Credentials'\n3. Choose your app under 'Live' tab\n4. Enable 'Payouts' checkbox\n5. Save changes",
            debugId: errorData.debug_id,
          },
          { status: 403 },
        )
      }

      return NextResponse.json(
        {
          error: errorData.message || "Payout failed",
          details: errorData.details || "Unknown error occurred",
          debugId: errorData.debug_id,
        },
        { status: payoutResponse.status },
      )
    }

    const payoutData = JSON.parse(responseText)
    console.log("[v0] ✓ Instant payout successful!")
    console.log("[v0] Batch ID:", payoutData.batch_header?.payout_batch_id)
    console.log("[v0] Status:", payoutData.batch_header?.batch_status)

    return NextResponse.json({
      success: true,
      batchId: payoutData.batch_header?.payout_batch_id,
      status: payoutData.batch_header?.batch_status,
      message: `£${amount} sent instantly to ${paypalEmail}`,
    })
  } catch (error) {
    console.error("[v0] ❌ Unexpected error:", error)
    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 })
  }
}
