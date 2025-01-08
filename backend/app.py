from fastapi import FastAPI
from pydantic import BaseModel
from tempfile import NamedTemporaryFile
import base64
from dotenv import load_dotenv
from transformers import pipeline
from PIL import Image
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
import os
from langchain.prompts import PromptTemplate
from langchain_openai import OpenAI
from langchain_core.output_parsers import StrOutputParser
from PIL import Image,ImageDraw
from langchain_google_genai import GoogleGenerativeAI
from huggingface_hub import InferenceClient
from io import BytesIO
import torch
from PIL import Image
from transformers import AutoProcessor, AutoModelForCausalLM 
import time

# Load environment variables
load_dotenv()

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Model
class FileData(BaseModel):
    basestring: str  # Base64-encoded string
    apiKey: Optional[str] = os.getenv("HUGGINGFACEHUB_API_TOKEN")
    modelName: Optional[str] = "microsoft/git-base"

# Image Captioning Function
def image_captioning_tool(image_path: str, apiKey: str, modelName: str) -> str:
    try:
        # Load the image
        image = Image.open(image_path)

        # Initialize the image captioning pipeline
        caption_pipeline = pipeline(
            "image-to-text",
            model=modelName,
            max_new_tokens=50,
        )

        # Generate caption
        result = caption_pipeline(image)
        return result[0]['generated_text']
    except Exception as e:
        return f"Error processing image: {str(e)}"

def alt_text_extended(task_prompt,image_loc,text_input=None):
    
    device = "cuda:0" if torch.cuda.is_available() else "cpu"
    torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32

    model = AutoModelForCausalLM.from_pretrained("microsoft/Florence-2-large", torch_dtype=torch_dtype, trust_remote_code=True).to(device)
    processor = AutoProcessor.from_pretrained("microsoft/Florence-2-large", trust_remote_code=True)

    image = Image.open(image_loc)
    if text_input is None:
        prompt = task_prompt
    else:
        prompt = task_prompt + text_input
    inputs = processor(text=prompt, images=image, return_tensors="pt").to(device, torch_dtype)
    generated_ids = model.generate(
      input_ids=inputs["input_ids"],
      pixel_values=inputs["pixel_values"],
      max_new_tokens=1024,
      num_beams=3
    )
    generated_text = processor.batch_decode(generated_ids, skip_special_tokens=False)[0]

    parsed_answer = processor.post_process_generation(generated_text, task=task_prompt, image_size=(image.width, image.height))
    return parsed_answer[prompt]

def image_creation(alt_text):
    try:
        client = InferenceClient("stabilityai/stable-diffusion-xl-base-1.0", token=os.environ.get('HUGGINGFACEHUB_API_TOKEN'))

        # output is a PIL.Image object
        image = client.text_to_image(f"can you generate a tonnify avatar based on this description {alt_text}")

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
    except Exception as e:
        return {"error": "Failed to process the request.", "details": str(e)}

@app.get("/")
def hello():
    return {"Message": "Hello"}

@app.post("/alt-Generate")
async def upload_img(file_data: FileData):
    try:
        # Decode the Base64 string
        img_data = base64.b64decode(file_data.basestring)
        with NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            temp_file.write(img_data)
            temp_file_path = temp_file.name

        # Call the image captioning tool
        response = image_captioning_tool(temp_file_path, file_data.apiKey, file_data.modelName)
        extended_text = alt_text_extended("<DETAILED_CAPTION>",temp_file_path)
        # Mask_Image(temp_file_path)
        return {"Message": "Uploaded Successfully", "File_Path": temp_file_path, "Output": response,"Extended_text":extended_text}
    except Exception as e:
        return {"error": "Failed to process the request.", "details": str(e)}
    finally:
        # Delete the temporary file after use
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
    
@app.post("/Image-Generate")
async def upload_img(file_data: FileData):
    try:
        # Decode the Base64 string
        img_data = base64.b64decode(file_data.basestring)
        with NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            temp_file.write(img_data)
            temp_file_path = temp_file.name
        start_time = time.time()
        text = alt_text_extended("<DETAILED_CAPTION>",temp_file_path)
        image = image_creation(text)
        end_time = time.time()
        # Mask_Image(temp_file_path)
        time_taken = end_time - start_time
        return {"Message": "Uploaded Successfully", "Text": text, "Output": image,"Time_Taken":'%.2f' %time_taken}
    except Exception as e:
        return {"error": "Failed to process the request.", "details": str(e)}
    finally:
        # Delete the temporary file after use
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
