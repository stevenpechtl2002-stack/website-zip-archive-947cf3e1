import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-api-key",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

interface Slot {
  time: string;
  staff_name: string;
  staff_id: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
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

    // Hash the API key for lookup
    const encoder = new TextEncoder();
    const data = encoder.encode(apiKey);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const keyHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    // Look up user_id from API key
    const { data: userId } = await supabase.rpc("get_user_id_from_api_key", { _key_hash: keyHash });
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Invalid API key" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update last used timestamp
    await supabase.rpc("update_api_key_last_used", { _key_hash: keyHash });

    // Parse query parameters
    const url = new URL(req.url);
    const dateStr = url.searchParams.get("date");
    const staffId = url.searchParams.get("staff_id");
    const duration = parseInt(url.searchParams.get("duration") || "60");

    if (!dateStr) {
      return new Response(
        JSON.stringify({ error: "Date parameter required (YYYY-MM-DD)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse date and get day of week (0 = Sunday, 6 = Saturday)
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();

    // Get staff members
    let staffQuery = supabase
      .from("staff_members")
      .select("id, name, color")
      .eq("user_id", userId)
      .eq("is_active", true);

    if (staffId) {
      staffQuery = staffQuery.eq("id", staffId);
    }

    const { data: staffMembers, error: staffError } = await staffQuery;
    if (staffError) throw staffError;

    if (!staffMembers || staffMembers.length === 0) {
      return new Response(
        JSON.stringify({ success: true, date: dateStr, slots: [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const staffIds = staffMembers.map(s => s.id);

    // Get shifts for this day of week
    const { data: shifts, error: shiftsError } = await supabase
      .from("staff_shifts")
      .select("*")
      .in("staff_member_id", staffIds)
      .eq("day_of_week", dayOfWeek)
      .eq("is_working", true);

    if (shiftsError) throw shiftsError;

    // Get exceptions for this date
    const { data: exceptions, error: exceptionsError } = await supabase
      .from("shift_exceptions")
      .select("*")
      .in("staff_member_id", staffIds)
      .eq("exception_date", dateStr);

    if (exceptionsError) throw exceptionsError;

    // Get existing reservations for this date
    const { data: reservations, error: reservationsError } = await supabase
      .from("reservations")
      .select("*")
      .eq("user_id", userId)
      .eq("date", dateStr)
      .neq("status", "cancelled");

    if (reservationsError) throw reservationsError;

    // Calculate available slots
    const slots: Slot[] = [];
    const slotDuration = 30; // 30 minute intervals

    for (const staff of staffMembers) {
      const shift = shifts?.find(s => s.staff_member_id === staff.id);
      if (!shift) continue;

      // Check if there's an exception that blocks the whole day
      const fullDayException = exceptions?.find(
        e => e.staff_member_id === staff.id && !e.start_time && !e.end_time
      );
      if (fullDayException) continue;

      // Parse shift times
      const startParts = shift.start_time.split(":");
      const endParts = shift.end_time.split(":");
      const startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
      const endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);

      // Generate time slots
      for (let mins = startMinutes; mins + duration <= endMinutes; mins += slotDuration) {
        const hours = Math.floor(mins / 60);
        const minutes = mins % 60;
        const timeStr = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
        const endMins = mins + duration;
        const endHours = Math.floor(endMins / 60);
        const endMinutes2 = endMins % 60;
        const endTimeStr = `${endHours.toString().padStart(2, "0")}:${endMinutes2.toString().padStart(2, "0")}`;

        // Check if slot is blocked by exception
        const exception = exceptions?.find(e => {
          if (e.staff_member_id !== staff.id) return false;
          if (!e.start_time || !e.end_time) return false;
          const excStartParts = e.start_time.split(":");
          const excEndParts = e.end_time.split(":");
          const excStart = parseInt(excStartParts[0]) * 60 + parseInt(excStartParts[1]);
          const excEnd = parseInt(excEndParts[0]) * 60 + parseInt(excEndParts[1]);
          return mins < excEnd && endMins > excStart;
        });
        if (exception) continue;

        // Check if slot is already booked
        const booking = reservations?.find(r => {
          if (r.staff_member_id !== staff.id) return false;
          const bookingTimeParts = r.time.split(":");
          const bookingStart = parseInt(bookingTimeParts[0]) * 60 + parseInt(bookingTimeParts[1]);
          let bookingEnd = bookingStart + 60; // Default 60 min
          if (r.end_time) {
            const endParts = r.end_time.split(":");
            bookingEnd = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);
          }
          return mins < bookingEnd && endMins > bookingStart;
        });
        if (booking) continue;

        slots.push({
          time: timeStr,
          staff_name: staff.name,
          staff_id: staff.id,
        });
      }
    }

    // Sort slots by time
    slots.sort((a, b) => a.time.localeCompare(b.time));

    return new Response(
      JSON.stringify({ success: true, date: dateStr, slots }),
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
