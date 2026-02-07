import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-api-key",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface ReservationRequest {
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  date: string;
  time: string;
  staff_id?: string;
  product_id?: string;
  notes?: string;
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
    const body: ReservationRequest = await req.json();

    if (!body.customer_name || !body.date || !body.time) {
      return new Response(
        JSON.stringify({ error: "customer_name, date, and time are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate end time based on product duration
    let endTime: string | null = null;
    let durationMinutes = 60; // Default

    if (body.product_id) {
      const { data: product } = await supabase
        .from("products")
        .select("duration_minutes")
        .eq("id", body.product_id)
        .eq("user_id", userId)
        .maybeSingle();
      
      if (product) {
        durationMinutes = product.duration_minutes;
      }
    }

    // Calculate end time
    const timeParts = body.time.split(":");
    const startMinutes = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
    const endMinutes = startMinutes + durationMinutes;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    endTime = `${endHours.toString().padStart(2, "0")}:${endMins.toString().padStart(2, "0")}`;

    // Validate staff_id belongs to user
    if (body.staff_id) {
      const { data: staff, error: staffError } = await supabase
        .from("staff_members")
        .select("id")
        .eq("id", body.staff_id)
        .eq("user_id", userId)
        .maybeSingle();

      if (staffError || !staff) {
        return new Response(
          JSON.stringify({ error: "Invalid staff_id" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Check for conflicting reservations
    if (body.staff_id) {
      const { data: conflicts } = await supabase
        .from("reservations")
        .select("id")
        .eq("user_id", userId)
        .eq("staff_member_id", body.staff_id)
        .eq("date", body.date)
        .neq("status", "cancelled")
        .gte("end_time", body.time)
        .lte("time", endTime);

      if (conflicts && conflicts.length > 0) {
        return new Response(
          JSON.stringify({ error: "Time slot is already booked" }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Create the reservation
    const { data: reservation, error: reservationError } = await supabase
      .from("reservations")
      .insert({
        user_id: userId,
        customer_name: body.customer_name,
        customer_phone: body.customer_phone,
        customer_email: body.customer_email,
        date: body.date,
        time: body.time,
        end_time: endTime,
        staff_member_id: body.staff_id,
        product_id: body.product_id,
        status: "confirmed",
        source: "voice_agent",
        notes: body.notes,
      })
      .select()
      .single();

    if (reservationError) throw reservationError;

    // Create or update contact
    if (body.customer_phone || body.customer_email) {
      const { data: existingContact } = await supabase
        .from("contacts")
        .select("id, booking_count")
        .eq("user_id", userId)
        .or(`phone.eq.${body.customer_phone || "null"},email.eq.${body.customer_email || "null"}`)
        .maybeSingle();

      if (existingContact) {
        await supabase
          .from("contacts")
          .update({
            name: body.customer_name,
            phone: body.customer_phone,
            email: body.customer_email,
            booking_count: (existingContact.booking_count || 0) + 1,
            last_visit: body.date,
          })
          .eq("id", existingContact.id);
      } else {
        await supabase.from("contacts").insert({
          user_id: userId,
          name: body.customer_name,
          phone: body.customer_phone,
          email: body.customer_email,
          booking_count: 1,
          last_visit: body.date,
        });
      }
    }

    // Format date for response
    const dateObj = new Date(body.date);
    const formattedDate = dateObj.toLocaleDateString("de-DE", {
      day: "numeric",
      month: "long",
    });

    return new Response(
      JSON.stringify({
        success: true,
        reservation_id: reservation.id,
        message: `Termin am ${formattedDate} um ${body.time} Uhr bestätigt.`,
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
