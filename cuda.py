import torch
print(f"CUDA Available: {torch.cuda.is_available()}")
print(f"Device: {torch.cuda.get_device_name(0)}")
print(f"cuDNN Enabled: {torch.backends.cudnn.is_available()}")
print(f"cuDNN Version: {torch.backends.cudnn.version()}")