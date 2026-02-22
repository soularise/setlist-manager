def test_list_setlists(test_client, mock_client):
    _, builder = mock_client
    builder.execute.return_value.data = [
        {"id": "sl1", "name": "Friday Show", "description": None, "created_at": "2024-01-01T00:00:00"}
    ]
    resp = test_client.get("/api/setlists")
    assert resp.status_code == 200
    assert resp.json()[0]["name"] == "Friday Show"


def test_create_setlist(test_client, mock_client):
    _, builder = mock_client
    builder.execute.return_value.data = [
        {"id": "sl2", "name": "New Set", "description": "My set", "created_at": "2024-01-01T00:00:00"}
    ]
    resp = test_client.post("/api/setlists", json={"name": "New Set", "description": "My set"})
    assert resp.status_code == 201
    assert resp.json()["name"] == "New Set"


def test_reorder_songs(test_client, mock_client):
    _, builder = mock_client
    builder.execute.return_value.data = []
    items = [{"id": "ss1", "position": 0}, {"id": "ss2", "position": 1}]
    resp = test_client.put("/api/setlists/sl1/songs/reorder", json={"items": items})
    assert resp.status_code == 204
    # Verify update was called once per item
    assert builder.update.call_count == len(items)


def test_delete_setlist(test_client, mock_client):
    _, builder = mock_client
    builder.execute.return_value.data = []
    resp = test_client.delete("/api/setlists/sl1")
    assert resp.status_code == 204
