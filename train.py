from ultralytics import YOLO
from roboflow import Roboflow

# below downloads the pre-trained dataset. not sure if the api_key should be secretive but fuck it, i doubt it
rf = Roboflow(api_key="g5qng63cG0mim2C3ZDmk")
project = rf.workspace("david-lee-d0rhs").project("american-sign-language-letters")
version = project.version(1)
dataset = version.download("yolov11")

# load the model
model = YOLO("yolo11n.pt")

# training
train_results = model.train(
    data=f"{dataset.location}/data.yaml",  # path to dataset YAML
    epochs=201,  # number of training epochs
    imgsz=640,  # training image size
    device="cpu",  # device to run on, i.e. device=0 or device=0,1,2,3 or device=cpu
)

print("Model class names:", model.names)  # <- need this to know which numerical value corresponds to what letter