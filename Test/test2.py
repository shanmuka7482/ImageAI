from huggingface_hub import InferenceClient
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
import os
from typing import Optional
import time
from PIL import Image
import io
from datetime import datetime

class OptimizedInferenceClient:
    def __init__(self, model_id: str, token: Optional[str] = None):
        self.client = InferenceClient(model_id, token=token)
        self.cache = {}
        
    def text_to_image(self, prompt: str, 
                      num_inference_steps: int = 30,
                      batch_size: int = 1,
                      use_cache: bool = True,
                      save_path: Optional[str] = None):
        """
        Optimized text to image generation with caching and batch processing
        
        Args:
            prompt: Text prompt for image generation
            num_inference_steps: Number of denoising steps (lower = faster, higher = better quality)
            batch_size: Number of images to generate in parallel
            use_cache: Whether to use prompt caching
            save_path: Directory to save the generated images
        """
        # Check cache first
        if use_cache and prompt in self.cache:
            print("Using cached result")
            return self.cache[prompt]
        
        try:
            # Reduce inference steps for faster generation
            start_time = time.time()
            
            # Generate images in batch
            images = []
            for i in range(0, batch_size, max(1, batch_size)):
                batch = min(batch_size - i, max(1, batch_size))
                
                image = self.client.text_to_image(
                    prompt,
                    num_inference_steps=num_inference_steps,
                )
                images.append(image)
                
                # Save image if path is provided
                if save_path:
                    self._save_image(images[0], save_path, i, prompt)
            
            end_time = time.time()
            print(f"Generation took {end_time - start_time:.2f} seconds")
            
            # Cache the result
            if use_cache:
                self.cache[prompt] = images[0]
            
            return images[0] if batch_size == 1 else images
            
        except Exception as e:
            print(f"Error during image generation: {str(e)}")
            return None
    
    def _save_image(self, image_data, save_path: str, index: int, prompt: str):
        """
        Save the generated image to disk
        """
        try:
            # Create save directory if it doesn't exist
            os.makedirs(save_path, exist_ok=True)
            
            # Create a timestamp for unique filename
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            
            # Create a safe filename from the prompt
            safe_prompt = "".join(x for x in prompt[:30] if x.isalnum() or x in (' ', '-', '_')).strip()
            filename = f"{safe_prompt}_{timestamp}_{index}.png"
            
            # Save the image directly
            filepath = os.path.join(save_path, filename)
            
            # If image_data is already a PIL Image
            if isinstance(image_data, Image.Image):
                image_data.save(filepath)
            else:
                # If image_data is bytes, write directly to file
                with open(filepath, 'wb') as f:
                    f.write(image_data)
                    
            print(f"Image saved successfully at: {filepath}")
            
        except Exception as e:
            print(f"Error saving image: {str(e)}")
            raise  # Re-raise the exception to see the full error trace

    def clear_cache(self):
        """Clear the prompt cache"""
        self.cache = {}

def generate_optimized_image(prompt: str, token: Optional[str] = None, save_dir: str = "generated_images"):
    client = OptimizedInferenceClient(
        "stabilityai/stable-diffusion-2-base",
        token=token
    )
    
    # Generate with optimized settings
    image = client.text_to_image(
        prompt,
        num_inference_steps=20,  # Reduced steps for faster inference
        use_cache=True,  # Enable caching
        save_path=save_dir  # Specify save directory
    )
    
    return image

# Example usage
if __name__ == "__main__":
    token = os.environ.get('HUGGINGFACEHUB_API_TOKEN')
    alt_text = 'The image shows Robert Downey Jr. wearing a black suit and spectacles, with a blurred background. He is set to star in the upcoming movie The Avengers: Age of Ultron'
    save_directory = "generated_images"  # Directory where images will be saved
    
    image = generate_optimized_image(
        f"can you generate a tonnify avatar based on this description {alt_text}",
        token,
        save_directory
    )
    image.save("new.jpg")
    # print(type(image))