/**
 * FaceSnap Gallery API Service
 * Handles communication with the backend API
 */

// Default local backend URL
const LOCAL_BACKEND_URL = 'http://localhost:5000';

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

let activeBackendUrl = REACT_APP_BACKEND_URL || LOCAL_BACKEND_URL;

// Store the active backend URL

let isBackendOnline = false;

/**
 * Check if the backend is online and update the status
 * @returns {Promise<{isOnline: boolean, tunnelUrl: string|null}>}
 */
export const checkBackendStatus = async () => {
  try {
    console.log('Checking backend status at:', activeBackendUrl);
    const response = await fetch(`${activeBackendUrl}/api/status`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      // Short timeout to avoid long waits if the backend is down
      signal: AbortSignal.timeout(3000)
    });

    if (response.ok) {
      const data = await response.json();
      isBackendOnline = true;
      if (data.tunnel_url && (data.tunnel_url.startsWith('http://') || data.tunnel_url.startsWith('https://'))) {
        activeBackendUrl = data.tunnel_url;
      } else {
        activeBackendUrl = LOCAL_BACKEND_URL;
      }
      return {
        isOnline: true,
        tunnelUrl: activeBackendUrl
      };
    }
    
    isBackendOnline = false;
    return {
      isOnline: false,
      tunnelUrl: null
    };
  } catch (error) {
    console.error('Backend status check failed:', error);
    isBackendOnline = false;
    return {
      isOnline: false,
      tunnelUrl: null
    };
  }
};

/**
 * Get all events from the backend
 * @returns {Promise<Array>} Array of event objects
 */
export const getEvents = async () => {
  if (!isBackendOnline) {
    throw new Error('Backend is offline');
  }

  try {
    console.log('Fetching events from:', activeBackendUrl);
    const response = await fetch(`${activeBackendUrl}/api/events`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

/**
 * Get a specific event by ID
 * @param {number} eventId - The ID of the event to fetch
 * @returns {Promise<Object>} The event object
 */
export const getEvent = async (eventId) => {
  if (!isBackendOnline) {
    throw new Error('Backend is offline');
  }

  try {
    console.log('Fetching event from:', activeBackendUrl);
    const response = await fetch(`${activeBackendUrl}/api/events/${eventId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch event: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching event ${eventId}:`, error);
    throw error;
  }
};

/**
 * Verify a selfie against the faces in an event
 * @param {number} eventId - The ID of the event
 * @param {File|Blob} selfieImage - The selfie image file or blob
 * @returns {Promise<Object>} The verification result
 */
export const verifySelfie = async (eventId, selfieImage, filename, contentType) => {
  if (!isBackendOnline) {
    throw new Error('Backend is offline');
  }

  try {
    console.log('Verifying selfie at:', activeBackendUrl);
    const formData = new FormData();
    formData.append('selfie', selfieImage, filename);
    formData.append('event_id', eventId);
    formData.append('content_type', contentType);

    const response = await fetch(`${activeBackendUrl}/api/verify`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Verification failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Selfie verification error:', error);
    throw error;
  }
};

/**
 * Get the gallery for a specific event and cluster
 * @param {number} eventId - The ID of the event
 * @param {number} clusterId - The ID of the face cluster
 * @returns {Promise<Object>} The gallery data
 */
export const getGallery = async (eventId, clusterId) => {
  if (!isBackendOnline) {
    throw new Error('Backend is offline');
  }

  try {
    console.log('Fetching gallery from:', activeBackendUrl);
    const response = await fetch(`${activeBackendUrl}/api/gallery/${eventId}/${clusterId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch gallery: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching gallery:', error);
    throw error;
  }
};