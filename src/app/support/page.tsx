"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import Header from "@/components/header"

// ─── Types ───────────────────────────────────────────────────────────────────
interface Supporter {
  id: string
  name: string
  business_name: string
  logo_url: string | null
  amount: number
  created_at: string
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (options: {
        key: string
        email: string
        amount: number
        currency: string
        ref: string
        channels?: string[]
        onClose: () => void
        callback: (response: { reference: string }) => void
      }) => { openIframe: () => void }
    }
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function generateRef() {
  return `GREX_${Date.now()}_${Math.random().toString(36).slice(2, 7).toUpperCase()}`
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SupportPage() {
  const [name, setName] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [email, setEmail] = useState("")
  const [amount, setAmount] = useState("")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const [supporters, setSupporters] = useState<Supporter[]>([])
  const [loadingSupporters, setLoadingSupporters] = useState(true)

  // Store pending payment data so the sync callback can trigger async work
  const pendingPayment = useRef<{
    name: string
    businessName: string
    logoUrl: string | null
    amount: number
  } | null>(null)

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://js.paystack.co/v1/inline.js"
    script.async = true
    document.body.appendChild(script)
    return () => { document.body.removeChild(script) }
  }, [])

  useEffect(() => {
    fetchSupporters()
  }, [])

  async function fetchSupporters() {
    setLoadingSupporters(true)
    const { data, error } = await supabase
      .from("supporters")
      .select("*")
      .order("created_at", { ascending: false })
    if (!error && data) setSupporters(data)
    setLoadingSupporters(false)
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setError("Logo must be under 2MB")
      return
    }
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
    setError("")
  }

  async function uploadLogo(file: File): Promise<string | null> {
    const ext = file.name.split(".").pop()
    const fileName = `logos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error } = await supabase.storage
      .from("supporter-logos")
      .upload(fileName, file, { cacheControl: "3600", upsert: false })

    if (error) {
      console.error("Logo upload error:", error)
      return null
    }

    const { data } = supabase.storage
      .from("supporter-logos")
      .getPublicUrl(fileName)

    return data.publicUrl
  }

  // Async handler called after Paystack confirms — safe to be async
  const handlePaymentSuccess = useCallback(async (reference: string) => {
    const pending = pendingPayment.current
    if (!pending) return

    const res = await fetch("/api/verify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference,
        name: pending.name,
        businessName: pending.businessName,
        logoUrl: pending.logoUrl,
        amount: pending.amount,
      }),
    })

    const data = await res.json()

    if (!res.ok || !data.success) {
      setError(data.error || "Something went wrong after payment.")
      setLoading(false)
      return
    }

    // Reset
    pendingPayment.current = null
    setName("")
    setBusinessName("")
    setEmail("")
    setAmount("")
    setLogoFile(null)
    setLogoPreview(null)
    setSuccess(true)
    setLoading(false)
    fetchSupporters()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess(false)

    const parsedAmount = parseFloat(amount)
    if (!name || !email || !parsedAmount || parsedAmount < 100) {
      setError("Please fill all required fields. Minimum amount is ₦100.")
      return
    }

    setLoading(true)

    try {
      let logoUrl: string | null = null
      if (logoFile) {
        logoUrl = await uploadLogo(logoFile)
        if (!logoUrl) {
          setError("Logo upload failed. Please try again.")
          setLoading(false)
          return
        }
      }

      const reference = generateRef()

      // Store details for the sync callback to pick up
      pendingPayment.current = { name, businessName, logoUrl, amount: parsedAmount }

      // Paystack callback MUST be a plain sync function — async breaks it
      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        email,
        amount: parsedAmount * 100,
        currency: "NGN",
        channels: ['card', 'bank', 'ussd', 'bank_transfer', 'mobile_money'],
        ref: reference,
        onClose: () => {
          pendingPayment.current = null
          setLoading(false)
          setError("Payment was cancelled.")
        },
        callback: (response) => {
          // Sync — immediately hand off to async function
          handlePaymentSuccess(response.reference)
        },
      })

      handler.openIframe()
    } catch (err) {
      console.error(err)
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <>
      <Header />

      <main className="support-page">

        {/* ── Hero ── */}
        <section className="support-hero">
          <span className="support-eyebrow">Grace Explosion 8.0 · Osogbo</span>
          <h1>Support This Concert</h1>
          <p>
            Your generosity makes this night of worship possible. Every gift — big or small —
            matters. Supporters are publicly celebrated on this page.
          </p>
        </section>

        {/* ── Form ── */}
        <section className="support-form-section">
          <div className="support-form-card">
            <h2>Become a Supporter</h2>
            <p className="support-form-sub">Fill in your details and proceed to payment.</p>

            {success && (
              <div className="support-success-banner">
                🙌 Thank you! Your support has been received and you now appear below.
              </div>
            )}

            {error && <p className="support-error">{error}</p>}

            <form onSubmit={handleSubmit} className="support-form">
              <div className="support-form-group">
                <label>Full Name <span className="required">*</span></label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="support-form-group">
                <label>Business / Organisation Name <span className="optional">(optional)</span></label>
                <input
                  type="text"
                  placeholder="Acme Ltd."
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>

              <div className="support-form-group">
                <label>Email Address <span className="required">*</span></label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="support-form-group">
                <label>Amount (₦) <span className="required">*</span></label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  min={100}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="support-form-group">
                <label>Business Logo / Photo <span className="optional">(optional)</span></label>
                <div
                  className="logo-upload-area"
                  onClick={() => fileRef.current?.click()}
                >
                  {logoPreview ? (
                    <Image
                      src={logoPreview}
                      alt="Logo preview"
                      width={80}
                      height={80}
                      style={{ objectFit: "contain", borderRadius: 8, width: 80, height: "auto" }}
                    />
                  ) : (
                    <div className="logo-upload-placeholder">
                      <span>📁</span>
                      <p>Click to upload logo</p>
                      <small>PNG, JPG · Max 2MB</small>
                    </div>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleLogoChange}
                />
              </div>

              <button type="submit" className="support-pay-btn" disabled={loading}>
                {loading ? "Processing..." : "Proceed to Payment →"}
              </button>
            </form>
          </div>
        </section>

        {/* ── Supporters Section ── */}
        <section className="supporters-section">
          <div className="supporters-header">
            <h2>Our Supporters</h2>
            <p>These amazing people and organisations are making GREX 8.0 happen.</p>
          </div>

          {loadingSupporters ? (
            <div className="supporters-loading">Loading supporters...</div>
          ) : supporters.length === 0 ? (
            <div className="supporters-empty">
              <p>No supporters yet. Be the first! 🙏</p>
            </div>
          ) : (
            <div className="supporters-grid">
              {supporters.map((s) => (
                <div key={s.id} className="supporter-card">
                  <div className="supporter-logo">
                    {s.logo_url ? (
                      <Image
                        src={s.logo_url}
                        alt={s.business_name || s.name}
                        width={60}
                        height={60}
                        style={{ objectFit: "contain", borderRadius: 8, width: 60, height: "auto" }}
                      />
                    ) : (
                      <div className="supporter-avatar">
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="supporter-info">
                    <h4>{s.name}</h4>
                    {s.business_name && <p className="supporter-biz">{s.business_name}</p>}
                    <div className="supporter-meta">
                      <span className="supporter-amount">{formatAmount(s.amount)}</span>
                      <span className="supporter-date">{formatDate(s.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </>
  )
}