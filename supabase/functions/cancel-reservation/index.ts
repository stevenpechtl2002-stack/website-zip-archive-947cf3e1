import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-api-key",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface CancelRequest {
  reservation_id?: string;
  customer_phone?: string;
  date?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Validate API key
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API key required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Hash the API key
    const encoder = new TextEncoder();
    const data = encoder.encode(apiKey);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const keyHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    // Look up user_id
    const { data: userId } = await supabase.rpc("get_user_id_from_api_key", { _key_hash: keyHash });
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Invalid API key" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update last used timestamp
    await supabase.rpc("update_api_key_last_used", { _key_hash: keyHash });

    // Parse request body
    const body: CancelRequest = await req.json();

    let reservationQuery = supabase
      .from("reservations")
      .select("*")
      .eq("user_id", userId)
      .neq("status", "cancelled");

    if (body.reservation_id) {
      reservationQuery = reservationQuery.eq("id", body.reservation_id);
    } else if (body.customer_phone && body.date) {
      reservationQuery = reservationQuery
        .eq("customer_phone", body.customer_phone)
        .eq("date", body.date);
    } else {
      return new Response(
        JSON.stringify({ error: "Either reservation_id or (customer_phone + date) required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: reservations, error: findError } = await reservationQuery;

    if (findError) throw findError;

    if (!reservations || reservations.length === 0) {
      return new Response(
        JSON.stringify({ error: "Reservation not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Cancel all matching reservations (usually just one)
    const ids = reservations.map(r => r.id);
    const { error: updateError } = await supabase
      .from("reservations")
      .update({ status: "cancelled" })
      .in("id", ids);

    if (updateError) throw updateError;

    const reservation = reservations[0];
    const dateObj = new Date(reservation.date);
    const formattedDate = dateObj.toLocaleDateString("de-DE", {
      day: "numeric",
      month: "long",
    });

    return new Response(
      JSON.stringify({
        success: true,
        cancelled_count: reservations.length,
        message: `Termin am ${formattedDate} um ${reservation.time} Uhr wurde storniert.`,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
