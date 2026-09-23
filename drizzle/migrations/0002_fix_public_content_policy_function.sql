ALTER FUNCTION public.is_portfolio_owner() SECURITY INVOKER;
GRANT EXECUTE ON FUNCTION public.is_portfolio_owner() TO anon, authenticated, service_role;