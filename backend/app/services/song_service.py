from supabase import Client

from ..models.song import SongCreate, SongUpdate


def get_songs(user_id: str, client: Client) -> list[dict]:
    result = (
        client.table("songs")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    return result.data


def create_song(user_id: str, data: SongCreate, client: Client) -> dict:
    payload = data.model_dump(exclude_none=True)
    payload["user_id"] = user_id
    result = client.table("songs").insert(payload).execute()
    return result.data[0]


def update_song(song_id: str, data: SongUpdate, client: Client) -> dict:
    payload = data.model_dump(exclude_none=True)
    result = client.table("songs").update(payload).eq("id", song_id).execute()
    return result.data[0]


def delete_song(song_id: str, client: Client) -> None:
    client.table("songs").delete().eq("id", song_id).execute()
