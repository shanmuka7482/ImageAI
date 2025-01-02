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

def alt_text_extension(alt_text:str):
    try:
        # initializing model
        llm = GoogleGenerativeAI(model="gemini-pro")
        template = "Expand the following alt text into a short, 2-3 line visual description. Focus on the main elements and overall scene. Keep it concise and easy to picture. Input:  {topic}"
        extension_prompt = PromptTemplate(input_variables=[type],template=template)
        chain = extension_prompt | llm | StrOutputParser()
        return chain.invoke(alt_text)
    except Exception as e:
        return f"Error in Extension: {str(e)}"


def Mask_Image(image_loc):
    image = Image.open(image_loc)
    mask = Image.new("RGB",image.size,(0,0,0))

    draw = ImageDraw.Draw(mask)
    draw.rectangle((50, 50, 150, 150), fill=(255, 255, 255))
    mask.save("mask.png")


@app.get("/")
def hello():
    return {"Message": "Hello"}

@app.post("/upload")
async def upload_img(file_data: FileData):
    try:
        # Decode the Base64 string
        img_data = base64.b64decode(file_data.basestring)
        with NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            temp_file.write(img_data)
            temp_file_path = temp_file.name

        # Call the image captioning tool
        response = image_captioning_tool(temp_file_path, file_data.apiKey, file_data.modelName)
        extended_text = alt_text_extension(response)
        # Mask_Image(temp_file_path)
        return {"Message": "Uploaded Successfully", "File_Path": temp_file_path, "Output": response,"Extended_text":extended_text}
    except Exception as e:
        return {"error": "Failed to process the request.", "details": str(e)}
