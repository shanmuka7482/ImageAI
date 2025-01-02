# import base64
# import json

# with open("D:\Preap\Internship\infosys\Project-3\Test\Ara_ararauna_Luc_Viatour.jpg","rb") as file:
#     imagedata = file.read()
# jpgtext = base64.b64encode(imagedata).decode('utf-8')
# with open('jpg1.txt','w') as file:
#     file.write(jpgtext)

from transformers import pipeline
from PIL import Image
import os
from dotenv import load_dotenv
from langchain.tools import Tool

def image_captioning_tool(image_path: str) -> str:
    try:
        # Load the image
        image = Image.open(image_path)
        
        # Initialize the image captioning pipeline
        caption_pipeline = pipeline(
            "image-to-text", 
            model="microsoft/git-base",
            max_new_tokens=50
        )
        
        # Generate caption
        result = caption_pipeline(image)
        return result[0]['generated_text']
    except Exception as e:
        return f"Error processing image: {str(e)}"

# Wrap the function in a LangChain tool
image_caption_tool = Tool(
    name="Image Captioning Tool",
    func=image_captioning_tool,
    description="Generates a caption for a given image file path."
)

# Example of using the tool directly
if __name__ == "__main__":
    image_path = r"D:\Preap\Internship\infosys\Project-3\Test\Ara_ararauna_Luc_Viatour.jpg"
    print(f"Image caption: {image_caption_tool.func(image_path)}")
