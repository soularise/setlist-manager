from supabase import Client, create_client

from ..config import Settings


def get_user_client(token: str, settings: Settings) -> Client:
    """Returns a Supabase client authenticated with the user's JWT.
    PostgREST will enforce RLS policies using auth.uid() from this token.
    """
    client = create_client(settings.supabase_url, settings.supabase_anon_key)
    client.postgrest.auth(token)
    return client
