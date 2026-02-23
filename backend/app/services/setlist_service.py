from supabase import Client

from ..models.setlist import SetlistCreate, SetlistUpdate
from ..models.setlist_song import BreakCreate, ReorderRequest, SetlistSongCreate


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
    inserted_id = result.data[0]["id"]
    joined = (
        client.table("setlist_songs")
        .select("*, song:songs(*)")
        .eq("id", inserted_id)
        .single()
        .execute()
    )
    return joined.data


def add_break_to_setlist(setlist_id: str, data: BreakCreate, client: Client) -> dict:
    result = (
        client.table("setlist_songs")
        .insert({
            "setlist_id": setlist_id,
            "position": data.position,
            "break_label": data.break_label,
        })
        .execute()
    )
    return result.data[0]


def update_break_label(setlist_song_id: str, label: str, client: Client) -> dict:
    result = (
        client.table("setlist_songs")
        .update({"break_label": label})
        .eq("id", setlist_song_id)
        .execute()
    )
    return result.data[0]


def duplicate_setlist(setlist_id: str, user_id: str, client: Client) -> dict:
    original = client.table("setlists").select("*").eq("id", setlist_id).single().execute()
    sl = original.data

    new_sl = client.table("setlists").insert({
        "name": sl["name"] + " (copy)",
        "description": sl.get("description"),
        "user_id": user_id,
    }).execute()
    new_id = new_sl.data[0]["id"]

    songs = (
        client.table("setlist_songs")
        .select("*")
        .eq("setlist_id", setlist_id)
        .order("position")
        .execute()
    )
    if songs.data:
        client.table("setlist_songs").insert([
            {
                "setlist_id": new_id,
                "song_id": s.get("song_id"),
                "position": s["position"],
                "notes": s.get("notes"),
                "break_label": s.get("break_label"),
            }
            for s in songs.data
        ]).execute()

    return new_sl.data[0]


def remove_song_from_setlist(setlist_song_id: str, client: Client) -> None:
    client.table("setlist_songs").delete().eq("id", setlist_song_id).execute()


def reorder_songs(setlist_id: str, data: ReorderRequest, client: Client) -> None:
    # Phase 1: shift all positions to a safe offset to avoid unique constraint
    # conflicts when positions cross during the transition (e.g. 3→0 would clash
    # with the existing row at 0 before it has been moved).
    offset = 100_000
    for item in data.items:
        client.table("setlist_songs").update({"position": item.position + offset}).eq("id", item.id).eq(
            "setlist_id", setlist_id
        ).execute()
    # Phase 2: write the final positions now that the 0..n range is clear
    for item in data.items:
        client.table("setlist_songs").update({"position": item.position}).eq("id", item.id).eq(
            "setlist_id", setlist_id
        ).execute()
