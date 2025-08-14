/*
  # Add Credit Management Functions

  1. New Functions
    - `deduct_credits` - Atomically deduct credits from user account
    - `refund_credits` - Refund credits to user account
    - `cleanup_old_rate_limits` - Clean up old rate limit entries

  2. Security
    - Functions use row-level security through user_profiles table
    - Atomic operations prevent race conditions
    - Credit limits enforced (max 300 credits)

  3. Features
    - Thread-safe credit deduction with FOR UPDATE locks
    - Automatic validation of sufficient credits
    - Safe refund operations with credit limits
    - Rate limit cleanup for performance
*/

-- Function to atomically deduct credits from user account
CREATE OR REPLACE FUNCTION public.deduct_credits(user_id_uuid uuid, amount_to_deduct integer)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
    current_credits integer;
    new_credits integer;
BEGIN
    -- Lock the user row to prevent race conditions
    SELECT credits INTO current_credits 
    FROM public.user_profiles 
    WHERE id = user_id_uuid 
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false, 
            'message', 'User profile not found',
            'available_credits', null,
            'required_credits', amount_to_deduct
        );
    END IF;

    IF current_credits < amount_to_deduct THEN
        RETURN json_build_object(
            'success', false, 
            'message', 'Insufficient credits',
            'available_credits', current_credits,
            'required_credits', amount_to_deduct
        );
    END IF;

    new_credits := current_credits - amount_to_deduct;

    UPDATE public.user_profiles
    SET credits = new_credits, updated_at = now()
    WHERE id = user_id_uuid;

    RETURN json_build_object(
        'success', true, 
        'message', 'Credits deducted successfully',
        'new_credits', new_credits,
        'available_credits', new_credits,
        'required_credits', amount_to_deduct
    );
END;
$$;

-- Function to refund credits to user account
CREATE OR REPLACE FUNCTION public.refund_credits(user_id_uuid uuid, amount_to_refund integer)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
    current_credits integer;
    new_credits integer;
    max_credits integer := 300; -- Maximum credit limit
BEGIN
    -- Lock the user row to prevent race conditions
    SELECT credits INTO current_credits 
    FROM public.user_profiles 
    WHERE id = user_id_uuid 
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false, 
            'message', 'User profile not found',
            'new_credits', null
        );
    END IF;

    -- Calculate new credits, but don't exceed maximum
    new_credits := LEAST(current_credits + amount_to_refund, max_credits);

    UPDATE public.user_profiles
    SET credits = new_credits, updated_at = now()
    WHERE id = user_id_uuid;

    RETURN json_build_object(
        'success', true, 
        'message', 'Credits refunded successfully',
        'new_credits', new_credits
    );
END;
$$;

-- Function to clean up old rate limit entries (older than 24 hours)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM public.rate_limits 
    WHERE created_at < now() - interval '24 hours';
END;
$$;