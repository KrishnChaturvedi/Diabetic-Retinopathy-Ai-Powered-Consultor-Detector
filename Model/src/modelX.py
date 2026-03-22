# This model is trained on ATPOS 2019 Blindness Detection Dataset 
import timm
import kagglehub
import os
import numpy as np
import pandas as pd
from PIL import Image

import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader, random_split
from torchvision import datasets, transforms
from timeit import default_timer as timer
from tqdm.auto import tqdm

from sklearn.utils.class_weight import compute_class_weight
from sklearn.model_selection import train_test_split

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

train_transform = transforms.Compose([
    transforms.RandomResizedCrop(224, scale=(0.8, 1.0)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(10),

    transforms.ColorJitter(
        brightness=0.1,
        contrast=0.1,
        saturation=0.1
    ),

    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

val_transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

# Dataset->
class DRDataset(Dataset):
    def __init__(self, csv_file, img_dir, transform=None, is_test=False):
        self.df = pd.read_csv(csv_file)
        self.img_dir = img_dir
        self.transform = transform
        self.is_test = is_test

    def __len__(self):
        return len(self.df)

    def __getitem__(self, idx):
        img_id = str(self.df.iloc[idx]["id_code"]).strip()
        img_path = os.path.join(self.img_dir, img_id + ".png")

        try:
            image = Image.open(img_path).convert("RGB")
        except:
            # skip or replace with blank image
            image = Image.new("RGB", (224, 224))

        if self.transform:
            image = self.transform(image)

        if self.is_test:
            return image, img_id   # no label in test

        label = int(self.df.iloc[idx]["diagnosis"])
        return image, torch.tensor(label, dtype=torch.long)


base_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(base_dir, "..", ".."))
data_dir = os.path.join(root_dir, "aptos2019-blindness-detection")

csv_path = os.path.join(data_dir, "train.csv")
test_csv_path = os.path.join(data_dir, "test.csv")

train_img_dir = os.path.join(data_dir, "train_images")
test_img_dir = os.path.join(data_dir, "test_images")

train_split_path = os.path.join(data_dir, "train_split.csv")
val_split_path = os.path.join(data_dir, "val_split.csv")

if not os.path.exists(train_split_path):
    print("Creating train/val split...")
    df = pd.read_csv(csv_path)

    train_df, val_df = train_test_split(
        df,
        test_size=0.2,
        stratify=df["diagnosis"],
        random_state=42
    )

    train_df.to_csv(train_split_path, index=False)
    val_df.to_csv(val_split_path, index=False)

train_df = pd.read_csv(train_split_path)

train_dataset = DRDataset(train_split_path, train_img_dir, train_transform)
val_dataset = DRDataset(val_split_path, train_img_dir, val_transform)
test_dataset = DRDataset(test_csv_path, test_img_dir, val_transform, is_test=True)

train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True, num_workers=2)
val_loader = DataLoader(val_dataset, batch_size=16, shuffle=False, num_workers=2)
test_loader = DataLoader(test_dataset, batch_size=16, shuffle=False, num_workers=2)

# Class weights->
labels = train_df["diagnosis"].values
class_weights = compute_class_weight(
    class_weight="balanced",
    classes=np.unique(labels),
    y=labels
)
class_weights = torch.tensor(class_weights, dtype=torch.float)

# Model ->
model = timm.create_model("efficientnet_b1", pretrained=True)
model.classifier = nn.Sequential(
    nn.Dropout(0.5),
    nn.Linear(model.classifier.in_features, 5)
)
model = model.to(device)

# Optimization ->
criterion = nn.CrossEntropyLoss(
    weight=class_weights.to(device),
    label_smoothing=0.1
)

optimizer = torch.optim.Adam(model.parameters(), lr=3e-5)
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=10)

# Training ->
scaler = torch.cuda.amp.GradScaler()

def train_one_epoch(model, loader):
    model.train()
    total_loss, correct, total = 0, 0, 0

    for images, labels in tqdm(loader):
        images, labels = images.to(device), labels.to(device)

        optimizer.zero_grad()

        with torch.cuda.amp.autocast():
            outputs = model(images)
            loss = criterion(outputs, labels)

        scaler.scale(loss).backward()
        scaler.step(optimizer)
        scaler.update()

        total_loss += loss.item()
        _, preds = torch.max(outputs, 1)
        correct += (preds == labels).sum().item()
        total += labels.size(0)

    return total_loss / len(loader), correct / total

def validate(model, loader):
    model.eval()
    total_loss, correct, total = 0, 0, 0

    with torch.no_grad():
        for images, labels in tqdm(loader):
            images, labels = images.to(device), labels.to(device)

            outputs = model(images)
            loss = criterion(outputs, labels)

            total_loss += loss.item()
            _, preds = torch.max(outputs, 1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)

    return total_loss / len(loader), correct / total

# Main ->
def main():
    epochs = 10
    best_acc = 0
    patience, counter = 3, 0

    for param in model.parameters():
        param.requires_grad = False
    for param in model.classifier.parameters():
        param.requires_grad = True

    start = timer()

    for epoch in range(epochs):

        if epoch == 3:
            print("Unfreezing model...")
            for param in model.parameters():
                param.requires_grad = True

        train_loss, train_acc = train_one_epoch(model, train_loader)
        val_loss, val_acc = validate(model, val_loader)

        scheduler.step()

        print(f"\nEpoch {epoch+1}")
        print(f"Train Loss: {train_loss:.4f}, Acc: {train_acc:.4f}")
        print(f"Val   Loss: {val_loss:.4f}, Acc: {val_acc:.4f}")

        if val_acc > best_acc:
            best_acc = val_acc
            counter = 0
            torch.save(model.state_dict(), "improved_model.pth")
        else:
            counter += 1

        if counter >= patience:
            print("Early stopping triggered")
            break


    # -------------------- INFERENCE --------------------
    model.eval()
    predictions = []

    with torch.no_grad():
        for images, ids in test_loader:
            images = images.to(device)
            outputs = model(images)
            _, preds = torch.max(outputs, 1)

            for img_id, pred in zip(ids, preds):
                predictions.append((img_id, pred.item()))

    submission = pd.DataFrame(predictions, columns=["id_code", "diagnosis"])
    submission.to_csv("submission.csv", index=False)


if __name__ == "__main__":
    main()