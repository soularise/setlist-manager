from supabase import Client

from ..models.setlist import SetlistCreate, SetlistUpdate
from ..models.setlist_song import ReorderRequest, SetlistSongCreate


def get_setlists(user_id: str, client: Client) -> list[dict]:
    result = (
        client.table("setlists")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    return result.data


def get_setlist(setlist_id: str, client: Client) -> dict:
    result = client.table("setlists").select("*").eq("id", setlist_id).single().execute()
    return result.data


def create_setlist(user_id: str, data: SetlistCreate, client: Client) -> dict:
    payload = data.model_dump(exclude_none=True)
    payload["user_id"] = user_id
    result = client.table("setlists").insert(payload).execute()
    return result.data[0]


def update_setlist(setlist_id: str, data: SetlistUpdate, client: Client) -> dict:
    payload = data.model_dump(exclude_none=True)
    result = client.table("setlists").update(payload).eq("id", setlist_id).execute()
    return result.data[0]


def delete_setlist(setlist_id: str, client: Client) -> None:
    client.table("setlists").delete().eq("id", setlist_id).execute()


def get_setlist_songs(setlist_id: str, client: Client) -> list[dict]:
    result = (
        client.table("setlist_songs")
        .select("*, song:songs(*)")
        .eq("setlist_id", setlist_id)
        .order("position")
        .execute()
    )
    return result.data


def add_song_to_setlist(setlist_id: str, data: SetlistSongCreate, client: Client) -> dict:
    payload = data.model_dump(exclude_none=True)
    payload["setlist_id"] = setlist_id
    result = client.table("setlist_songs").insert(payload).execute()
    return result.data[0]


def remove_song_from_setlist(setlist_song_id: str, client: Client) -> None:
    client.table("setlist_songs").delete().eq("id", setlist_song_id).execute()


def reorder_songs(setlist_id: str, data: ReorderRequest, client: Client) -> None:
    for item in data.items:
        client.table("setlist_songs").update({"position": item.position}).eq("id", item.id).eq(
            "setlist_id", setlist_id
        ).execute()
