import torch
import timm
import torch.nn as nn
from torchvision import transforms
from PIL import Image
from pathlib import Path
import os

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

classes = [
    "No DR",
    "Mild",
    "Moderate",
    "Severe",
    "Proliferative DR"
]


from pathlib import Path

def load_model():
    model = timm.create_model("efficientnet_b1", pretrained=False)

    model.classifier = nn.Sequential(
        nn.Dropout(0.5),
        nn.Linear(model.classifier.in_features, 5)
    )

    # Go to PROJECT ROOT (2 levels up from src/)
    model_path = Path(__file__).resolve().parents[2] / "improved_model.pth"

    print("Loading model from:", model_path)  # debug

    if not model_path.exists():
        raise FileNotFoundError(f"Model not found at: {model_path}")

    state_dict = torch.load(model_path, map_location=device)
    model.load_state_dict(state_dict)

    model.to(device)
    model.eval()

    return model

model = load_model()

def predict_image(image: Image.Image):
    try:
        image = transform(image).unsqueeze(0).to(device)

        with torch.no_grad():
            outputs = model(image)
            probs = torch.softmax(outputs, dim=1)[0]

        pred_idx = probs.argmax().item()
        confidence = probs.max().item()

        result = {
            "prediction": classes[pred_idx],
            "confidence": float(confidence),
            "all_probabilities": {
                classes[i]: float(probs[i].item())
                for i in range(len(classes))
            }
        }

        return result

    except Exception as e:
        return {
            "error": str(e)
        }