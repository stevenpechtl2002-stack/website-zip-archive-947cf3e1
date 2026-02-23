
-- 1. customers table
CREATE TABLE public.customers (
  id uuid PRIMARY KEY,
  email text NOT NULL,
  company_name text,
  plan text NOT NULL DEFAULT 'starter',
  status text NOT NULL DEFAULT 'active',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own customer record" ON public.customers FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own customer record" ON public.customers FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin can manage all customers" ON public.customers FOR ALL USING (is_admin());
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. customer_api_keys table
CREATE TABLE public.customer_api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  api_key uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.customer_api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own api keys" ON public.customer_api_keys FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Users can update own api keys" ON public.customer_api_keys FOR UPDATE USING (auth.uid() = customer_id);
CREATE POLICY "Admin can manage all api keys" ON public.customer_api_keys FOR ALL USING (is_admin());
CREATE TRIGGER update_customer_api_keys_updated_at BEFORE UPDATE ON public.customer_api_keys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. notifications table
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info',
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- 4. voice_agent_config table
CREATE TABLE public.voice_agent_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  business_name text,
  industry text,
  opening_hours jsonb NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.voice_agent_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own config" ON public.voice_agent_config FOR ALL USING (auth.uid() = user_id);
CREATE TRIGGER update_voice_agent_config_updated_at BEFORE UPDATE ON public.voice_agent_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Enhanced handle_new_user trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Profile
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  -- Role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'salon');
  
  -- Customer record
  INSERT INTO public.customers (id, email, company_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'company_name');
  
  -- Auto API key
  INSERT INTO public.customer_api_keys (customer_id)
  VALUES (NEW.id);
  
  -- Welcome notification
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (NEW.id, 'Willkommen!', 'Dein Account wurde erfolgreich erstellt. Dein API-Key steht bereit.', 'success');
  
  RETURN NEW;
END;
$$;

-- 6. sync_reservation_to_contact trigger
CREATE OR REPLACE FUNCTION public.sync_reservation_to_contact()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _contact_id uuid;
BEGIN
  -- Find existing contact by phone, email, or name
  SELECT id INTO _contact_id FROM public.contacts
  WHERE user_id = NEW.user_id
    AND (
      (NEW.customer_phone IS NOT NULL AND phone = NEW.customer_phone)
      OR (NEW.customer_email IS NOT NULL AND email = NEW.customer_email)
      OR (name = NEW.customer_name)
    )
  LIMIT 1;

  IF _contact_id IS NOT NULL THEN
    UPDATE public.contacts
    SET booking_count = COALESCE(booking_count, 0) + 1,
        last_visit = NEW.date,
        updated_at = now()
    WHERE id = _contact_id;
  ELSE
    INSERT INTO public.contacts (user_id, name, phone, email, booking_count, last_visit)
    VALUES (NEW.user_id, NEW.customer_name, NEW.customer_phone, NEW.customer_email, 1, NEW.date);
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER sync_reservation_to_contact
AFTER INSERT ON public.reservations
FOR EACH ROW
EXECUTE FUNCTION public.sync_reservation_to_contact();
