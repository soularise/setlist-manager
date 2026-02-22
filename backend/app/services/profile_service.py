from supabase import Client

from ..models.profile import ProfileUpdate


def get_profile(user_id: str, client: Client) -> dict:
    result = client.table("profiles").select("*").eq("id", user_id).single().execute()
    return result.data


def update_profile(user_id: str, data: ProfileUpdate, client: Client) -> dict:
    payload = data.model_dump(exclude_none=True)
    payload["updated_at"] = "now()"
    result = client.table("profiles").update(payload).eq("id", user_id).execute()
    return result.data[0]
