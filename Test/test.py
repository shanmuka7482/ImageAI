from diffusers import StableDiffusionPipeline, EulerDiscreteScheduler
import torch

model_id = "stabilityai/stable-diffusion-2-base"

# Use the Euler scheduler here instead
scheduler = EulerDiscreteScheduler.from_pretrained(model_id, subfolder="scheduler")
pipe = StableDiffusionPipeline.from_pretrained(model_id, scheduler=scheduler, torch_dtype=torch.float16)


prompt = "The image shows Robert Downey Jr. wearing a black suit and spectacles, with a blurred background. He is set to star in the upcoming movie The Avengers: Age of Ultron"
image = pipe(prompt).images[0]  
    
image.save("astronaut_rides_horse.png")
