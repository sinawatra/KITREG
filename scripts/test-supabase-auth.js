// Test script to verify Supabase authentication endpoints
const SUPABASE_URL = "https://tfipbukcioneaaqadkji.supabase.co"
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function testSupabaseAuthEndpoints() {
  console.log("🔍 Testing Supabase Authentication Endpoints...")
  console.log("Supabase URL:", SUPABASE_URL)
  console.log("Anon Key exists:", !!SUPABASE_ANON_KEY)
  console.log("=".repeat(50))

  // Test 1: Check if auth endpoints are accessible
  console.log("📡 Test 1: Checking auth endpoint accessibility...")

  try {
    // Test the base auth endpoint
    const response = await fetch(`${SUPABASE_URL}/auth/v1/settings`, {
      method: "GET",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        "Content-Type": "application/json",
      },
    })

    console.log("Auth settings response status:", response.status)

    if (response.ok) {
      const data = await response.json()
      console.log("✅ Auth endpoint is accessible")
      console.log("Available providers:", data.external || "None configured")
    } else {
      console.log("❌ Auth endpoint not accessible")
      console.log("Response:", await response.text())
    }
  } catch (error) {
    console.log("❌ Error accessing auth endpoint:", error.message)
  }

  console.log("\n" + "=".repeat(50))

  // Test 2: Try to sign up a test user
  console.log("📝 Test 2: Testing sign up endpoint...")

  const testEmail = `test-${Date.now()}@example.com`
  const testPassword = "TestPassword123!"

  try {
    const signUpResponse = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        data: {
          full_name: "Test User",
          student_id: "TEST001",
        },
      }),
    })

    console.log("Sign up response status:", signUpResponse.status)

    if (signUpResponse.ok) {
      const signUpData = await signUpResponse.json()
      console.log("✅ Sign up endpoint works!")
      console.log("User created:", signUpData.user?.email)
      console.log("Confirmation required:", !signUpData.session)
    } else {
      const errorData = await signUpResponse.json()
      console.log("❌ Sign up failed")
      console.log("Error:", errorData.msg || errorData.message || "Unknown error")
    }
  } catch (error) {
    console.log("❌ Error testing sign up:", error.message)
  }

  console.log("\n" + "=".repeat(50))

  // Test 3: Try to sign in (this will likely fail since we just created the user)
  console.log("🔐 Test 3: Testing sign in endpoint...")

  try {
    const signInResponse = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    })

    console.log("Sign in response status:", signInResponse.status)

    if (signInResponse.ok) {
      const signInData = await signInResponse.json()
      console.log("✅ Sign in endpoint works!")
      console.log("Access token received:", !!signInData.access_token)
    } else {
      const errorData = await signInResponse.json()
      console.log("⚠️  Sign in failed (expected if email confirmation required)")
      console.log("Error:", errorData.msg || errorData.message || "Unknown error")
    }
  } catch (error) {
    console.log("❌ Error testing sign in:", error.message)
  }

  console.log("\n" + "=".repeat(50))

  // Test 4: Check Google OAuth configuration
  console.log("🔍 Test 4: Checking Google OAuth configuration...")

  try {
    const oauthUrl = `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=http://localhost:3000/auth/callback`
    const oauthResponse = await fetch(oauthUrl, {
      method: "GET",
      headers: {
        apikey: SUPABASE_ANON_KEY,
      },
      redirect: "manual", // Don't follow redirects
    })

    console.log("OAuth response status:", oauthResponse.status)

    if (oauthResponse.status === 302 || oauthResponse.status === 301) {
      console.log("✅ Google OAuth is configured")
      console.log("Redirect location:", oauthResponse.headers.get("location"))
    } else {
      console.log("❌ Google OAuth may not be configured properly")
    }
  } catch (error) {
    console.log("❌ Error testing Google OAuth:", error.message)
  }

  console.log("\n" + "🏁 Test completed!")
}

// Run the test
testSupabaseAuthEndpoints().catch(console.error)
