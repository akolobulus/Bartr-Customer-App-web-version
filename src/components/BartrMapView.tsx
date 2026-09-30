import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Plus, Minus } from 'lucide-react';
import { Vendor } from '../types';

interface BartrMapViewProps {
  vendors: Vendor[];
  selectedVendorId?: string | null;
  onVendorSelected: (vendor: Vendor) => void;
  isMiniMap?: boolean;
  trackedVendor?: Vendor | null;
  recenterTrigger?: number;
  className?: string;
}

export const BartrMapView: React.FC<BartrMapViewProps> = ({
  vendors,
  selectedVendorId,
  onVendorSelected,
  isMiniMap = false,
  trackedVendor = null,
  recenterTrigger = 0,
  className = ''
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const courierMarkerRef = useRef<L.Marker | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(isMiniMap ? 15 : 14.5);

  const userLat = 6.5980;
  const userLng = 3.3480;

  // 1. Initialize OpenStreetMap Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      const centerLat = trackedVendor ? (userLat + trackedVendor.lat) / 2 : userLat;
      const centerLng = trackedVendor ? (userLng + trackedVendor.lng) / 2 : userLng;

      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: isMiniMap ? 15 : 14.5,
        zoomControl: false,
        attributionControl: true,
      });

      // Standard OpenStreetMap Tile Layer
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>'
      }).addTo(map);

      // Dedicated layer group for vendor & user markers
      const markerGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markerGroup;

      leafletMapRef.current = map;

      // Handle dynamic resizing between mobile / desktop screens
      const resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });
      resizeObserver.observe(mapContainerRef.current);

      return () => {
        resizeObserver.disconnect();
        map.remove();
        leafletMapRef.current = null;
      };
    }
  }, [isMiniMap]);

  // 2. Handle Recenter / FlyTo Trigger
  useEffect(() => {
    if (leafletMapRef.current && recenterTrigger > 0) {
      leafletMapRef.current.flyTo([userLat, userLng], isMiniMap ? 15.5 : 14.8, {
        duration: 0.8
      });
    }
  }, [recenterTrigger, isMiniMap]);

  // 3. Update Markers, Routes, and Interactive Pins
  useEffect(() => {
    const map = leafletMapRef.current;
    const markerGroup = markersLayerRef.current;
    if (!map || !markerGroup) return;

    // Clear previous markers & routes
    markerGroup.clearLayers();

    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }
    if (courierMarkerRef.current) {
      courierMarkerRef.current.remove();
      courierMarkerRef.current = null;
    }

    // A. User Location Beacon (14 Market Road, Ikeja)
    const userIcon = L.divIcon({
      className: 'bartr-custom-marker',
      html: `
        <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
          <span class="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping"></span>
          <span class="relative w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center">
            <span class="w-3.5 h-3.5 rounded-full bg-[#0067F5]"></span>
          </span>
          <div class="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-[#0A2E65] text-[10px] font-bold px-2 py-0.5 rounded shadow border border-slate-200">
            14 Market Road
          </div>
        </div>
      `,
      iconSize: [20, 20],
    });

    const userMarker = L.marker([userLat, userLng], { icon: userIcon });
    markerGroup.addLayer(userMarker);

    // B. Full Map Mode: Display All Vendor Pins
    if (!isMiniMap) {
      vendors.forEach(vendor => {
        const isSelected = vendor.id === selectedVendorId;

        let badgeColor = '#0A2E65'; // REPAIR
        let iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>';

        if (vendor.iconType === 'BEAUTY') {
          badgeColor = '#2F9E63';
          iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>';
        } else if (vendor.iconType === 'MECHANIC') {
          badgeColor = '#C99A00';
          iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11 2 11.5 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>';
        }

        const vendorIcon = L.divIcon({
          className: 'bartr-custom-marker',
          html: `
            <div class="flex flex-col items-center -translate-x-1/2 -translate-y-full cursor-pointer hover:scale-105 transition-transform">
              <div style="background-color: ${badgeColor};" class="w-10 h-10 rounded-xl shadow-lg border-2 ${isSelected ? 'border-[#0067F5] ring-2 ring-[#0067F5]/50 scale-110' : 'border-white'} flex items-center justify-center">
                ${iconSvg}
              </div>
              <div class="mt-1 bg-white px-2 py-0.5 rounded-md shadow text-[10.5px] font-bold ${isSelected ? 'text-[#0067F5] border border-[#0067F5]' : 'text-[#0A2E65] border border-slate-200'} whitespace-nowrap flex items-center gap-1">
                <span>${vendor.name.split(' ')[0]}</span>
                <span class="text-slate-500 font-normal">★${vendor.ratingNum}</span>
              </div>
            </div>
          `,
          iconSize: [40, 56],
        });

        const vMarker = L.marker([vendor.lat, vendor.lng], { icon: vendorIcon });
        vMarker.on('click', () => onVendorSelected(vendor));
        markerGroup.addLayer(vMarker);
      });
    } else if (trackedVendor) {
      // C. MiniMap Mode: Tracked Vendor + Route Line + Courier Marker
      const vendorIcon = L.divIcon({
        className: 'bartr-custom-marker',
        html: `
          <div class="flex flex-col items-center -translate-x-1/2 -translate-y-full">
            <div class="w-11 h-11 rounded-xl shadow-xl bg-[#0A2E65] border-2 border-white flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            </div>
            <div class="mt-1 bg-[#0067F5] text-white px-2 py-0.5 rounded-md shadow text-[10px] font-bold whitespace-nowrap">
              ${trackedVendor.name}
            </div>
          </div>
        `,
        iconSize: [44, 60],
      });

      const vMarker = L.marker([trackedVendor.lat, trackedVendor.lng], { icon: vendorIcon });
      markerGroup.addLayer(vMarker);

      // OpenStreetMap polyline route
      const polyline = L.polyline(
        [[trackedVendor.lat, trackedVendor.lng], [userLat, userLng]],
        {
          color: '#0067F5',
          weight: 5,
          opacity: 0.85,
          dashArray: '8, 8',
        }
      ).addTo(map);
      routeLineRef.current = polyline;

      // Courier icon
      const courierIcon = L.divIcon({
        className: 'bartr-custom-marker',
        html: `
          <div class="w-7 h-7 rounded-full bg-[#0067F5] border-2 border-white shadow-lg flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11 2 11.5 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
          </div>
        `,
        iconSize: [28, 28]
      });

      const midLat = trackedVendor.lat * 0.4 + userLat * 0.6;
      const midLng = trackedVendor.lng * 0.4 + userLng * 0.6;
      const courierMarker = L.marker([midLat, midLng], { icon: courierIcon }).addTo(map);
      courierMarkerRef.current = courierMarker;
    }
  }, [vendors, selectedVendorId, isMiniMap, trackedVendor, onVendorSelected]);

  const handleZoomIn = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.zoomIn();
      setZoomLevel(leafletMapRef.current.getZoom());
    }
  };

  const handleZoomOut = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.zoomOut();
      setZoomLevel(leafletMapRef.current.getZoom());
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#e9efeb] ${className}`}>
      {/* OpenStreetMap Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Map status pill */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow border border-slate-200/90 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-semibold text-[#0A2E65]">
            {isMiniMap ? 'Live Tracking • Ikeja (OpenStreetMap)' : 'OpenStreetMap • Ikeja, Lagos'}
          </span>
        </div>
      </div>

      {/* Zoom controls (only in full map) */}
      {!isMiniMap && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
          <button
            onClick={handleZoomIn}
            aria-label="Zoom in"
            className="w-9 h-9 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-[#0A2E65] active:scale-95 transition-transform cursor-pointer hover:bg-slate-50"
          >
            <Plus size={18} />
          </button>
          <button
            onClick={handleZoomOut}
            aria-label="Zoom out"
            className="w-9 h-9 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-[#0A2E65] active:scale-95 transition-transform cursor-pointer hover:bg-slate-50"
          >
            <Minus size={18} />
          </button>
        </div>
      )}
    </div>
  );
};
