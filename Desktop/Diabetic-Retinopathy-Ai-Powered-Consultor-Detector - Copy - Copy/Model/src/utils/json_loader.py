import os
import json
from typing import List, Tuple, Dict, Any


def load_json(file_path: str) -> Dict[str, Any]:
    """Load a single JSON file."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    with open(file_path, "r") as f:
        return json.load(f)


def load_json_folder(folder_path: str) -> List[Tuple[str, Dict[str, Any]]]:
    """Load all JSON files from a folder."""
    if not os.path.exists(folder_path):
        raise FileNotFoundError(f"Folder not found: {folder_path}")

    data = []

    for file_name in os.listdir(folder_path):
        if file_name.endswith(".json"):
            file_path = os.path.join(folder_path, file_name)

            try:
                with open(file_path, "r") as f:
                    content = json.load(f)
                    data.append((file_name, content))
            except Exception as e:
                print(f"[ERROR] {file_name}: {e}")

    return data


def save_json(file_path: str, data: Dict[str, Any]) -> None:
    """Save dictionary to JSON file."""
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    with open(file_path, "w") as f:
        json.dump(data, f, indent=2)