# from huggingface_hub import InferenceClient
# from PIL import Image
# client = InferenceClient("stabilityai/stable-diffusion-xl-base-1.0", token="")

# # output is a PIL.Image object
# image = client.text_to_image("can you geberate a tonnify avatar based on this description It appears to be a photograph of a macaw with its wings spread, possibly in flight or about to take off.  The macaw is in the center of the image, with its wings spread wide, and it is facing towards the left side of the frame. It has a vibrant blue and yellow plumage, with a long tail and sharp beak. The background is blurry, but it appears to be a forest or jungle, with green trees and foliage visible in the distance.")

# image.save("output_image.png", format="PNG")

import base64
from openai import OpenAI

client = OpenAI(
    base_url="https://api-inference.huggingface.co/v1/",
    api_key=""
)

# Read and encode the local image
image_path = "D:\Preap\Internship\infosys\Project-3\Test\Ara_ararauna_Luc_Viatour.jpg"
with open(image_path, "rb") as image_file:
    encoded_image = base64.b64encode(image_file.read()).decode("utf-8")

# Prepare the message with the encoded image
messages = [
    {
        "role": "user",
        "content": "Describe this image in one sentence.",
        "image_data": encoded_image  # Assuming the API expects this key
    }
]

# Make the API call
completion = client.chat.completions.create(
    model="Qwen/Qwen2-VL-7B-Instruct",
    messages=messages,
    max_tokens=300
)

print(completion.choices[0])

