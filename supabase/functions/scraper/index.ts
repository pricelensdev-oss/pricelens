// Supabase Edge Function: PriceLens Stealth Scraper
// This function uses Mobile User-Agents to fetch prices from Amazon/Flipkart India.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { productId, url, platform } = await req.json()

    console.log(`Auditing ${platform} for product: ${productId}`)

    // Stealth fetch using Mobile User-Agent
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        "Accept-Language": "en-IN,en-GB;q=0.9,en;q=0.8",
      }
    })

    const html = await response.text()
    
    // Expert Parsing Logic (Simplified for skeleton)
    // On Amazon.in mobile, prices are often in a <span> with class "a-price-whole"
    // On Flipkart.com mobile, they are in a <div> with class "_30jeq3 _16Jk6d"
    
    let currentPrice = 0
    if (platform === 'amazon') {
      const match = html.match(/class="a-price-whole">([\d,]+)/)
      if (match) currentPrice = parseInt(match[1].replace(/,/g, ''))
    } else if (platform === 'flipkart') {
      const match = html.match(/class="_30jeq3 _16Jk6d">₹([\d,]+)/)
      if (match) currentPrice = parseInt(match[1].replace(/,/g, ''))
    }

    if (currentPrice > 0) {
      console.log(`Detected price drop/update: ₹${currentPrice}`)
      // Update database using Service Role Key
      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      await supabaseAdmin
        .from('PriceHistory')
        .insert({
          productId,
          price: currentPrice,
          platform: platform,
          date: new Date().toISOString().split('T')[0]
        })
    }

    return new Response(
      JSON.stringify({ success: true, price: currentPrice }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
