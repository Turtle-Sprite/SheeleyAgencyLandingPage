import { useEffect, useRef, useState } from "react";

interface AddressComponents {
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface AddressAutocompleteProps {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  onAddressChange: (components: AddressComponents) => void;
}

export function AddressAutocomplete({ 
  address,
  city,
  state,
  zipCode,
  onAddressChange
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string>("");
  const placesLibraryRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    const initServices = async () => {
      try {
        console.log('📍 Initializing Places library...');
        
        const placesLibrary = await window.google.maps.importLibrary("places") as any;
        
        if (!isMounted) return;

        placesLibraryRef.current = placesLibrary;

        console.log('📍 ✅ Places library loaded');

        if (isMounted) {
          setIsLoaded(true);
          setError("");
        }
      } catch (err) {
        console.error('📍 ❌ Error loading library:', err);
        if (isMounted) setError('Error loading address autocomplete');
      }
    };

    const handleGoogleMapsLoaded = () => {
      console.log('📍 Google Maps loaded event received');
      initServices();
    };

    window.addEventListener('google-maps-loaded', handleGoogleMapsLoaded);

    if (window.google?.maps?.importLibrary) {
      console.log('📍 Google Maps already loaded, initializing...');
      initServices();
    }

    return () => {
      isMounted = false;
      window.removeEventListener('google-maps-loaded', handleGoogleMapsLoaded);
    };
  }, []);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onAddressChange({
      address: value,
      city,
      state,
      zipCode
    });

    if (!value || value.length < 3) {
      setSuggestions([]);
      return;
    }

    if (!placesLibraryRef.current) {
      return;
    }

    try {
      console.log('📍 Getting suggestions for:', value);

      const { AutocompleteSuggestion } = placesLibraryRef.current;

      const request = {
        input: value,
        includedPrimaryTypes: ['street_address']
      };

      console.log('📍 Request:', request);
      console.log('📍 AutocompleteSuggestion:', AutocompleteSuggestion);

      const { suggestions: autocompleteSuggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);

      console.log('📍 Suggestions received:', autocompleteSuggestions);
      console.log('📍 Suggestions length:', autocompleteSuggestions?.length);

      if (autocompleteSuggestions && autocompleteSuggestions.length > 0) {
        setSuggestions(autocompleteSuggestions);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.error('📍 ❌ Error getting suggestions:', err);
      console.error('📍 Error details:', err instanceof Error ? err.message : String(err));
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = async (suggestion: any) => {
    console.log('📍 Suggestion clicked:', suggestion);
    console.log('📍 Suggestion structure:', JSON.stringify(suggestion, null, 2));

    if (!placesLibraryRef.current) {
      return;
    }

    try {
      const { Place } = placesLibraryRef.current;

      // Get place ID from the suggestion
      const placeId = suggestion.placePrediction?.placeId;
      
      console.log('📍 Place ID:', placeId);

      if (!placeId) {
        console.log('📍 ❌ No place ID found');
        return;
      }

      // Create a new Place with the place ID
      const place = new Place({
        id: placeId
      });

      console.log('📍 Fetching place details...');

      await place.fetchFields({
        fields: ['addressComponents', 'formattedAddress']
      });

      console.log('📍 Place details:', place);
      console.log('📍 Address components:', place.addressComponents);

      if (!place.addressComponents) {
        console.log('📍 ❌ No address components');
        return;
      }

      let streetNumber = '';
      let route = '';
      let locality = '';
      let administrativeArea = '';
      let postalCode = '';

      for (const component of place.addressComponents) {
        const types = component.types;
        
        console.log('📍 Component:', component.longText, types);
        
        if (types.includes('street_number')) {
          streetNumber = component.longText || '';
        }
        if (types.includes('route')) {
          route = component.longText || '';
        }
        if (types.includes('locality')) {
          locality = component.longText || '';
        }
        if (types.includes('administrative_area_level_1')) {
          administrativeArea = component.shortText || '';
        }
        if (types.includes('postal_code')) {
          postalCode = component.longText || '';
        }
      }

      const streetAddress = `${streetNumber} ${route}`.trim();

      console.log('📍 ✅ Parsed address:', {
        address: streetAddress,
        city: locality,
        state: administrativeArea,
        zipCode: postalCode
      });

      onAddressChange({
        address: streetAddress,
        city: locality,
        state: administrativeArea,
        zipCode: postalCode
      });

      setSuggestions([]);
    } catch (err) {
      console.error('📍 ❌ Error processing suggestion:', err);
    }
  };

  const handleManualChange = (field: keyof AddressComponents, value: string) => {
    onAddressChange({
      address: field === 'address' ? value : address,
      city: field === 'city' ? value : city,
      state: field === 'state' ? value : state,
      zipCode: field === 'zipCode' ? value : zipCode
    });
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <label htmlFor="address" className="block text-sm mb-2">
          Street Address *
        </label>
        <input
          ref={inputRef}
          type="text"
          id="address"
          name="address"
          required
          value={address}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0 && suggestionsRef.current) {
              suggestionsRef.current.style.display = 'block';
            }
          }}
          onBlur={() => {
            setTimeout(() => {
              if (suggestionsRef.current) {
                suggestionsRef.current.style.display = 'none';
              }
            }, 200);
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
          placeholder="Start typing your address..."
          autoComplete="off"
        />
        
        {suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="text-sm">{suggestion.placePrediction?.text?.toString() || 'Address'}</div>
              </div>
            ))}
          </div>
        )}
        
        {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
        {!isLoaded && !error && (
          <p className="text-gray-500 text-xs mt-1">Loading address autocomplete...</p>
        )}
      </div>

      <div className="grid grid-cols-[2fr_1fr_1fr] gap-4">
        <div>
          <label htmlFor="city" className="block text-sm mb-2">
            City *
          </label>
          <input
            type="text"
            id="city"
            name="city"
            required
            value={city}
            onChange={(e) => handleManualChange('city', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
            placeholder="City"
          />
        </div>
        <div>
          <label htmlFor="state" className="block text-sm mb-2">
            State *
          </label>
          <input
            type="text"
            id="state"
            name="state"
            required
            value={state}
            onChange={(e) => handleManualChange('state', e.target.value.toUpperCase())}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
            placeholder="State"
            maxLength={2}
          />
        </div>
        <div>
          <label htmlFor="zipCode" className="block text-sm mb-2">
            ZIP Code *
          </label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            required
            value={zipCode}
            onChange={(e) => handleManualChange('zipCode', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
            placeholder="ZIP Code"
            maxLength={10}
          />
        </div>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    google: any;
  }
}