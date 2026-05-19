from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# API key from environment
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "YOUR_API_KEY_HERE")
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

# Health check endpoint
@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "OK", "service": "gemini-mood-ai"}), 200

@app.route("/gemini", methods=["POST"])
def gemini_generate():
    try:
        # Validate API key
        if not GEMINI_API_KEY or GEMINI_API_KEY == "YOUR_API_KEY_HERE":
            return jsonify({"error": "Gemini API key not configured"}), 500

        # Get request data
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        user_text = data.get("mood", "I'm feeling okay.")
        if not user_text.strip():
            return jsonify({"error": "Mood text cannot be empty"}), 400

        # Prepare the prompt for empathetic response
        prompt = f"""The user is sharing their current mood or feelings: "{user_text}"

Please respond empathetically and helpfully. Your response should:
1. Acknowledge their feelings with empathy
2. Provide gentle, supportive advice if appropriate
3. Be encouraging and positive
4. Keep the response conversational and warm
5. Be concise but meaningful (2-3 sentences)

Remember to be sensitive to their emotional state and avoid being overly clinical or dismissive."""

        # Prepare the request payload
        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.7,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 200,
                "stopSequences": []
            },
            "safetySettings": [
                {
                    "category": "HARM_CATEGORY_HARASSMENT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_HATE_SPEECH",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        }

        # Set headers
        headers = {
            "Content-Type": "application/json",
            "X-goog-api-key": GEMINI_API_KEY
        }

        # Make request to Gemini API
        logger.info(f"Making request to Gemini API for mood: {user_text[:50]}...")
        response = requests.post(GEMINI_URL, headers=headers, json=payload, timeout=30)

        if response.status_code != 200:
            logger.error(f"Gemini API error: {response.status_code} - {response.text}")
            return jsonify({
                "error": "Failed to generate response",
                "details": response.text
            }), response.status_code

        # Parse response
        response_data = response.json()
        
        # Extract the generated text
        if "candidates" in response_data and len(response_data["candidates"]) > 0:
            candidate = response_data["candidates"][0]
            if "content" in candidate and "parts" in candidate["content"]:
                generated_text = candidate["content"]["parts"][0]["text"]
                
                # Log successful response
                logger.info("Successfully generated mood response")
                
                return jsonify({
                    "response": generated_text,
                    "user_mood": user_text,
                    "timestamp": response_data.get("metadata", {}).get("candidates", [{}])[0].get("finishReason", "STOP")
                }), 200
            else:
                logger.error("Unexpected response structure from Gemini API")
                return jsonify({"error": "Unexpected response from AI service"}), 500
        else:
            logger.error("No candidates in Gemini API response")
            return jsonify({"error": "No response generated"}), 500

    except requests.exceptions.Timeout:
        logger.error("Request to Gemini API timed out")
        return jsonify({"error": "Request timed out"}), 504
    except requests.exceptions.RequestException as e:
        logger.error(f"Request error: {str(e)}")
        return jsonify({"error": "Network error occurred"}), 500
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

# Additional endpoint for testing
@app.route("/test", methods=["GET"])
def test_endpoint():
    return jsonify({
        "message": "Gemini Mood AI service is running",
        "api_key_configured": bool(GEMINI_API_KEY and GEMINI_API_KEY != "YOUR_API_KEY_HERE")
    }), 200

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5001))
    debug = os.getenv("FLASK_ENV", "production") == "development"
    
    logger.info(f"Starting Gemini Mood AI service on port {port}")
    app.run(host="0.0.0.0", port=port, debug=debug)
