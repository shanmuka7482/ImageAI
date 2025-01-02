import torch
from diffusers import StableDiffusionImg2ImgPipeline
from PIL import Image

# Load the model
pipe = StableDiffusionImg2ImgPipeline.from_pretrained(
    "CompVis/stable-diffusion-v1-4", torch_dtype=torch.float16
).to("cuda")

# Load and preprocess the input image
init_image = Image.open("D:\Preap\Internship\infosys\Project-3\Test\GettyImages-803015182-H-2023.webp").convert("RGB")
init_image = init_image.resize((512, 512))

# Define the prompt for the desired avatar style
prompt = "A cartoon-style avatar of the input image"

# Generate the avatar
image = pipe(prompt=prompt, init_image=init_image, strength=0.75, guidance_scale=7.5).images[0]

# Save or display the generated avatar
image.save("generated_avatar.png")
