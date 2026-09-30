import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

function geminiApiPlugin() {
  return {
    name: 'gemini-api-plugin',
    configureServer(server: any) {
      server.middlewares.use('/api/gemini/chat', async (req: any, res: any) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          return res.end('Method Not Allowed');
        }

        let body = '';
        req.on('data', (chunk: any) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const { prompt, currentLocation } = JSON.parse(body || '{}');
            const apiKey = process.env.GEMINI_API_KEY;

            if (!apiKey) {
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
              } else if (lower.includes('nail') || lower.includes('beauty') || lower.includes('manicure') || lower.includes('adaeze')) {
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

              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({
                text: responseText,
                action,
                groundings: [
                  { title: "Computer Village, Ikeja", snippet: "Otigba Street artisan hub" },
                  { title: "Allen Avenue, Ikeja", snippet: "Commercial & beauty district" },
                  { title: "Mobolaji Bank Anthony Way", snippet: "Ikeja auto repair precinct" }
                ]
              }));
            }

            const ai = new GoogleGenAI({ apiKey });
            const systemInstruction = `You are the AI voice dispatch assistant for 'Bartr', Nigeria's hyper-local marketplace for verified artisans and repairers in Ikeja, Lagos.
User is located at: ${currentLocation || '14 Market Road, Ikeja, Lagos'}.
Available vendors:
- Chuka's Repairs (Phone Repair, screen & battery replacement, rating 4.9, 0.4km, typical ₦4,500 – ₦6,000, final ₦5,000)
- Adaeze Nails & Beauty (Nail Tech, gel/acrylic/nail art, rating 4.8, 0.9km, typical ₦3,000 – ₦8,000, final ₦5,000)
- Musa Auto Care (Mechanic, general auto diagnostics, rating 4.7, 1.2km, typical ₦8,000 – ₦25,000, final ₦12,000)
- Ifeoma Tech Fix (Phone Repair, phone & tablet genuine parts, rating 4.7, 0.9km, typical ₦4,000 – ₦6,000, final ₦5,200)
- Bode's Gadget Clinic (Phone Repair, small electronics, rating 4.5, 1.6km, typical ₦3,500 – ₦5,500, final ₦4,200)

Always return a JSON object with { "text": "...", "action": {...} or null, "groundings": [...] }`;

            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
              config: {
                systemInstruction,
                responseMimeType: 'application/json'
              }
            });

            res.setHeader('Content-Type', 'application/json');
            return res.end(response.text || '{}');
          } catch (error) {
            console.error('Gemini error:', error);
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({
              text: "I found verified artisans near you in Ikeja.",
              action: { type: 'SearchVendors', query: 'Artisans', summary: 'Search nearby artisans' },
              groundings: [{ title: 'Ikeja Central', snippet: 'Lagos artisan network' }]
            }));
          }
        });
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), geminiApiPlugin()],
  resolve: {
    alias: {
      '@vercel/analytics/next': '@vercel/analytics/react',
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});
