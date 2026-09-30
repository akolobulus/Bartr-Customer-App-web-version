import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// API endpoint for Bartr AI Voice / Assistant
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { prompt, history, currentLocation } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Local intelligent fallback with Nigerian context & autonomous actions
      const lower = (prompt || '').toLowerCase();
      let responseText = "I'm your Bartr assistant! How far? I can help you find nearby vetted artisans in Ikeja, get price estimates, or check your requests.";
      let action: any = null;

      if (lower.includes('phone') || lower.includes('screen') || lower.includes('cracked') || lower.includes('repair')) {
        responseText = "I found Chuka's Repairs and Ifeoma Tech Fix right on Otigba Street, Ikeja. Screen fixes typically go for ₦4,500 to ₦6,000 with genuine parts.";
        action = {
          type: 'SearchVendors',
          query: 'Phone Repair',
          category: 'Phone Repair',
          summary: 'Searched for Phone Repair'
        };
      } else if (lower.includes('nail') || lower.includes('beauty') || lower.includes('manicure') || lower.includes('pedicure') || lower.includes('adaeze')) {
        responseText = "Adaeze Nails & Beauty is 0.9km away on Allen Avenue. Top-rated for gel and acrylic nails with same-day appointments.";
        action = {
          type: 'SearchVendors',
          query: 'Nail Tech',
          category: 'Nail Tech',
          summary: 'Searched for Nail Tech'
        };
      } else if (lower.includes('car') || lower.includes('mechanic') || lower.includes('engine') || lower.includes('musa')) {
        responseText = "Musa Auto Care is 1.2km away along Mobolaji Bank Anthony Way. They do upfront diagnostics before touching the vehicle.";
        action = {
          type: 'SearchVendors',
          query: 'Mechanic',
          category: 'Mechanic',
          summary: 'Searched for Mechanic'
        };
      } else if (lower.includes('recenter') || lower.includes('center') || lower.includes('location')) {
        responseText = "Centered the map on your location at 14 Market Road, Ikeja.";
        action = {
          type: 'RecenterMap',
          locationName: '14 Market Road, Ikeja',
          summary: 'Centered map on 14 Market Road, Ikeja'
        };
      } else if (lower.includes('promo') || lower.includes('coupon') || lower.includes('discount')) {
        responseText = "I've opened the promotions page! You can use code BARTR500 for ₦500 off your next service.";
        action = {
          type: 'NavigateTo',
          destination: 'promotions',
          label: 'Promotions',
          summary: 'Opened Promotions'
        };
      } else if (lower.includes('request') || lower.includes('history') || lower.includes('past')) {
        responseText = "Opening your past requests! You have 4 recorded service jobs.";
        action = {
          type: 'NavigateTo',
          destination: 'my_requests',
          label: 'My Requests',
          summary: 'Opened My Requests'
        };
      } else if (lower.includes('payment') || lower.includes('cash') || lower.includes('card')) {
        responseText = "Opening payment options. Cash on completion is active by default.";
        action = {
          type: 'NavigateTo',
          destination: 'payments',
          label: 'Payments',
          summary: 'Opened Payments'
        };
      } else if (lower.includes('book') || lower.includes('hire')) {
        responseText = "Would you like me to book Chuka's Repairs for phone screen replacement at ₦5,000?";
        action = {
          type: 'BookVendor',
          vendorId: 'chuka',
          vendorName: "Chuka's Repairs",
          service: 'Phone screen repair',
          price: '₦5,000',
          requiresPermission: true,
          summary: "Request Chuka's Repairs for Phone screen repair (₦5,000)"
        };
      }

      return res.json({
        text: responseText,
        action,
        groundings: [
          { title: "Computer Village, Ikeja", snippet: "Otigba Street artisan hub" },
          { title: "Allen Avenue, Ikeja", snippet: "Commercial & beauty district" },
          { title: "Mobolaji Bank Anthony Way", snippet: "Ikeja auto repair precinct" }
        ]
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = `You are the AI voice dispatch assistant for 'Bartr', Nigeria's hyper-local marketplace for verified artisans and repairers in Ikeja, Lagos.
User is located at: ${currentLocation || '14 Market Road, Ikeja, Lagos'}.
Available vendors:
- Chuka's Repairs (Phone Repair, screen & battery replacement, rating 4.9, 0.4km, typical ₦4,500 – ₦6,000, final ₦5,000)
- Adaeze Nails & Beauty (Nail Tech, gel/acrylic/nail art, rating 4.8, 0.9km, typical ₦3,000 – ₦8,000, final ₦5,000)
- Musa Auto Care (Mechanic, general auto diagnostics, rating 4.7, 1.2km, typical ₦8,000 – ₦25,000, final ₦12,000)
- Ifeoma Tech Fix (Phone Repair, phone & tablet genuine parts, rating 4.7, 0.9km, typical ₦4,000 – ₦6,500, final ₦5,200)
- Bode's Gadget Clinic (Phone Repair, small electronics, rating 4.5, 1.6km, typical ₦3,500 – ₦5,500, final ₦4,200)

Keep your response brief (1 to 2 conversational sentences), warm, and spoken naturally with slight Nigerian warmth ("How far", "No wahala", "sorted").
Always return a JSON object with:
{
  "text": "spoken response",
  "action": { "type": "SearchVendors"|"FilterVendors"|"SelectVendor"|"NavigateTo"|"RecenterMap"|"ZoomMap"|"ApplyPromo"|"BookVendor"|"CalculateQuote", ...parameters, "summary": "action description", "requiresPermission": boolean } or null,
  "groundings": [{ "title": "Place name", "snippet": "detail" }]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json'
      }
    });

    const textContent = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(textContent);
    } catch {
      parsedData = { text: textContent, action: null, groundings: [] };
    }

    return res.json(parsedData);
  } catch (err: any) {
    console.error('Gemini error:', err);
    return res.json({
      text: "I heard you! Let me show you the trusted artisans nearby in Ikeja.",
      action: {
        type: 'SearchVendors',
        query: req.body?.prompt || 'Nearby artisans',
        summary: 'Search nearby artisans'
      },
      groundings: [{ title: 'Ikeja Central', snippet: 'Lagos artisan network' }]
    });
  }
});

// Setup Vite or static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bartr server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
