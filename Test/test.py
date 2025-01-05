from huggingface_hub import InferenceClient
from PIL import Image
from io import BytesIO
import base64
import os
def image_creation(alt_text):
    client = InferenceClient("stabilityai/stable-diffusion-xl-base-1.0", token=os.environ.get('HUGGINGFACEHUB_API_TOKEN'))

    image = client.text_to_image(f"can you generate a tonnify avatar based on this description {alt_text}")
    print(f"Type of image: {type(image)}")

    image_format = "JPEG"  # Ensure format is a string, e.g., "JPEG" or "PNG"

    # Create a buffer to save the image into memory
    buffer = BytesIO()

    # Save the image into the buffer
    image.save(buffer, format=image_format)

    # Move to the beginning of the buffer
    buffer.seek(0)

    # Convert the image data to Base64 encoding
    base64_str = base64.b64encode(buffer.getvalue()).decode("utf-8")

    return base64_str

print(image_creation("The image shows a blue and gold macaw soaring through the air with its wings spread wide, its feathers glistening in the sunlight. The background is filled with lush green trees, providing a beautiful contrast to the vibrant colors of the bird."))